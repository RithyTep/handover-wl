import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Initialize feedback table
async function initFeedbackTable() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(200) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(50) DEFAULT 'new'
      )
    `);
  } finally {
    client.release();
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, description } = body;

    // Validate required fields
    if (!type || !title || !description) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate feedback type
    const validTypes = ["bug", "feedback", "suggestion", "feature"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: "Invalid feedback type" },
        { status: 400 }
      );
    }

    // Validate field lengths
    if (title.length > 200) {
      return NextResponse.json(
        { success: false, error: "Title too long (max 200 characters)" },
        { status: 400 }
      );
    }

    if (description.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Description too long (max 2000 characters)" },
        { status: 400 }
      );
    }

    // Initialize table if needed
    await initFeedbackTable();

    // Insert feedback
    const client = await pool.connect();
    try {
      const result = await client.query(
        `INSERT INTO feedback (type, title, description, created_at, status)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 'new')
         RETURNING id, created_at`,
        [type, title.trim(), description.trim()]
      );

      console.log("[Feedback] New submission:", {
        id: result.rows[0].id,
        type,
        title: title.substring(0, 50) + (title.length > 50 ? "..." : ""),
        created_at: result.rows[0].created_at,
      });

      return NextResponse.json({
        success: true,
        data: {
          id: result.rows[0].id,
          message: "Feedback submitted successfully",
        },
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[Feedback] Error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await initFeedbackTable();

    const client = await pool.connect();
    try {
      const result = await client.query(
        `SELECT id, type, title, description, created_at, status
         FROM feedback
         ORDER BY created_at DESC
         LIMIT 100`
      );

      return NextResponse.json({
        success: true,
        data: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error("[Feedback] Error:", error.message);
    return NextResponse.json(
      { success: false, error: "Failed to fetch feedback" },
      { status: 500 }
    );
  }
}
