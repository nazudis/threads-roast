import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/openai", () => ({
  createClient: vi.fn(() => ({})),
  getRoast: vi.fn(async () => "Lo tuh raja quote tapi miskin opini sendiri 🔥"),
}));

vi.mock("@/lib/threadsContext", () => ({
  fetchRecentThreads: vi.fn(async () => [
    "posting real pertama",
    "posting real kedua",
  ]),
}));

import { POST } from "@/app/api/roast/route";
import { getRoast } from "@/lib/openai";
import { fetchRecentThreads } from "@/lib/threadsContext";
import { __resetRateLimitStore } from "@/lib/rateLimit";

function req(body: unknown, ip = "1.2.3.4") {
  return new Request("http://localhost/api/roast", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: JSON.stringify(body),
  });
}

describe("POST /api/roast", () => {
  beforeEach(() => {
    __resetRateLimitStore();
    vi.clearAllMocks();
  });

  it("returns a roast on valid input", async () => {
    const res = await POST(req({ username: "fauzan", vibe: "tukang quote" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.roast).toMatch(/quote/i);
    expect(fetchRecentThreads).toHaveBeenCalledWith(
      "fauzan",
      expect.objectContaining({ limit: 10 }),
    );
    expect(getRoast).toHaveBeenCalledWith(
      expect.objectContaining({
        username: "fauzan",
        vibe: "tukang quote",
        recentThreads: ["posting real pertama", "posting real kedua"],
      }),
      expect.anything(),
    );
  });

  it("400 when username is empty after sanitization", async () => {
    const res = await POST(req({ username: "   @  ", vibe: "" }));
    expect(res.status).toBe(400);
  });

  it("502 with a friendly message (no key leak) when the provider throws", async () => {
    (getRoast as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("sk-secret blew up"),
    );
    const res = await POST(req({ username: "fauzan", vibe: "x" }));
    expect(res.status).toBe(502);
    const json = await res.json();
    expect(JSON.stringify(json)).not.toContain("sk-secret");
    expect(json.error).toBeTruthy();
  });

  it("429 once the per-IP limit is exceeded", async () => {
    const ip = "9.9.9.9";
    const limit = Number(process.env.ROAST_RATE_LIMIT) || 15;
    for (let i = 0; i < limit; i++)
      await POST(req({ username: "a", vibe: "b" }, ip));
    const res = await POST(req({ username: "a", vibe: "b" }, ip));
    expect(res.status).toBe(429);
  });
});
