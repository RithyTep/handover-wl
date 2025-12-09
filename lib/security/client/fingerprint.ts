/**
 * Browser fingerprint generator
 * Creates a unique fingerprint based on browser characteristics
 * This fingerprint cannot be replicated by curl/Postman
 */

import type { BrowserFingerprint } from "../types";

/**
 * Generate SHA-256 hash using Web Crypto API
 */
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Generate canvas fingerprint
 * Draws text and shapes, then hashes the result
 */
async function getCanvasFingerprint(): Promise<string> {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";

    canvas.width = 200;
    canvas.height = 50;

    // Draw text with specific font
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("Browser fingerprint", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("Canvas test", 4, 30);

    // Draw shapes
    ctx.beginPath();
    ctx.arc(50, 25, 10, 0, Math.PI * 2);
    ctx.stroke();

    const dataUrl = canvas.toDataURL();
    return await sha256(dataUrl);
  } catch {
    return "canvas-error";
  }
}

/**
 * Get WebGL fingerprint
 * Extracts renderer and vendor info
 */
async function getWebGLFingerprint(): Promise<string> {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl || !(gl instanceof WebGLRenderingContext)) {
      return "no-webgl";
    }

    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    if (!debugInfo) {
      return "no-debug-info";
    }

    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

    return await sha256(`${vendor}|${renderer}`);
  } catch {
    return "webgl-error";
  }
}

/**
 * Get screen fingerprint
 */
function getScreenFingerprint(): string {
  const { width, height, colorDepth, pixelDepth } = window.screen;
  const devicePixelRatio = window.devicePixelRatio || 1;
  return `${width}x${height}x${colorDepth}x${pixelDepth}@${devicePixelRatio}`;
}

/**
 * Get timezone fingerprint
 */
function getTimezoneFingerprint(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return new Date().getTimezoneOffset().toString();
  }
}

/**
 * Get language fingerprint
 */
function getLanguageFingerprint(): string {
  return navigator.language || (navigator as Navigator).language || "unknown";
}

/**
 * Get platform fingerprint
 */
function getPlatformFingerprint(): string {
  return navigator.platform || "unknown";
}

/**
 * Generate complete browser fingerprint
 */
export async function generateBrowserFingerprint(): Promise<BrowserFingerprint> {
  const [canvas, webgl] = await Promise.all([
    getCanvasFingerprint(),
    getWebGLFingerprint(),
  ]);

  const screen = getScreenFingerprint();
  const timezone = getTimezoneFingerprint();
  const language = getLanguageFingerprint();
  const platform = getPlatformFingerprint();

  // Combine all components for final hash
  const combined = [canvas, webgl, screen, timezone, language, platform].join(
    "|"
  );

  const hash = await sha256(combined);

  return {
    canvas,
    webgl,
    screen,
    timezone,
    language,
    platform,
    hash,
  };
}

/**
 * Get just the fingerprint hash (for headers)
 */
export async function getFingerprintHash(): Promise<string> {
  const fingerprint = await generateBrowserFingerprint();
  return fingerprint.hash;
}
