import { NextResponse } from "next/server";
import { sanitizeUsername, sanitizeVibe } from "@/lib/sanitize";
import { rateLimit } from "@/lib/rateLimit";
import { createClient, getRoast } from "@/lib/openai";
import { fetchRecentThreads } from "@/lib/threadsContext";

export const runtime = "nodejs"; // in-memory rate limit + sized bodies

const DEFAULT_ALLOWED_ORIGINS = ["https://gosong.fauzanakmal.com"];

function allowedOrigins(): string[] {
  return (process.env.CORS_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("origin");
  if (!origin || !allowedOrigins().includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "content-type",
    Vary: "Origin",
  };
}

function json(req: Request, body: unknown, init?: ResponseInit) {
  return NextResponse.json(body, {
    ...init,
    headers: { ...corsHeaders(req), ...init?.headers },
  });
}

export function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

function clientIp(req: Request): string {
  // v1 limitation: the first XFF entry is client-supplied and spoofable, so the
  // per-IP limit is best-effort (matches the in-memory store's best-effort nature).
  // Behind a trusted single proxy (e.g. Vercel), prefer the infra-set x-real-ip.
  const xff = req.headers.get("x-forwarded-for");
  return (
    req.headers.get("x-real-ip") || xff?.split(",")[0]?.trim() || "unknown"
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(req, { error: "Format request gak valid." }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const username = sanitizeUsername(b.username);
  const vibe = sanitizeVibe(b.vibe);
  const reroll = Boolean(b.reroll);

  if (!username) {
    return json(req, { error: "Username dulu dong." }, { status: 400 });
  }

  const limit = Number(process.env.ROAST_RATE_LIMIT) || 15;
  const windowMs = Number(process.env.ROAST_RATE_WINDOW_MS) || 60_000;
  const rl = rateLimit(`roast:${clientIp(req)}`, { limit, windowMs });
  if (!rl.allowed) {
    return json(
      req,
      { error: "Sabar, lo kebanyakan minta roast. Coba lagi bentar 🔥" },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
        },
      },
    );
  }

  try {
    const recentThreads = await fetchRecentThreads(username, { limit: 10 });
    const roast = await getRoast(
      { username, vibe, reroll, recentThreads },
      { client: createClient() },
    );
    return json(req, { roast });
  } catch (err) {
    console.error(
      "[roast] provider error:",
      err instanceof Error ? err.message : err,
    );
    return json(
      req,
      { error: "Lagi rame nih, gagal nge-roast. Coba lagi ya 🙏" },
      { status: 502 },
    );
  }
}
