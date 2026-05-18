import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  Play, 
  Upload, 
  Award, 
  Layers, 
  Clock, 
  Flame,
  ArrowRight,
  Sparkles
} from "lucide-react";

import { getCurrentUser } from "@/lib/actions/auth.action";
import { 
  getInterviewsByUserId, 
  getFeedbackByUserId 
} from "@/lib/actions/general.action";
import DashboardCharts from "@/components/DashboardCharts";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const [interviews, feedbacks] = await Promise.all([
    getInterviewsByUserId(user.id),
    getFeedbackByUserId(user.id),
  ]);

  const safeInterviews = interviews || [];
  const safeFeedbacks = feedbacks || [];

  // 1. Calculate stats metrics
  const totalInterviews = safeInterviews.length;
  
  const avgScore = totalInterviews > 0 && safeFeedbacks.length > 0
    ? Math.round(safeFeedbacks.reduce((acc, f) => acc + f.totalScore, 0) / safeFeedbacks.length)
    : 0;

  const totalSpeakingTime = totalInterviews * 15; // Estimate 15 mins per session

  // Dynamic practice streak calculator (based on unique interview dates)
  const calculateStreak = () => {
    if (totalInterviews === 0) return 0;
    
    const dates = safeInterviews.map(i => 
      new Date(i.createdAt).toDateString()
    );
    const uniqueDates = Array.from(new Set(dates)).map(d => new Date(d));
    uniqueDates.sort((a, b) => b.getTime() - a.getTime()); // Sort descending (newest first)

    let streak = 0;
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    let checkDate = new Date(today);
    
    // Check if they did one today or yesterday to start the streak
    const hasTodayOrYesterday = uniqueDates.some(d => {
      const diff = Math.abs(today.getTime() - d.getTime());
      return diff <= 24 * 60 * 60 * 1000;
    });

    if (!hasTodayOrYesterday) return 0;

    for (let i = 0; i < uniqueDates.length; i++) {
      const uDate = uniqueDates[i];
      uDate.setHours(0, 0, 0, 0);
      
      const diff = Math.abs(checkDate.getTime() - uDate.getTime());
      if (diff === 0) {
        streak++;
        // Move checkDate to yesterday
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (diff === 24 * 60 * 60 * 1000) {
        streak++;
        checkDate = new Date(uDate);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break; // Streak broken
      }
    }
    return streak;
  };

  const currentStreak = calculateStreak();

  // Create a mapping of interviewId to target role for recent feedback table mapping
  const interviewRoles: Record<string, string> = {};
  safeInterviews.forEach((i) => {
    interviewRoles[i.id] = i.role;
  });

  return (
    <div className="flex flex-col gap-10 py-10 px-4 md:px-6 max-w-7xl mx-auto w-full">
      
      {/* Dynamic Dashboard Page Welcome Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-primary-200 uppercase tracking-widest">
          <Sparkles className="size-4 animate-pulse" />
          <span>Candidate Intelligence Center</span>
        </div>
        <h2 className="text-4xl font-extrabold text-white glow-text">Welcome back, {user.name}</h2>
        <p className="text-light-100/50 text-base">
          Analyze your mock parameters, track target scores, and view diagnostic feedback.
        </p>
      </div>

      {/* 1. Hero Action Hub */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Interview CTA Box */}
        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-transparent backdrop-blur-md p-6 md:p-8 shadow-2xl flex flex-col justify-between min-h-[220px]">
          {/* Subtle neon ambient ring */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-700 blur" />
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Practice Standard AI Mock</h3>
            <p className="text-light-100/60 text-sm leading-relaxed max-w-sm">
              Initiate a real-time speech dialogue mockup with our active AI voice agent customized to your core developer tech stacks.
            </p>
          </div>
          
          <div className="relative z-10 mt-6">
            <Link href="/interview">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                <Play className="size-4 fill-white" />
                <span>Start New Mock Interview</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Drag-and-Drop Resume Box */}
        <div className="relative group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-transparent backdrop-blur-md p-6 md:p-8 shadow-2xl flex flex-col justify-between min-h-[220px]">
          {/* Subtle neon ambient ring */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-700 blur" />

          <div className="relative z-10">
            <h3 className="text-xl font-bold text-white mb-2">Upload Custom CV/Resume</h3>
            <p className="text-light-100/60 text-sm leading-relaxed max-w-sm">
              Generate a highly tailored mock panel session dynamically mapped to your personal achievements, experience, and background.
            </p>
          </div>

          <div className="relative z-10 mt-6">
            <Link href="/interview?mode=resume">
              <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-white/20 hover:border-cyan-500/40 bg-white/[0.02] hover:bg-cyan-500/5 transition-all duration-300 cursor-pointer">
                <div className="size-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-200">
                  <Upload className="size-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Drag & drop or browse resume</p>
                  <p className="text-xs text-light-100/40">Accepts PDF files up to 5MB</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Quick Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Metric 1 */}
        <div className="rounded-2xl border border-white/10 bg-dark-200/50 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl">
          <div className="size-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <Layers className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-100/40 uppercase tracking-wider">Completed</p>
            <p className="text-2xl font-black text-white mt-0.5">{totalInterviews}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-white/10 bg-dark-200/50 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl">
          <div className="size-12 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-400">
            <Award className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-100/40 uppercase tracking-wider">Avg Score</p>
            <p className="text-2xl font-black text-white mt-0.5">{avgScore ? `${avgScore}%` : "—"}</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-white/10 bg-dark-200/50 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl">
          <div className="size-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-400">
            <Clock className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-100/40 uppercase tracking-wider">Speaking Time</p>
            <p className="text-2xl font-black text-white mt-0.5">{totalSpeakingTime}m</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-white/10 bg-dark-200/50 backdrop-blur-md p-5 flex items-center gap-4 shadow-xl">
          <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-400">
            <Flame className="size-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-light-100/40 uppercase tracking-wider">Practice Streak</p>
            <p className="text-2xl font-black text-white mt-0.5">{currentStreak} Day{currentStreak === 1 ? "" : "s"}</p>
          </div>
        </div>
      </div>

      {/* 3. Visual Analytics Section */}
      <DashboardCharts feedbacks={safeFeedbacks} interviewRoles={interviewRoles} />

      {/* 4. Recent Activity Logs */}
      <div className="rounded-2xl border border-white/10 bg-dark-200/50 backdrop-blur-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Feedback Diagnostic History</h3>
            <p className="text-sm text-light-100/50 mt-1">Review full evaluation records of all finalized interview sessions.</p>
          </div>
        </div>

        {safeFeedbacks.length > 0 ? (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-light-100/40 font-semibold uppercase text-xs tracking-wider">
                  <th className="py-4 px-4">Job Role / Context</th>
                  <th className="py-4 px-4">Evaluation Date</th>
                  <th className="py-4 px-4">Interview Type</th>
                  <th className="py-4 px-4 text-center">Final Score</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-white/90">
                {safeFeedbacks.slice().reverse().map((f) => {
                  const roleName = interviewRoles[f.interviewId] || "AI Custom Mock";
                  const dateStr = new Date(f.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  });
                  const isHigh = f.totalScore >= 80;
                  const isMedium = f.totalScore >= 60 && f.totalScore < 80;

                  return (
                    <tr key={f.id} className="hover:bg-white/[0.02] transition-colors duration-150">
                      <td className="py-4 px-4 font-bold capitalize">{roleName}</td>
                      <td className="py-4 px-4 text-light-100/75">{dateStr}</td>
                      <td className="py-4 px-4">
                        <span className="px-3 py-1 rounded-full border border-white/10 bg-white/[0.02] text-xs font-semibold text-light-100/80">
                          Interactive Voice
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-full border text-xs font-black ${
                          isHigh 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : isMedium 
                              ? "bg-orange-500/10 border-orange-500/20 text-orange-400" 
                              : "bg-red-500/10 border-red-500/20 text-red-400"
                        }`}>
                          {f.totalScore}%
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link 
                          href={`/interview/${f.interviewId}/feedback`}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-200 hover:text-primary-100 transition-colors group/link"
                        >
                          <span>View Deep Feedback</span>
                          <ArrowRight className="size-3 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-white/10 bg-white/[0.01] gap-3">
            <div className="text-4xl p-4 bg-white/[0.02] border border-white/5 rounded-2xl">📊</div>
            <p className="font-bold text-white">No analytics logs recorded</p>
            <p className="text-sm text-light-100/40 text-center max-w-xs">
              Take your first customized mockup speech session with our AI voice interviewer to unlock progression analytics!
            </p>
            <Link href="/interview">
              <button className="mt-2 px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl text-sm transition duration-200 cursor-pointer">
                Start Standard AI Mock
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
