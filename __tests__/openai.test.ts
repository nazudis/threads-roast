import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getRoast } from "@/lib/openai";

function fakeClient(create: ReturnType<typeof vi.fn>) {
  return {
    chat: {
      completions: {
        create,
      },
    },
  } as never;
}

describe("getRoast", () => {
  const originalModel = process.env.OPENAI_MODEL;
  const originalModels = process.env.OPENAI_MODELS;

  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.OPENAI_MODEL;
    delete process.env.OPENAI_MODELS;
  });

  afterEach(() => {
    process.env.OPENAI_MODEL = originalModel;
    process.env.OPENAI_MODELS = originalModels;
  });

  it("uses max_completion_tokens instead of deprecated max_tokens", async () => {
    const create = vi.fn(async () => ({
      choices: [{ message: { content: "kena mental tapi sayang" } }],
    }));

    await getRoast(
      { username: "fauzan", vibe: "quote" },
      { client: fakeClient(create) },
    );

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({ max_completion_tokens: 512 }),
    );
    expect(create).toHaveBeenCalledWith(
      expect.not.objectContaining({ max_tokens: expect.anything() }),
    );
  });

  it("round robins to the next configured model when a request fails", async () => {
    process.env.OPENAI_MODELS = "model-a, model-b, model-c";
    const create = vi
      .fn()
      .mockRejectedValueOnce(new Error("model-a down"))
      .mockResolvedValueOnce({
        choices: [{ message: { content: "akhirnya nyala 🔥" } }],
      });

    const roast = await getRoast(
      { username: "fauzan", vibe: "quote" },
      { client: fakeClient(create) },
    );

    expect(roast).toBe("akhirnya nyala 🔥");
    expect(create).toHaveBeenCalledTimes(2);
    expect(create.mock.calls[0][0].model).toBe("model-a");
    expect(create.mock.calls[1][0].model).toBe("model-b");
  });
});
