import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  const info = {
    cwd: process.cwd(),
    volumePath: process.env.RAILWAY_VOLUME_MOUNT_PATH,
    storageDir: process.env.RAILWAY_VOLUME_MOUNT_PATH || process.cwd(),
    storageFile: path.join(
      process.env.RAILWAY_VOLUME_MOUNT_PATH || process.cwd(),
      "ticket_data.json"
    ),
    volumePathExists: process.env.RAILWAY_VOLUME_MOUNT_PATH
      ? fs.existsSync(process.env.RAILWAY_VOLUME_MOUNT_PATH)
      : null,
    fileExists: fs.existsSync(
      path.join(
        process.env.RAILWAY_VOLUME_MOUNT_PATH || process.cwd(),
        "ticket_data.json"
      )
    ),
    envVars: {
      RAILWAY_VOLUME_MOUNT_PATH: process.env.RAILWAY_VOLUME_MOUNT_PATH || "not set",
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT,
    },
  };

  return NextResponse.json(info, { status: 200 });
}
