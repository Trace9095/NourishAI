"use client";

import { useEffect, useState } from "react";

interface Ring {
  label: string;
  value: number;
  max: number;
  color: string;
  radius: number;
}

const RINGS: Ring[] = [
  { label: "Calories", value: 1847, max: 2400, color: "#FF9500", radius: 88 },
  { label: "Protein", value: 142, max: 165, color: "#FF6B6B", radius: 72 },
  { label: "Carbs", value: 185, max: 280, color: "#4ECDC4", radius: 56 },
  { label: "Fat", value: 52, max: 80, color: "#FFE66D", radius: 40 },
];

export function MacroRings() {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative">
      {/* Glow behind rings */}
      <div className="absolute inset-0 blur-3xl opacity-20">
        <div className="w-full h-full rounded-full bg-brand-green" />
      </div>

      {/* Phone frame */}
      <div className="relative w-[280px] h-[520px] mx-auto rounded-[44px] border-2 border-white/10 bg-brand-darker shadow-2xl overflow-hidden animate-float">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-brand-darker rounded-b-2xl z-10" />

        {/* Screen */}
        <div className="absolute inset-[3px] rounded-[41px] bg-brand-card overflow-hidden">
          {/* Status bar */}
          <div className="flex items-center justify-between px-8 pt-4 pb-2 text-[10px] text-gray-400">
            <span>9:41</span>
            <div className="flex gap-1 items-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
              </svg>
              <svg width="14" height="12" viewBox="0 0 24 14" fill="currentColor">
                <rect x="0" y="2" width="20" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <rect x="2" y="4" width="14" height="6" rx="1" fill="#34C759" />
                <rect x="21" y="5" width="2" height="4" rx="1" fill="currentColor" />
              </svg>
            </div>
          </div>

          {/* App header */}
          <div className="px-6 pt-2 pb-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Today</p>
            <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-outfit)]">
              Your Macros
            </h3>
          </div>

          {/* Rings SVG */}
          <div className="flex justify-center">
            <svg width="200" height="200" viewBox="0 0 200 200">
              {RINGS.map((ring, i) => {
                const circumference = 2 * Math.PI * ring.radius;
                const pct = ring.value / ring.max;
                const offset = circumference * (1 - (animated ? pct : 0));
                return (
                  <g key={ring.label}>
                    {/* Background track */}
                    <circle
                      cx="100"
                      cy="100"
                      r={ring.radius}
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    {/* Filled arc */}
                    <circle
                      cx="100"
                      cy="100"
                      r={ring.radius}
                      fill="none"
                      stroke={ring.color}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={offset}
                      transform="rotate(-90 100 100)"
                      style={{
                        transition: `stroke-dashoffset 1.8s cubic-bezier(0.4, 0, 0.2, 1) ${i * 0.15}s`,
                        filter: `drop-shadow(0 0 6px ${ring.color}40)`,
                      }}
                    />
                  </g>
                );
              })}
              {/* Center text */}
              <text
                x="100"
                y="94"
                textAnchor="middle"
                fill="white"
                fontSize="24"
                fontWeight="700"
                fontFamily="var(--font-outfit)"
                style={{
                  opacity: animated ? 1 : 0,
                  transition: "opacity 0.6s ease 0.8s",
                }}
              >
                1,847
              </text>
              <text
                x="100"
                y="112"
                textAnchor="middle"
                fill="#9CA3AF"
                fontSize="10"
                style={{
                  opacity: animated ? 1 : 0,
                  transition: "opacity 0.6s ease 1s",
                }}
              >
                of 2,400 cal
              </text>
            </svg>
          </div>

          {/* Macro legend */}
          <div className="grid grid-cols-2 gap-2 px-5 pt-3">
            {RINGS.map((ring) => (
              <div key={ring.label} className="flex items-center gap-2 py-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: ring.color }}
                />
                <span className="text-[10px] text-gray-400">{ring.label}</span>
                <span className="text-[10px] text-white ml-auto font-medium">
                  {ring.value}
                  <span className="text-gray-500">/{ring.max}{ring.label === "Calories" ? "" : "g"}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Recent meal preview */}
          <div className="mx-5 mt-4 p-3 rounded-xl bg-brand-darker/80 border border-brand-border/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-green/10 flex items-center justify-center text-sm">
                🥗
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white font-medium truncate">Grilled Chicken Salad</p>
                <p className="text-[9px] text-gray-500">Lunch &bull; 12:30 PM</p>
              </div>
              <span className="text-[11px] text-brand-orange font-medium">485 cal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
