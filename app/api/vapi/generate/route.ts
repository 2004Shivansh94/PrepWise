import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const body = await request.json();

  // Vapi sends tool calls inside message.toolCallList
  const toolCall = body?.message?.toolCallList?.[0];
  const args = toolCall?.function?.arguments ?? body;

  const { role, level, type, techstack, amount, userid } = args;

  try {
    const { text: questions } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Prepare questions for a job interview.
        The job role is ${role}.
        The job experience level is ${level}.
        The tech stack used in the job is: ${techstack}.
        The focus between behavioural and technical questions should lean towards: ${type}.
        The amount of questions required is: ${amount}.
        Please return only the questions, without any additional text.
        The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
        Return the questions formatted like this:
        ["Question 1", "Question 2", "Question 3"]
        Thank you! <3`,
    });

    let parsedQuestions = [];
    try {
      const match = questions.match(/\[[\s\S]*\]/);
      if (match) {
        parsedQuestions = JSON.parse(match[0]);
      } else {
        parsedQuestions = JSON.parse(questions);
      }
    } catch (parseError) {
      console.error("Failed to parse questions array:", questions);
      throw new Error("Invalid response format from AI");
    }

    const interview = {
      role,
      type,
      level,
      techstack: typeof techstack === "string" ? techstack.split(",").map((t: string) => t.trim()) : (Array.isArray(techstack) ? techstack : []),
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    // This is the response shape Vapi expects back
    return Response.json(
      {
        results: [
          {
            toolCallId: toolCall?.id,
            result:
              "Interview generated successfully! You can now go back to the dashboard to take your interview.",
          },
        ],
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return Response.json(
      {
        results: [
          {
            toolCallId: toolCall?.id,
            result: `I'm sorry, I encountered an error while generating the interview questions: ${error.message}. Let's try again.`,
          },
        ],
      },
      { status: 200 }
    );
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
