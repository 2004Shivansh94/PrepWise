import { NextResponse } from "next/server";
const pdfParse = require("pdf-parse");
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
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

    // Generate questions using Groq
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `
        Analyze the following resume text and generate professional interview questions 
        based on the candidate's skills, projects, technologies, and experience mentioned.
        
        Resume Text:
        ${resumeText}
        
        You MUST return ONLY a raw JSON array of 5 to 8 strings. 
        Example: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"]
        Do not return markdown, backticks, or any conversational filler. Return just the raw JSON array.
      `,
      system: "You are an expert technical interviewer tasked with creating tailored interview questions based on a candidate's resume.",
    });

    let questions;
    try {
      questions = JSON.parse(text.trim().replace(/^```json/, '').replace(/```$/, ''));
    } catch (e) {
      // Fallback extraction
      const match = text.match(/\[.*\]/s);
      questions = match ? JSON.parse(match[0]) : [];
    }

    return NextResponse.json({ questions });
  } catch (error: any) {
    console.error("Error processing resume:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process resume" },
      { status: 500 }
    );
  }
}
