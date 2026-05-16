import dayjs from "dayjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

type CategoryScore = {
  name: string;
  score: number;
  comment?: string;
};

const clampScore = (score?: number) =>
  typeof score === "number" ? Math.min(Math.max(score, 0), 100) : 0;

const getReadiness = (score: number) => {
  if (score >= 80) {
    return {
      label: "Strong",
      description: "You are showing interview-ready signals.",
      className: "text-success-100 bg-success-100/10 border-success-100/25",
    };
  }

  if (score >= 60) {
    return {
      label: "Developing",
      description: "You are close. Tighten the weak spots before retaking.",
      className: "text-primary-200 bg-primary-200/10 border-primary-200/25",
    };
  }

  return {
    label: "Needs Practice",
    description: "Focus on the priority areas before the next attempt.",
    className: "text-destructive-100 bg-destructive-100/10 border-destructive-100/25",
  };
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "bg-success-100";
  if (score >= 60) return "bg-primary-200";
  return "bg-destructive-100";
};

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user?.id) redirect("/sign-in");

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  const totalScore = clampScore(feedback?.totalScore);
  const readiness = getReadiness(totalScore);
  const categories: CategoryScore[] = Array.isArray(feedback?.categoryScores)
    ? feedback.categoryScores.map((category) => ({
        name: category.name,
        score: clampScore(category.score),
        comment: category.comment,
      }))
    : feedback?.categoryScores
      ? Object.entries(feedback.categoryScores).map(([name, score]) => ({
          name,
          score: clampScore(Number(score)),
        }))
      : [];
  const weakestCategory = categories.reduce<CategoryScore | null>(
    (weakest, category) =>
      !weakest || category.score < weakest.score ? category : weakest,
    null
  );
  const actionPlan =
    feedback?.areasForImprovement?.slice(0, 3).filter(Boolean) ?? [];
  const fallbackActions = [
    "Review your weakest category and prepare one sharper example.",
    "Practice answering aloud with a 60-90 second structure.",
    "Retake the interview once your examples feel clear and specific.",
  ];
  const nextActions = actionPlan.length > 0 ? actionPlan : fallbackActions;
  const formattedDate = feedback?.createdAt
    ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
    : "Not available";

  return (
    <section className="section-feedback">
      <div className="feedback-hero">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="feedback-kicker">Interview feedback</span>
            <span
              className={`rounded-full border px-3 py-1 text-xs font-semibold ${readiness.className}`}
            >
              {readiness.label}
            </span>
          </div>

          <div>
            <h1 className="capitalize">{interview.role} Interview</h1>
            <p className="mt-3 max-w-3xl">
              {feedback?.finalAssessment ||
                "Your feedback is still being prepared. Use this page after completing an interview to review your coaching notes."}
            </p>
          </div>

          <div className="feedback-meta">
            <span>{interview.type}</span>
            <span>{interview.level}</span>
            <span className="flex items-center gap-2">
              <Calendar className="size-4 text-primary-200" />
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="score-card">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-light-100">
              Overall score
            </span>
            <Star className="size-5 fill-primary-200 text-primary-200" />
          </div>
          <div className="mt-5 flex items-end gap-2">
            <span className="text-6xl font-bold text-white">{totalScore}</span>
            <span className="pb-2 text-xl font-semibold text-light-100">
              /100
            </span>
          </div>
          <p className="mt-4 text-sm">{readiness.description}</p>
        </div>
      </div>

      {weakestCategory && (
        <div className="priority-card">
          <div className="icon-badge">
            <Target className="size-5" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-200">
              Top priority
            </p>
            <h2 className="mt-2 text-2xl">
              Improve {weakestCategory.name.toLowerCase()}
            </h2>
            <p className="mt-2">
              This was your lowest scoring area at {weakestCategory.score}/100.
              {weakestCategory.comment ? ` ${weakestCategory.comment}` : ""}
            </p>
          </div>
        </div>
      )}

      <div className="feedback-grid">
        <div className="feedback-panel lg:col-span-2">
          <div className="feedback-panel-heading">
            <div>
              <p className="feedback-kicker">Performance breakdown</p>
              <h2>Category scores</h2>
            </div>
            <TrendingUp className="size-5 text-primary-200" />
          </div>

          <div className="mt-6 flex flex-col gap-5">
            {categories.length > 0 ? (
              categories.map((category) => (
                <div
                  key={category.name}
                  className="rounded-lg border border-light-800 bg-dark-100/40 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold text-white">{category.name}</p>
                    <p className="font-bold text-primary-200">
                      {category.score}/100
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-dark-200">
                    <div
                      className={`h-full rounded-full ${getScoreColor(category.score)}`}
                      style={{ width: `${category.score}%` }}
                    />
                  </div>
                  {category.comment && (
                    <p className="mt-3 text-base leading-6">
                      {category.comment}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p>No category scores are available for this interview yet.</p>
            )}
          </div>
        </div>

        <div className="feedback-panel">
          <div className="feedback-panel-heading">
            <div>
              <p className="feedback-kicker">Next retake</p>
              <h2>Action plan</h2>
            </div>
            <Sparkles className="size-5 text-primary-200" />
          </div>

          <ol className="mt-6 flex list-none flex-col gap-4 p-0">
            {nextActions.map((action, index) => (
              <li
                key={`${action}-${index}`}
                className="flex gap-3 text-light-100"
              >
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-200 text-sm font-bold text-dark-100">
                  {index + 1}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="insight-grid">
        <div className="feedback-panel">
          <div className="feedback-panel-heading">
            <div>
              <p className="feedback-kicker">Keep doing</p>
              <h2>Strengths</h2>
            </div>
            <CheckCircle2 className="size-5 text-success-100" />
          </div>

          <ul className="mt-5 flex list-none flex-col gap-3 p-0">
            {feedback?.strengths?.length ? (
              feedback.strengths.map((strength, index) => (
                <li key={`${strength}-${index}`} className="feedback-list-item">
                  {strength}
                </li>
              ))
            ) : (
              <li className="text-light-100">
                Complete an interview to surface your strongest signals.
              </li>
            )}
          </ul>
        </div>

        <div className="feedback-panel">
          <div className="feedback-panel-heading">
            <div>
              <p className="feedback-kicker">Work on next</p>
              <h2>Areas for improvement</h2>
            </div>
            <AlertCircle className="size-5 text-destructive-100" />
          </div>

          <ul className="mt-5 flex list-none flex-col gap-3 p-0">
            {feedback?.areasForImprovement?.length ? (
              feedback.areasForImprovement.map((area, index) => (
                <li key={`${area}-${index}`} className="feedback-list-item">
                  {area}
                </li>
              ))
            ) : (
              <li className="text-light-100">
                No improvement areas were generated for this interview.
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="buttons">
        <Button asChild className="btn-primary flex-1">
          <Link href={`/interview/${id}`} className="flex w-full justify-center">
            <RotateCcw className="size-4" />
            Retake Interview
          </Link>
        </Button>

        <Button asChild className="btn-secondary flex-1">
          <Link href="/" className="flex w-full justify-center">
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default Feedback;
