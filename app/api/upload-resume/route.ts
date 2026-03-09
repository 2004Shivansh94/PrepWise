import { NextResponse } from "next/server";
const pdfParse = require("pdf-parse");
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const data = await pdfParse(buffer);
    const resumeText = data.text;

    // Generate questions using Gemini
    const { object } = await generateObject({
      model: google("gemini-2.0-flash-001"),
      schema: z.object({
        questions: z.array(z.string()).min(5).max(8),
      }),
      prompt: `
        Analyze the following resume text and generate professional interview questions 
        based on the candidate's skills, projects, technologies, and experience mentioned.
        
        Resume Text:
        ${resumeText}
        
        Provide the output purely as a list of questions without any conversational filler.
      `,
      system: "You are an expert technical interviewer tasked with creating tailored interview questions based on a candidate's resume.",
    });

    return NextResponse.json({ questions: object.questions });
  } catch (error: any) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process resume" },
      { status: 500 }
    );
  }
}
