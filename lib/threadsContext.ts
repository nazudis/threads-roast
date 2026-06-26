export type RecentThread = {
  text: string;
  likeCount?: number;
  replyCount?: number;
  repostCount?: number;
  createdAt?: string;
  url?: string;
};

export type FetchRecentThreadsOptions = {
  apiKey?: string;
  baseUrl?: string;
  limit?: number;
};

type UnknownRecord = Record<string, unknown>;

const DEFAULT_BASE_URL = "https://threads-scraper.fauzanakmal.com";
const DEFAULT_LIMIT = 10;

function asRecord(value: unknown): UnknownRecord | null {
  return value && typeof value === "object" ? (value as UnknownRecord) : null;
}

function textFromRecord(record: UnknownRecord): string | null {
  const direct = record.text ?? record.content ?? record.caption ?? record.body;
  if (typeof direct === "string" && direct.trim()) return direct.trim();

  const caption = asRecord(record.caption);
  const captionText = caption?.text;
  if (typeof captionText === "string" && captionText.trim())
    return captionText.trim();

  return null;
}

function optionalNumber(value: unknown): number | undefined {
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function extractThread(item: unknown): RecentThread | null {
  if (typeof item === "string") {
    const text = item.trim();
    return text ? { text } : null;
  }

  const record = asRecord(item);
  if (!record) return null;
  const source = asRecord(record.post) ?? asRecord(record.thread) ?? record;
  const text = textFromRecord(source);
  if (!text) return null;

  return {
    text,
    likeCount: optionalNumber(source.like_count ?? source.likes),
    replyCount: optionalNumber(
      source.reply_count ?? source.comment_count ?? source.replies,
    ),
    repostCount: optionalNumber(source.repost_count ?? source.reposts),
    createdAt: optionalString(
      source.created_at ?? source.timestamp ?? source.taken_at,
    ),
    url: optionalString(source.url),
  };
}

function extractItems(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  const record = asRecord(payload);
  if (!record) return [];

  for (const key of ["data", "threads", "posts", "items", "results"]) {
    const value = record[key];
    if (Array.isArray(value)) return value;
  }

  return [];
}

export async function fetchRecentThreads(
  username: string,
  options: FetchRecentThreadsOptions = {},
): Promise<RecentThread[]> {
  const apiKey = options.apiKey ?? process.env.THREADS_SCRAPER_API_KEY ?? "";
  if (!apiKey) return [];

  const baseUrl =
    options.baseUrl ?? process.env.THREADS_SCRAPER_BASE_URL ?? DEFAULT_BASE_URL;
  const envLimit = Number(process.env.THREADS_SCRAPER_LIMIT);
  const limit =
    options.limit ??
    (Number.isFinite(envLimit) && envLimit > 0 ? envLimit : DEFAULT_LIMIT);
  const url = new URL(baseUrl);
  url.searchParams.set("username", username);
  url.searchParams.set("limit", String(limit));

  try {
    const res = await fetch(url.toString(), {
      headers: { "x-api-key": apiKey },
      signal: AbortSignal.timeout(4_000),
    });
    if (!res.ok) return [];

    const payload = await res.json();
    return extractItems(payload)
      .map(extractThread)
      .filter((thread): thread is RecentThread => Boolean(thread))
      .slice(0, limit);
  } catch (err) {
    console.warn(
      "[threads-context] failed to fetch recent threads:",
      err instanceof Error ? err.message : err,
    );
    return [];
  }
}
