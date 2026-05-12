import rateLimit from "express-rate-limit";

/**
 * Rate limiters to prevent abuse.
 *
 * KEY CHANGE from previous version:
 *   The generalLimiter now SKIPS polling endpoints. Earlier, every page
 *   load was hammering /api/notifications/unread-count (every 10s) and
 *   /api/battles/current (multiple components), eating up the 300-req
 *   budget in under 5 minutes for a normal browsing user. Polling
 *   endpoints are cheap, idempotent reads — they don't need throttling.
 *
 *   Auth and password-reset limiters stay strict.
 *
 * Requires: `npm install express-rate-limit`
 */

/**
 * Endpoints that are polled by the client at fixed intervals.
 * These are GETs only — they don't mutate state and are bandwidth-cheap.
 * Skipping them from the global limiter prevents false 429s during normal
 * browsing.
 */
const POLLING_PATH_SUFFIXES = [
  "/notifications/unread-count",
  "/battles/current",
  "/battles", // GET /api/battles is hit by BattleHistory + admin previews
];

/**
 * Skip predicate — returns true if this request should NOT count toward
 * the global limit. We only skip GETs (writes still need throttling).
 */
const shouldSkipFromGlobalLimit = (req) => {
  if (req.method !== "GET") return false;
  return POLLING_PATH_SUFFIXES.some((suffix) => req.path.endsWith(suffix));
};

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  // Raised from 300 → 1000. Even with polling endpoints skipped, a normal
  // user browsing battles + sketches + notifications can easily hit 300
  // in a few minutes of active use.
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  skip: shouldSkipFromGlobalLimit,
  message: { error: "Demasiadas solicitudes. Intenta de nuevo en 15 minutos." },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 login/register attempts per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos. Intenta de nuevo en 15 minutos." },
  // Don't count successful requests toward the limit
  skipSuccessfulRequests: true,
});

export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 reset requests per hour per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Demasiadas solicitudes de restablecimiento. Intenta en 1 hora.",
  },
});
