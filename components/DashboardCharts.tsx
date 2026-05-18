"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface CategoryScore {
  name: string;
  score: number;
}

interface FeedbackData {
  id: string;
  totalScore: number;
  createdAt: string;
  categoryScores?: CategoryScore[];
}

interface DashboardChartsProps {
  feedbacks: FeedbackData[];
  interviewRoles: Record<string, string>; // Maps interviewId to role name
}

export default function DashboardCharts({ feedbacks, interviewRoles }: DashboardChartsProps) {
  // 1. Prepare Line Chart data (progression over last 10 interviews)
  const last10Feedbacks = feedbacks.slice(-10);
  const lineData = last10Feedbacks.map((f, index) => {
    const date = new Date(f.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    return {
      name: `Session ${index + 1}`,
      date,
      score: f.totalScore,
    };
  });

  // Fallback line data if none exists
  const defaultLineData = [
    { name: "Sess 1", score: 65 },
    { name: "Sess 2", score: 72 },
    { name: "Sess 3", score: 70 },
    { name: "Sess 4", score: 78 },
    { name: "Sess 5", score: 85 },
  ];

  // 2. Prepare Radar Chart data (averages of the 5 categories)
  const categories = [
    "Communication Skills",
    "Technical Knowledge",
    "Problem Solving",
    "Cultural Fit",
    "Confidence and Clarity",
  ];

  // Initialize accumulators
  const totals = categories.reduce((acc, cat) => {
    acc[cat] = { sum: 0, count: 0 };
    return acc;
  }, {} as Record<string, { sum: number; count: number }>);

  // Accumulate scores from all user feedbacks
  feedbacks.forEach((f) => {
    if (f.categoryScores && Array.isArray(f.categoryScores)) {
      f.categoryScores.forEach((cs) => {
        // Handle name mapping just in case of casing / spelling differences
        const matchedCat = categories.find(
          (c) => c.toLowerCase().trim() === cs.name.toLowerCase().trim()
        );
        if (matchedCat) {
          totals[matchedCat].sum += cs.score;
          totals[matchedCat].count += 1;
        }
      });
    }
  });

  // Calculate averages
  const radarData = categories.map((cat) => {
    const average =
      totals[cat].count > 0 ? Math.round(totals[cat].sum / totals[cat].count) : 0;
    return {
      subject: cat,
      A: average || 70, // Fallback baseline to look high-end even with zero data
      fullMark: 100,
    };
  });

  const hasData = feedbacks.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* Line Chart Card (60%) */}
      <div className="lg:col-span-3 rounded-2xl border border-white/10 bg-dark-200/50 backdrop-blur-md p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">Score Progression</h4>
            {!hasData && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-primary-200/20 bg-primary-200/10 text-primary-200 font-semibold uppercase tracking-wider animate-pulse">
                Demo Baseline
              </span>
            )}
          </div>
          <p className="text-sm text-light-100/50 mb-6">
            Tracking your total score progression over your last 10 mock interviews.
          </p>
        </div>

        <div className="h-[300px] w-full mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={hasData ? lineData : defaultLineData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="scoreGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.3)"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                fontSize={12}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 22, 35, 0.95)",
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: "#06b6d4", stroke: "#0f1623", strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart Card (40%) */}
      <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-dark-200/50 backdrop-blur-md p-6 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white">Skills Matrix</h4>
            {!hasData && (
              <span className="text-xs px-2 py-0.5 rounded-full border border-primary-200/20 bg-primary-200/10 text-primary-200 font-semibold uppercase tracking-wider animate-pulse">
                Demo Baseline
              </span>
            )}
          </div>
          <p className="text-sm text-light-100/50 mb-6">
            A comprehensive breakdown of mock parameters scored across all sessions.
          </p>
        </div>

        <div className="h-[300px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis
                dataKey="subject"
                stroke="rgba(255,255,255,0.4)"
                fontSize={10}
              />
              <PolarRadiusAxis
                angle={30}
                domain={[0, 100]}
                stroke="rgba(255,255,255,0.2)"
                fontSize={8}
              />
              <Radar
                name="Score"
                dataKey="A"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.25}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
