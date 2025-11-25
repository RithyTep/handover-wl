import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const STORAGE_DIR = fs.existsSync("/mnt") ? "/mnt" : process.cwd();
const TEST_FILE = path.join(STORAGE_DIR, "test_persistence.txt");

export async function GET() {
  try {
    // Try to read existing file
    let content = "File doesn't exist yet";
    let fileExists = false;

    if (fs.existsSync(TEST_FILE)) {
      content = fs.readFileSync(TEST_FILE, "utf8");
      fileExists = true;
    }

    // Write new timestamp
    const now = new Date().toISOString();
    const newContent = fileExists ? `${content}\n${now}` : now;
    fs.writeFileSync(TEST_FILE, newContent);

    // Verify write
    const verification = fs.readFileSync(TEST_FILE, "utf8");

    return NextResponse.json({
      storageDir: STORAGE_DIR,
      testFile: TEST_FILE,
      previousContent: content,
      newTimestamp: now,
      verifiedContent: verification,
      fileExistedBefore: fileExists,
      allFilesInStorage: fs.readdirSync(STORAGE_DIR),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
}
