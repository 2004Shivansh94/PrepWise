"use client";

import React from "react";

export default function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-[#080c14]">
      {/* Dynamic Grid overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      
      {/* Slow moving soft glow orbs */}
      {/* Indigo Orb */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] animate-float-slow"
      />
      
      {/* Cyan Orb */}
      <div 
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px] animate-float-reverse"
      />
      
      {/* Violet Orb */}
      <div 
        className="absolute top-[30%] left-[40%] w-[40%] h-[40%] rounded-full bg-purple-500/8 blur-[130px] animate-float-medium"
      />
      
      {/* Subtle bottom highlight */}
      <div 
        className="absolute bottom-0 left-[20%] right-[20%] h-[20%] bg-gradient-to-t from-cyan-500/5 to-transparent blur-[80px]"
      />
    </div>
  );
}
