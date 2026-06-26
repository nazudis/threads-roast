import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { fetchRecentThreads } from "@/lib/threadsContext";

const originalFetch = global.fetch;

describe("fetchRecentThreads", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("fetches recent threads from the scraper items response with the configured api key", async () => {
    const fetchMock = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            username: "nazu_dis",
            count: 1,
            items: [
              {
                id: "3926650618353845656",
                username: "nazu_dis",
                text: "Dua orang, hutang sama-sama 50 juta.\n\nBukan soal disiplin. Soal urutan.",
                like_count: 7,
                reply_count: 1,
                repost_count: 0,
                created_at: "2026-06-24T15:00:52Z",
                url: "https://www.threads.net/@nazu_dis/post/DZ-Q-7gDIWY",
              },
            ],
          }),
          { status: 200 },
        ),
    );
    global.fetch = fetchMock as never;

    const posts = await fetchRecentThreads("nazu_dis", {
      apiKey: "some-key",
      baseUrl: "https://threads-scraper.fauzanakmal.com",
      limit: 10,
    });

    expect(posts).toEqual([
      {
        text: "Dua orang, hutang sama-sama 50 juta.\n\nBukan soal disiplin. Soal urutan.",
        likeCount: 7,
        replyCount: 1,
        repostCount: 0,
        createdAt: "2026-06-24T15:00:52Z",
        url: "https://www.threads.net/@nazu_dis/post/DZ-Q-7gDIWY",
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://threads-scraper.fauzanakmal.com/?username=nazu_dis&limit=10",
      expect.objectContaining({
        headers: { "x-api-key": "some-key" },
      }),
    );
  });

  it("returns an empty array when the api key is missing", async () => {
    const fetchMock = vi.fn();
    global.fetch = fetchMock as never;

    await expect(
      fetchRecentThreads("nazu_dis", {
        apiKey: "",
        baseUrl: "https://example.com",
      }),
    ).resolves.toEqual([]);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("throws a typed error when the scraper rejects an invalid username", async () => {
    global.fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ detail: "invalid username" }), {
          status: 400,
        }),
    ) as never;

    await expect(
      fetchRecentThreads("not_found", {
        apiKey: "some-key",
        baseUrl: "https://example.com",
      }),
    ).rejects.toMatchObject({ code: "INVALID_THREADS_USERNAME" });
  });

  it("fails open when the scraper api is down", async () => {
    global.fetch = vi.fn(
      async () => new Response("nope", { status: 500 }),
    ) as never;

    await expect(
      fetchRecentThreads("nazu_dis", {
        apiKey: "some-key",
        baseUrl: "https://example.com",
      }),
    ).resolves.toEqual([]);
  });
});
