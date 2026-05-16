"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const Agent = dynamic(() => import("@/components/Agent"), { ssr: false });
import ResumeUpload from "@/components/ResumeUpload";
import { Button } from "@/components/ui/button";

interface InterviewSelectorProps {
  user: User | null;
  initialMode?: "standard" | "resume";
}

export default function InterviewSelector({
  user,
  initialMode = "standard",
}: InterviewSelectorProps) {
  const [mode, setMode] = useState<"standard" | "resume">(initialMode);
  const userId = user?.id ?? "";
  const userName = user?.name ?? "there";

  return (
    <div className="flex flex-col gap-8 items-center w-full mt-4">
      <div className="flex gap-4 p-2 bg-dark-200 rounded-lg w-fit">
        <Button
          variant={mode === "standard" ? "default" : "ghost"}
          onClick={() => setMode("standard")}
          className={mode === "standard" ? "bg-primary text-black" : ""}
        >
          Standard AI Interview
        </Button>
        <Button
          variant={mode === "resume" ? "default" : "ghost"}
          onClick={() => setMode("resume")}
          className={mode === "resume" ? "bg-primary text-black" : ""}
        >
          Resume-Based Interview
        </Button>
      </div>

      <div className="w-full flex justify-center mt-4">
        {mode === "standard" ? (
          <div className="w-full flex justify-center flex-col items-center">
            <Agent userName={userName} userId={userId} type="generate" />
          </div>
        ) : (
          <ResumeUpload userId={userId} />
        )}
      </div>
    </div>
  );
}
