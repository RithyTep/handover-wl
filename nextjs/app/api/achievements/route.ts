import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ACHIEVEMENTS_FILE = path.join(process.cwd(), "achievements_data.json");

// Sample data structure - this will be populated from Jira
const generateSampleAchievements = () => {
  return [
    {
      id: "ach-1",
      title: "Menu Settings Configuration (Phase 1)",
      type: "feature",
      ticketKeys: ["WL-8157"],
      period: "July 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-2",
      title: "Payment Provider Integrations (Lnwpay/CallPay)",
      type: "feature",
      ticketKeys: ["TCP-78448", "TCP-78446"],
      period: "September 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-3",
      title: "GLI & Customer Record Enhancements",
      type: "feature",
      ticketKeys: [],
      period: "August-November 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-4",
      title: "2-Level Transaction Approval (Phase 2)",
      type: "feature",
      ticketKeys: [],
      period: "October 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-5",
      title: "Customer Support Tickets Resolved",
      type: "support",
      ticketKeys: ["151+ tickets"],
      period: "July-November 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-6",
      title: "Cross-Team Collaboration",
      type: "cooperation",
      ticketKeys: ["130+ cooperation tickets"],
      period: "July-November 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-7",
      title: "Playful Theme Modularization",
      type: "feature",
      ticketKeys: [],
      period: "August 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-8",
      title: "PHP Retirement (Angelia)",
      type: "feature",
      ticketKeys: [],
      period: "September 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-9",
      title: "Bole Gaming Turnover & VIP Rebate",
      type: "feature",
      ticketKeys: [],
      period: "July 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-10",
      title: "SEO Multi-Page Management",
      type: "feature",
      ticketKeys: [],
      period: "August 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-11",
      title: "Mobile UI Optimization",
      type: "feature",
      ticketKeys: [],
      period: "September 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
    {
      id: "ach-12",
      title: "Game-Based Report Enhancements",
      type: "feature",
      ticketKeys: [],
      period: "October 2025",
      savedCategory: "",
      savedDescription: "",
      savedImpact: "",
    },
  ];
};

export async function GET(request: NextRequest) {
  try {
    let achievements = generateSampleAchievements();

    // Try to load saved data
    try {
      const data = await fs.readFile(ACHIEVEMENTS_FILE, "utf-8");
      const savedAchievements = JSON.parse(data);

      // Merge saved data with generated achievements
      achievements = achievements.map((ach) => {
        const saved = savedAchievements.find((s: any) => s.id === ach.id);
        return saved || ach;
      });
    } catch (error) {
      // File doesn't exist yet, use default data
      console.log("No saved achievements file found, using defaults");
    }

    return NextResponse.json({
      success: true,
      achievements,
    });
  } catch (error: any) {
    console.error("Error in GET /api/achievements:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
