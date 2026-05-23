import { NextResponse } from "next/server";
const pdfParse = require("pdf-parse");
import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const interviewType = (formData.get("interviewType") as string) || "mixed";
    const questionCount = parseInt(
      (formData.get("questionCount") as string) || "8",
      10
    );

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract text from PDF
    const data = await pdfParse(buffer);
    const resumeText = data.text;

    // Build type-specific instructions
    let typeInstruction = "";
    if (interviewType === "technical") {
      typeInstruction =
        "Generate ONLY technical interview questions. Focus on coding, system design, data structures, algorithms, and the specific technologies mentioned in the resume. Do NOT include any behavioral or situational questions.";
    } else if (interviewType === "behavioral") {
      typeInstruction =
        "Generate ONLY behavioral interview questions using the STAR method format. Focus on teamwork, leadership, conflict resolution, problem-solving scenarios, and past experience. Do NOT include any coding or technical questions.";
    } else {
      typeInstruction =
        "Generate a mix of both technical and behavioral interview questions. Roughly half should be technical (coding, system design, technologies) and half should be behavioral (teamwork, leadership, past experience). Alternate between the two types.";
    }

    // Generate questions using Groq
    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `
        Analyze the following resume text and generate professional interview questions 
        based on the candidate's skills, projects, technologies, and experience mentioned.
        
        Resume Text:
        ${resumeText}
        
        Interview Type Instructions:
        ${typeInstruction}
        
        Generate exactly ${questionCount} questions.
        
        You MUST return ONLY a raw JSON array of ${questionCount} strings. 
        Example: ["Question 1", "Question 2", "Question 3"]
        Do not return markdown, backticks, or any conversational filler. Return just the raw JSON array.
      `,
      system:
        "You are an expert technical interviewer tasked with creating tailored interview questions based on a candidate's resume. Follow the interview type instructions precisely.",
    });

    let questions = [];
    try {
      const cleanText = text.trim().replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
      questions = JSON.parse(cleanText);
    } catch (e) {
      try {
        const match = text.match(/\[[\s\S]*\]/);
        questions = match ? JSON.parse(match[0]) : [];
      } catch (fallbackError) {
        console.error("Failed to parse extracted JSON:", text);
        throw new Error("Invalid question format received from AI");
      }
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
