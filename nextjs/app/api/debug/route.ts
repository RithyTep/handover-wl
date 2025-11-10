import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  // Check common volume mount paths
  const commonPaths = ["/data", "/mnt", "/volume", "/app/data", "/storage"];
  const pathChecks = commonPaths.map((p) => ({
    path: p,
    exists: fs.existsSync(p),
    isWritable: fs.existsSync(p) ? checkWritable(p) : false,
  }));

  // List root directories
  const rootDirs = fs.readdirSync("/").filter((name) => {
    try {
      return fs.statSync(path.join("/", name)).isDirectory();
    } catch {
      return false;
    }
  });

  const info = {
    cwd: process.cwd(),
    rootDirectories: rootDirs,
    pathChecks,
    currentStorageDir: fs.existsSync("/data") ? "/data" : process.cwd(),
    currentStorageFile: path.join(
      fs.existsSync("/data") ? "/data" : process.cwd(),
      "ticket_data.json"
    ),
    dataPathExists: fs.existsSync("/data"),
    dataPathWritable: fs.existsSync("/data") ? checkWritable("/data") : false,
    envVars: {
      RAILWAY_VOLUME_MOUNT_PATH: process.env.RAILWAY_VOLUME_MOUNT_PATH || "not set",
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    },
  };

  return NextResponse.json(info, { status: 200 });
}

function checkWritable(dir: string): boolean {
  try {
    const testFile = path.join(dir, ".write-test");
    fs.writeFileSync(testFile, "test");
    fs.unlinkSync(testFile);
    return true;
  } catch {
    return false;
  }
}
