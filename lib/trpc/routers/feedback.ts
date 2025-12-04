import { z } from "zod";
import { router, publicProcedure } from "../server";
import { initDatabase } from "@/lib/services";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function getAllFeedback() {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT id, type, title, description, created_at, status
       FROM feedback
       ORDER BY created_at DESC
       LIMIT 100`
    );
    return result.rows;
  } finally {
    client.release();
  }
}

async function createFeedback(data: { type: string; title: string; description: string }) {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `INSERT INTO feedback (type, title, description, created_at, status)
       VALUES ($1, $2, $3, CURRENT_TIMESTAMP, 'new')
       RETURNING id, created_at`,
      [data.type, data.title.trim(), data.description.trim()]
    );
    return result.rows[0];
  } finally {
    client.release();
  }
}

export const feedbackRouter = router({
  getAll: publicProcedure.query(async () => {
    const feedback = await getAllFeedback();
    return { success: true, feedback };
  }),

  create: publicProcedure
    .input(
      z.object({
        type: z.enum(["bug", "feedback", "suggestion", "feature"]),
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const feedback = await createFeedback(input);
      return { success: true, data: feedback };
    }),
});
