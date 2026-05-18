"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, LogOut, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  user: {
    name: string;
    email: string;
  };
  onLogout: () => void;
}

export default function UserDropdown({ user, onLogout }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Tooltip */}
      {showTooltip && !isOpen && (
        <div className="absolute right-0 bottom-full mb-3 z-50 min-w-[200px] p-3 rounded-xl bg-dark-200/95 backdrop-blur-md border border-white/10 shadow-2xl animate-fadeIn pointer-events-none">
          <p className="text-xs font-semibold text-primary-200 uppercase tracking-wider">User Profile</p>
          <p className="text-sm font-bold text-white mt-1 truncate">{user.name}</p>
          <p className="text-xs text-white/50 truncate">{user.email}</p>
          {/* Arrow */}
          <div className="absolute top-full right-5 w-2.5 h-2.5 bg-dark-200/95 border-r border-b border-white/10 rotate-45 -translate-y-1.5" />
        </div>
      )}

      {/* Trigger Avatar */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-2 group p-1 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-primary-200/30 transition-all duration-300 shadow-lg cursor-pointer"
      >
        {/* Styled initial avatar with premium gradient ring */}
        <div className="relative flex items-center justify-center size-10 rounded-full bg-gradient-to-br from-primary-200 to-indigo-600 font-bold text-sm text-white shadow-[0_0_15px_rgba(6,182,212,0.25)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300">
          {getInitials(user.name)}
          {/* Online green indicator dot */}
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-green-500 ring-2 ring-[#080c14]" />
        </div>
        
        {/* Subtle chevron drop indicator */}
        <ChevronDown className="size-4 text-white/50 group-hover:text-white mr-1.5 transition-transform duration-300" 
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {/* Dropdown Menu Box */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-[#090f19]/90 backdrop-blur-md border border-white/10 shadow-2xl z-50 py-2.5 animate-fadeIn">
          {/* User Meta header block inside dropdown */}
          <div className="px-4 py-3 border-b border-white/5 mb-2">
            <p className="text-xs font-semibold text-primary-200 uppercase tracking-widest">Logged in as</p>
            <p className="text-sm font-bold text-white mt-1 truncate">{user.name}</p>
            <p className="text-xs text-white/40 truncate">{user.email}</p>
          </div>

          {/* Action Row options */}
          <div className="flex flex-col gap-0.5 px-2">
            {/* Dashboard Option */}
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/[0.05] transition-all duration-200"
            >
              <LayoutDashboard className="size-4 text-primary-200" />
              <span>Dashboard</span>
            </Link>

            {/* Log Out Option */}
            <button
              onClick={() => {
                setIsOpen(false);
                onLogout();
              }}
              className="flex w-full items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 text-left cursor-pointer"
            >
              <LogOut className="size-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
