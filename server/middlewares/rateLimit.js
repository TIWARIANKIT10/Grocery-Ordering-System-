// Tiny in-memory rate limiter for the login/register
// endpoints (no new dependency). Per-IP fixed window;
// good enough to blunt credential stuffing on a demo host.
const buckets = new Map();

export function rateLimit({ windowMs = 15 * 60 * 1000, max = 30 } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || "unknown";
    let bucket = buckets.get(key);
    if (!bucket || now - bucket.start > windowMs) {
      bucket = { start: now, count: 0 };
      buckets.set(key, bucket);
    }
    bucket.count += 1;
    if (bucket.count > max) {
      return res
        .status(429)
        .json({ success: false, message: "Too many attempts — please try again later." });
    }
    next();
  };
}
