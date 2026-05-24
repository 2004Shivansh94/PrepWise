import { generateText } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

const generateInterviewSchema = z.object({
  role: z.string().trim().min(1, "Role is required"),
  level: z.preprocess(
    (val) =>
      typeof val === "string"
        ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
        : val,
    z.enum(["Junior", "Mid", "Senior"])
  ),
  type: z.preprocess(
    (val) =>
      typeof val === "string"
        ? val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()
        : val,
    z.enum(["Technical", "Behavioral", "Mixed"])
  ),
  techstack: z.union([z.string(), z.array(z.string())]).default(""),
  amount: z.coerce.number().int().min(3).max(10),
  userid: z.string().trim().min(1, "User ID is required"),
});

const toTechStackArray = (techstack: string | string[]) => {
  if (Array.isArray(techstack)) {
    return techstack.map((tech) => tech.trim()).filter(Boolean);
  }
  const normalized = techstack.trim();
  if (
    !normalized ||
    normalized.toLowerCase() === "none" ||
    normalized.toLowerCase() === "skip"
  ) {
    return [];
  }
  return normalized
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);
};

/**
 * Recursively extract all tool call arguments from whatever shape Vapi sends.
 * Returns { toolCallId, toolCallName, args } or null.
 */
function extractToolCall(body: unknown): {
  toolCallId: string | undefined;
  toolCallName: string | undefined;
  args: Record<string, unknown>;
} | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  // Pattern 1: message.toolWithToolCallList[0].toolCall
  const message = b.message as Record<string, unknown> | undefined;
  if (message) {
    const twList = message.toolWithToolCallList;
    if (Array.isArray(twList) && twList.length > 0) {
      const first = twList[0] as Record<string, unknown>;
      const tc = first.toolCall as Record<string, unknown> | undefined;
      if (tc) {
        const fn = tc.function as Record<string, unknown> | undefined;
        let args = fn?.arguments ?? fn?.parameters;
        if (typeof args === "string") {
          try {
            args = JSON.parse(args);
          } catch {
            // not JSON
          }
        }
        if (args && typeof args === "object") {
          return {
            toolCallId: tc.id as string | undefined,
            toolCallName: fn?.name as string | undefined,
            args: args as Record<string, unknown>,
          };
        }
      }
    }

    // Pattern 2: message.toolCallList[0] or message.toolCalls[0]
    for (const key of ["toolCallList", "toolCalls"]) {
      const list = message[key];
      if (Array.isArray(list) && list.length > 0) {
        const first = list[0] as Record<string, unknown>;
        const fn = first.function as Record<string, unknown> | undefined;
        let args = fn?.arguments ?? fn?.parameters;
        if (typeof args === "string") {
          try {
            args = JSON.parse(args);
          } catch {
            // not JSON
          }
        }
        if (args && typeof args === "object") {
          return {
            toolCallId: first.id as string | undefined,
            toolCallName: fn?.name as string | undefined,
            args: args as Record<string, unknown>,
          };
        }
      }
    }
  }

  // Pattern 3: top-level toolCallList or toolCalls
  for (const key of ["toolCallList", "toolCalls"]) {
    const list = b[key];
    if (Array.isArray(list) && list.length > 0) {
      const first = list[0] as Record<string, unknown>;
      const fn = first.function as Record<string, unknown> | undefined;
      let args = fn?.arguments ?? fn?.parameters;
      if (typeof args === "string") {
        try {
          args = JSON.parse(args);
        } catch {
          // not JSON
        }
      }
      if (args && typeof args === "object") {
        return {
          toolCallId: first.id as string | undefined,
          toolCallName: fn?.name as string | undefined,
          args: args as Record<string, unknown>,
        };
      }
    }
  }

  // Pattern 4: body itself has the fields directly (fallback)
  if (b.role || b.userid) {
    return {
      toolCallId: undefined,
      toolCallName: "generateInterview",
      args: b,
    };
  }

  return null;
}

function buildToolResponse({
  toolCallId,
  toolCallName,
  result,
  error,
}: {
  toolCallId: string | undefined;
  toolCallName: string | undefined;
  result?: string;
  error?: string;
}) {
  if (!toolCallId) {
    return Response.json(
      error ? { success: false, error } : { success: true, result },
      { status: error ? 500 : 200 }
    );
  }

  return Response.json(
    {
      results: [
        {
          toolCallId,
          name: toolCallName ?? "generateInterview",
          result: error || result,
        },
      ],
    },
    { status: 200 }
  );
}

export async function POST(request: Request) {
  let toolCallId: string | undefined;
  let toolCallName: string | undefined;

  try {
    const body = await request.json();
    console.log("[vapi/generate] raw body:", JSON.stringify(body, null, 2));

    const extracted = extractToolCall(body);
    if (!extracted) {
      throw new Error("Could not extract tool call arguments from Vapi payload");
    }

    toolCallId = extracted.toolCallId;
    toolCallName = extracted.toolCallName;
    const args = extracted.args;

    console.log("[vapi/generate] extracted args:", args);

    const { role, level, type, techstack, amount, userid } =
      generateInterviewSchema.parse(args);

    const techStackArray = toTechStackArray(techstack);
    const techStackPrompt =
      techStackArray.length > 0
        ? techStackArray.join(", ")
        : "general role-relevant skills";

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `
        Prepare exactly ${amount} interview questions for a mock job interview.

        Job role: ${role}
        Experience level: ${level}
        Interview focus: ${type}
        Core tools or technologies: ${techStackPrompt}

        Requirements:
        - Return short, clear questions that a voice assistant can read naturally.
        - Avoid slashes, asterisks, markdown, numbering, and special formatting.
        - Keep the questions appropriate for the requested experience level.
        - For Behavioral interviews, focus on experience, collaboration, communication, ownership, and decision-making.
        - For Technical interviews, focus on role-relevant practical knowledge and problem solving.
        - For Mixed interviews, include both technical and behavioral questions.

        You MUST return ONLY a raw JSON array of ${amount} strings representing the questions.
        Example: ["Question 1", "Question 2", "Question 3"]
        Do not return markdown, backticks, or any conversational filler. Return just the raw JSON array.
      `,
      system:
        "You are an expert interviewer creating concise mock interview questions. Return ONLY a raw JSON array of strings.",
    });

    let generatedQuestions: string[] = [];
    try {
      const cleanText = text
        .trim()
        .replace(/^```json\s*/i, "")
        .replace(/\s*```$/i, "");
      generatedQuestions = JSON.parse(cleanText);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        generatedQuestions = JSON.parse(match[0]);
      }
    }

    if (!Array.isArray(generatedQuestions) || generatedQuestions.length === 0) {
      throw new Error("AI did not return a valid array of questions");
    }

    const interview = {
      role,
      type,
      level,
      techstack: techStackArray,
      questions: generatedQuestions.slice(0, amount),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return buildToolResponse({
      toolCallId,
      toolCallName,
      result:
        "Interview generated successfully! You can now go back to the dashboard to take your interview.",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("[vapi/generate] Error:", error);

    return buildToolResponse({
      toolCallId,
      toolCallName,
      error: `I'm sorry, I encountered an error while generating the interview questions: ${message}. Let's try again.`,
    });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}