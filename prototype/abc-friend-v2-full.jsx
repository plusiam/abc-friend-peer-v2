import { useState, useEffect } from "react";

/* ═══════════════════════════════════════════════
   🎨 디자인 시스템 — "Soft Playground"
   ═══════════════════════════════════════════════ */
const DS = {
  color: {
    bg: "#FAFAF6", surface: "#FFFFFF", surfaceHover: "#F7F7F3",
    ink: "#1A1A2E", inkSoft: "#6B6D7B", inkMuted: "#A8AABB",
    border: "#EEEDF2", borderFocus: "#C4B5FD",
    accent: "#FF7E5F", accentLight: "#FFF0EB",
    accentGrad: "linear-gradient(135deg, #FF7E5F, #FEB47B)",
    s1: "#14B8A6", s1Bg: "#F0FDFA", s1Soft: "#CCFBF1",
    s2: "#818CF8", s2Bg: "#F5F3FF", s2Soft: "#E0E7FF",
    s3: "#F59E0B", s3Bg: "#FFFBEB", s3Soft: "#FEF3C7",
    s4: "#EC4899", s4Bg: "#FDF2F8", s4Soft: "#FCE7F3",
    success: "#10B981", successBg: "#ECFDF5",
  },
  radius: { sm: 10, md: 16, lg: 24, xl: 32, full: 9999 },
  shadow: {
    sm: "0 1px 3px rgba(26,26,46,0.04)", md: "0 4px 20px rgba(26,26,46,0.06)",
    lg: "0 12px 40px rgba(26,26,46,0.08)", glow: (c) => `0 8px 32px ${c}25`,
  },
  transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
};
