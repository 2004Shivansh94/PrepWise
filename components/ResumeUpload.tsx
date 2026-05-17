"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createResumeInterview } from "@/lib/actions/general.action";
import { toast } from "sonner";

interface ResumeUploadProps {
  userId: string;
}

const interviewTypes = [
  { value: "mixed", label: "Mixed (Technical + Behavioural)" },
  { value: "technical", label: "Technical Only" },
  { value: "behavioral", label: "Behavioural Only" },
];

const questionCounts = [5, 8, 10, 15];

export default function ResumeUpload({ userId }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [interviewType, setInterviewType] = useState("mixed");
  const [questionCount, setQuestionCount] = useState(8);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("interviewType", interviewType);
      formData.append("questionCount", questionCount.toString());

      // Upload and extract text via API
      const apiRes = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData,
      });

      const data = await apiRes.json();

      if (!apiRes.ok || data.error) {
        throw new Error(data.error || "Failed to process resume");
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions could be generated from the resume");
      }

      // Save the generated questions using Firebase Server Action
      const { success, interviewId } = await createResumeInterview({
        userId,
        questions: data.questions,
        interviewType,
        questionCount,
      });

      if (!success || !interviewId) {
        throw new Error("Failed to save interview session");
      }

      toast.success("Resume processed successfully! Starting interview...");
      router.push(`/interview/${interviewId}`);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const selectedTypeLabel =
    interviewTypes.find((t) => t.value === interviewType)?.label ?? "";

  return (
    <div
      className="flex flex-col w-full max-w-md p-8 rounded-2xl"
      style={{
        gap: "1.5rem",
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex flex-col" style={{ gap: "0.5rem" }}>
        <h3 className="text-xl font-semibold" style={{ color: "#f1f5f9" }}>
          Resume-Based Interview
        </h3>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          Upload your PDF resume and customize your mock interview experience.
        </p>
      </div>

      <div className="flex flex-col" style={{ gap: "1.25rem" }}>
        {/* File upload */}
        <div className="flex flex-col" style={{ gap: "0.5rem" }}>
          <Label
            htmlFor="resume"
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Resume (PDF)
          </Label>
          <Input
            id="resume"
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading}
            className="cursor-pointer"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "10px 16px",
              color: "rgba(255,255,255,0.6)",
            }}
          />
          {file && (
            <p className="text-xs" style={{ color: "#6ee7b7" }}>
              ✓ {file.name}
            </p>
          )}
        </div>

        {/* Interview Type */}
        <div className="flex flex-col" style={{ gap: "0.5rem" }}>
          <Label
            htmlFor="interviewType"
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Interview Type
          </Label>
          <select
            id="interviewType"
            value={interviewType}
            onChange={(e) => setInterviewType(e.target.value)}
            disabled={loading}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "10px 16px",
              color: "rgba(255,255,255,0.8)",
              fontSize: "14px",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.4)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 16px center",
              cursor: "pointer",
            }}
          >
            {interviewTypes.map((type) => (
              <option
                key={type.value}
                value={type.value}
                style={{ background: "#0f1623", color: "#f1f5f9" }}
              >
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Question Count */}
        <div className="flex flex-col" style={{ gap: "0.5rem" }}>
          <Label
            htmlFor="questionCount"
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Number of Questions
          </Label>
          <div className="flex" style={{ gap: "0.5rem" }}>
            {questionCounts.map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => setQuestionCount(count)}
                disabled={loading}
                className="flex-1 rounded-xl text-sm font-semibold py-2.5 transition-all duration-200"
                style={{
                  background:
                    questionCount === count
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "rgba(255,255,255,0.03)",
                  border:
                    questionCount === count
                      ? "1px solid rgba(99,102,241,0.5)"
                      : "1px solid rgba(255,255,255,0.08)",
                  color:
                    questionCount === count
                      ? "#fff"
                      : "rgba(255,255,255,0.5)",
                  cursor: "pointer",
                  boxShadow:
                    questionCount === count
                      ? "0 0 20px rgba(99,102,241,0.25)"
                      : "none",
                }}
              >
                {count}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        {file && (
          <div
            className="flex flex-col rounded-xl p-4"
            style={{
              gap: "0.25rem",
              background: "rgba(99,102,241,0.06)",
              border: "0.5px solid rgba(99,102,241,0.15)",
            }}
          >
            <p
              className="text-xs font-semibold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.25)" }}
            >
              Summary
            </p>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
              {questionCount} {selectedTypeLabel.toLowerCase()} questions from{" "}
              <span style={{ color: "#a5b4fc" }}>{file.name}</span>
            </p>
          </div>
        )}

        {/* Submit */}
        <Button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full rounded-xl font-semibold text-sm py-3 transition-all cursor-pointer"
          style={{
            background:
              !file || loading
                ? "rgba(255,255,255,0.05)"
                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: !file || loading ? "rgba(255,255,255,0.3)" : "#fff",
            boxShadow:
              !file || loading
                ? "none"
                : "0 0 25px rgba(99,102,241,0.3)",
            border: "none",
          }}
        >
          {loading ? "Processing your resume..." : "Generate Interview"}
        </Button>
      </div>
    </div>
  );
}
