import { generateObject } from "ai";
import { groq } from "@ai-sdk/groq";
import { z } from "zod";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

const generateInterviewSchema = z.object({
  role: z.string().trim().min(1, "Role is required"),
  level: z.enum(["Junior", "Mid", "Senior"]),
  type: z.enum(["Technical", "Behavioral", "Mixed"]),
  techstack: z.union([z.string(), z.array(z.string())]).default(""),
  amount: z.coerce.number().int().min(3).max(10),
  userid: z.string().trim().min(1, "User ID is required"),
});

const questionsSchema = z.object({
  questions: z.array(z.string().trim().min(1)).min(3).max(10),
});

type ToolCallPayload = {
  id?: string;
  function?: {
    name?: string;
    arguments?: unknown;
    parameters?: unknown;
  };
};

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null;
};

const getNestedRecord = (
  value: Record<string, unknown>,
  key: string
): Record<string, unknown> | undefined => {
  const nested = value[key];
  return isRecord(nested) ? nested : undefined;
};

const getFirstToolCall = (
  value: Record<string, unknown>,
  key: string
): ToolCallPayload | undefined => {
  const list = value[key];
  const first = Array.isArray(list) ? list[0] : undefined;
  return isRecord(first) ? (first as ToolCallPayload) : undefined;
};

const getToolCall = (body: unknown): ToolCallPayload | undefined => {
  if (!isRecord(body)) return undefined;
  const message = getNestedRecord(body, "message");

  return (
    (message && getFirstToolCall(message, "toolCallList")) ||
    (message && getFirstToolCall(message, "toolCalls")) ||
    getFirstToolCall(body, "toolCallList") ||
    getFirstToolCall(body, "toolCalls")
  );
};

const parseToolArguments = (body: unknown) => {
  const toolCall = getToolCall(body);

  let args = toolCall?.function?.arguments ?? body;

  if (typeof args === "string") {
    args = JSON.parse(args);
  }

  return { toolCall, args };
};

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

  return normalized.split(",").map((tech) => tech.trim()).filter(Boolean);
};

const buildToolResponse = ({
  toolCall,
  result,
  error,
}: {
  toolCall?: ToolCallPayload;
  result?: string;
  error?: string;
}) => {
  if (!toolCall?.id) {
    return Response.json(
      error ? { success: false, error } : { success: true, result },
      { status: error ? 500 : 200 }
    );
  }

  return Response.json(
    {
      results: [
        {
          toolCallId: toolCall.id,
          name: toolCall?.function?.name ?? "generateInterview",
          result: error || result,
        },
      ],
    },
    { status: 200 }
  );
};

export async function POST(request: Request) {
  let toolCall: ToolCallPayload | undefined;

  try {
    const body = await request.json();
    const parsedTool = parseToolArguments(body);
    toolCall = parsedTool.toolCall;

    const { role, level, type, techstack, amount, userid } =
      generateInterviewSchema.parse(parsedTool.args);

    const techStackArray = toTechStackArray(techstack);
    const techStackPrompt =
      techStackArray.length > 0
        ? techStackArray.join(", ")
        : "general role-relevant skills";

    const { object } = await generateObject({
      model: groq("llama-3.3-70b-versatile"),
      schema: questionsSchema,
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
      `,
      system:
        "You are an expert interviewer creating concise mock interview questions. Return only data matching the requested schema.",
    });

    const interview = {
      role,
      type,
      level,
      techstack: techStackArray,
      questions: object.questions.slice(0, amount),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return buildToolResponse({
      toolCall,
      result:
        "Interview generated successfully! You can now go back to the dashboard to take your interview.",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error:", error);

    return buildToolResponse({
      toolCall,
      error: `I'm sorry, I encountered an error while generating the interview questions: ${message}. Let's try again.`,
    });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}
