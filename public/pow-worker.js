/**
 * Proof-of-Work Web Worker
 * Runs hash computation off the main thread to avoid blocking UI
 */

// SHA-256 using Web Crypto API
async function sha256(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Check if hash meets difficulty requirement
function meetsRequirement(hash, difficulty) {
  const prefix = "0".repeat(difficulty);
  return hash.startsWith(prefix);
}

// Solve the proof-of-work challenge
async function solvePoW(challenge, fingerprint, timestamp, difficulty) {
  let nonce = 0;
  const maxIterations = 10000000; // Prevent infinite loops

  while (nonce < maxIterations) {
    const input = `${challenge}:${fingerprint}:${timestamp}:${nonce}`;
    const hash = await sha256(input);

    if (meetsRequirement(hash, difficulty)) {
      return {
        hash,
        input,
        nonce,
        iterations: nonce + 1,
      };
    }

    nonce++;

    // Report progress every 10000 iterations
    if (nonce % 10000 === 0) {
      self.postMessage({
        type: "progress",
        iterations: nonce,
      });
    }
  }

  throw new Error("Could not solve PoW within iteration limit");
}

// Handle messages from main thread
self.onmessage = async function (e) {
  const { type, challenge, fingerprint, timestamp, difficulty } = e.data;

  if (type === "solve") {
    try {
      const startTime = performance.now();
      const result = await solvePoW(challenge, fingerprint, timestamp, difficulty);
      const endTime = performance.now();

      self.postMessage({
        type: "solved",
        ...result,
        timeMs: endTime - startTime,
      });
    } catch (error) {
      self.postMessage({
        type: "error",
        error: error.message,
      });
    }
  }
};
