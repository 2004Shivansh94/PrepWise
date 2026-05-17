"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { vapi } from "@/lib/vapi.sdk";
import { interviewer, generateInterviewer } from "@/constants";
import { createFeedback } from "@/lib/actions/general.action";

enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

interface SavedMessage {
  role: "user" | "system" | "assistant";
  content: string;
}

const Agent = ({
  userName,
  userId,
  interviewId,
  feedbackId,
  type,
  questions,
}: AgentProps) => {
  const router = useRouter();
  const [callStatus, setCallStatus] = useState<CallStatus>(CallStatus.INACTIVE);
  const [messages, setMessages] = useState<SavedMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>("");

  // Refs for Web Audio API and Canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
    const onCallEnd = () => setCallStatus(CallStatus.FINISHED);

    const onMessage = (message: Message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const newMessage = { role: message.role, content: message.transcript };
        setMessages((prev) => [...prev, newMessage]);
      }
    };

    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onError = (error: Error) => console.log("Error:", error);

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);
    vapi.on("speech-start", onSpeechStart);
    vapi.on("speech-end", onSpeechEnd);
    vapi.on("error", onError);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
      vapi.off("speech-start", onSpeechStart);
      vapi.off("speech-end", onSpeechEnd);
      vapi.off("error", onError);
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setLastMessage(messages[messages.length - 1].content);
    }

    const handleGenerateFeedback = async (messages: SavedMessage[]) => {
      const { success, feedbackId: id } = await createFeedback({
        interviewId: interviewId!,
        userId: userId!,
        transcript: messages,
        feedbackId,
      });

      if (success && id) {
        router.push(`/interview/${interviewId}/feedback`);
      } else {
        router.push("/");
      }
    };

    if (callStatus === CallStatus.FINISHED) {
      if (type === "generate") {
        router.push("/");
      } else {
        if (messages.length > 0) {
          handleGenerateFeedback(messages);
        } else {
          router.push("/");
        }
      }
    }
  }, [messages, callStatus, feedbackId, interviewId, router, type, userId]);

  // Audio visualizer loop
  useEffect(() => {
    if (callStatus === CallStatus.ACTIVE) {
      let audioCtx: AudioContext | null = null;
      let analyserNode: AnalyserNode | null = null;
      let micStream: MediaStream | null = null;
      let sourceNode: MediaStreamAudioSourceNode | null = null;

      const initAudio = async () => {
        try {
          micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          streamRef.current = micStream;

          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;

          analyserNode = audioCtx.createAnalyser();
          analyserNode.fftSize = 64; // smaller FFT size for smooth responsive bars
          analyserRef.current = analyserNode;

          sourceNode = audioCtx.createMediaStreamSource(micStream);
          sourceNode.connect(analyserNode);

          if (canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              const bufferLength = analyserNode.frequencyBinCount;
              const dataArray = new Uint8Array(bufferLength);

              const draw = () => {
                if (!canvasRef.current || !analyserRef.current) return;
                animationRef.current = requestAnimationFrame(draw);

                analyserRef.current.getByteFrequencyData(dataArray);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const barCount = 18;
                const barWidth = canvas.width / barCount;

                const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
                gradient.addColorStop(0, "#6366f1"); // Indigo
                gradient.addColorStop(0.5, "#06b6d4"); // Cyan
                gradient.addColorStop(1, "#8b5cf6"); // Violet

                ctx.fillStyle = gradient;

                for (let i = 0; i < barCount; i++) {
                  const distFromCenter = Math.abs(i - barCount / 2);
                  const dataIndex = Math.min(
                    bufferLength - 1,
                    Math.floor(distFromCenter * (bufferLength / (barCount / 2)) * 0.7)
                  );
                  const value = dataArray[dataIndex] || 0;
                  const barHeight = Math.max(3, (value / 255) * canvas.height * 0.85);

                  const x = i * barWidth + (barWidth - 4) / 2;
                  const y = (canvas.height - barHeight) / 2;

                  ctx.beginPath();
                  if (ctx.roundRect) {
                    ctx.roundRect(x, y, 4, barHeight, 2);
                  } else {
                    ctx.rect(x, y, 4, barHeight);
                  }
                  ctx.fill();
                }
              };

              draw();
            }
          }
        } catch (err) {
          console.error("Error accessing microphone for visualizer:", err);
        }
      };

      initAudio();

      return () => {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }

        if (sourceNode) {
          sourceNode.disconnect();
        }
        if (analyserRef.current) {
          analyserRef.current.disconnect();
          analyserRef.current = null;
        }
        if (audioContextRef.current) {
          if (audioContextRef.current.state !== "closed") {
            audioContextRef.current.close().catch((err) => console.log(err));
          }
          audioContextRef.current = null;
        }

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };
    }
  }, [callStatus]);

  const handleCall = async () => {
    setCallStatus(CallStatus.CONNECTING);

    try {
      if (type === "generate") {
        await vapi.start(generateInterviewer, {
          variableValues: { userid: userId },
        });
      } else {
        let formattedQuestions = "";
        if (questions) {
          formattedQuestions = questions
            .map((question) => `- ${question}`)
            .join("\n");
        }

        await vapi.start(interviewer, {
          variableValues: { questions: formattedQuestions },
        });
      }
    } catch (error) {
      console.error("Failed to start call:", error);
      setCallStatus(CallStatus.INACTIVE);
    }
  };

  const handleDisconnect = () => {
    setCallStatus(CallStatus.FINISHED);
    vapi.stop();
  };

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="profile-image"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>
          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content flex flex-col items-center justify-center" style={{ gap: "1rem" }}>
            <div className="relative flex items-center justify-center size-[120px]">
              <Image
                src="/user-avatar.png"
                alt="profile-image"
                width={539}
                height={539}
                className={cn(
                  "rounded-full object-cover size-full transition-all duration-500 relative z-10",
                  callStatus === CallStatus.ACTIVE && "ring-4 ring-indigo-500/20 scale-105"
                )}
              />
              {callStatus === CallStatus.ACTIVE && (
                <span className="absolute inset-0 rounded-full animate-ping bg-indigo-500/10 opacity-75" />
              )}
            </div>

            {callStatus === CallStatus.ACTIVE && (
              <canvas
                ref={canvasRef}
                width={140}
                height={32}
                className="opacity-90 transition-opacity duration-300"
              />
            )}

            <h3 style={{ margin: 0 }}>{userName}</h3>
          </div>
        </div>
      </div>

      {messages.length > 0 && (
        <div className="transcript-border">
          <div className="transcript">
            <p
              key={lastMessage}
              className={cn(
                "transition-opacity duration-500 opacity-0",
                "animate-fadeIn opacity-100"
              )}
            >
              {lastMessage}
            </p>
          </div>
        </div>
      )}

      <div className="w-full flex justify-center">
        {callStatus !== "ACTIVE" ? (
          <button className="relative btn-call" onClick={handleCall}>
            <span
              className={cn(
                "absolute animate-ping rounded-full opacity-75",
                callStatus !== "CONNECTING" && "hidden"
              )}
            />
            <span className="relative">
              {callStatus === "INACTIVE" || callStatus === "FINISHED"
                ? "Call"
                : ". . ."}
            </span>
          </button>
        ) : (
          <button className="btn-disconnect" onClick={handleDisconnect}>
            End
          </button>
        )}
      </div>
    </>
  );
};

export default Agent;
