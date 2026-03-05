import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "NourishAI — AI-Powered Nutrition Tracking";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A0A14 0%, #12121A 50%, #0A0A14 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Glow circles */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "30%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(52, 199, 89, 0.08)",
            filter: "blur(80px)",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "20%",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255, 149, 0, 0.06)",
            filter: "blur(80px)",
            transform: "translate(50%, -50%)",
          }}
        />

        {/* Logo leaf */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "rgba(52, 199, 89, 0.1)",
            marginBottom: 24,
          }}
        >
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 3c-6.5 3.5-11 10.5-11 17.5 0 3.8 1.7 7 4.8 9.1 1.8-5.2 4.4-9.4 6.2-11.6 1.8 2.2 4.4 6.4 6.2 11.6 3.1-2.1 4.8-5.3 4.8-9.1C27 13.5 22.5 6.5 16 3z"
              fill="#34C759"
            />
            <circle cx="16" cy="27" r="2" fill="#FF9500" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            marginBottom: 8,
            letterSpacing: -1,
          }}
        >
          Nourish
          <span style={{ color: "#34C759" }}>AI</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: "#9CA3AF",
            marginBottom: 32,
          }}
        >
          AI-Powered Nutrition Tracking
        </div>

        {/* Macro pills */}
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "Calories", color: "#FF9500" },
            { label: "Protein", color: "#FF6B6B" },
            { label: "Carbs", color: "#4ECDC4" },
            { label: "Fat", color: "#FFE66D" },
          ].map((macro) => (
            <div
              key={macro.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 14px",
                borderRadius: 999,
                background: `${macro.color}15`,
                border: `1px solid ${macro.color}30`,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: macro.color,
                }}
              />
              <span style={{ fontSize: 14, color: macro.color, fontWeight: 600 }}>
                {macro.label}
              </span>
            </div>
          ))}
        </div>

        {/* Domain bar */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            display: "flex",
            fontSize: 14,
            color: "#6B7280",
          }}
        >
          nourishhealthai.com
        </div>
      </div>
    ),
    { ...size }
  );
}
