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

export default function ResumeUpload({ userId }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
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

  return (
    <div className="flex flex-col gap-6 w-full max-w-md p-6 border border-dark-300 rounded-xl bg-dark-200">
      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold">Resume-Based Interview</h3>
        <p className="text-sm text-gray-400">
          Upload your PDF resume to generate personalized interview questions based on your experience and skills.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="resume">Resume (PDF)</Label>
          <Input 
            id="resume" 
            type="file" 
            accept="application/pdf" 
            onChange={handleFileChange} 
            disabled={loading}
          />
        </div>

        <Button 
          onClick={handleUpload} 
          disabled={!file || loading}
          className="w-full btn-primary"
        >
          {loading ? "Processing..." : "Generate Interview"}
        </Button>
      </div>
    </div>
  );
}
