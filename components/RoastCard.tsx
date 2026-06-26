import { COPY } from "@/lib/cardTokens";
import { formatRoastForReading } from "@/lib/formatRoast";
import { FallbackAvatar } from "./FallbackAvatar";
import { SeverityStamp } from "./SeverityStamp";

export type RoastCardData = {
  username: string;
  roast: string;
  photoDataUrl: string | null;
  label: string;
  color: string;
  serial: string;
};

export function RoastCard({
  data,
  animate = false,
}: {
  data: RoastCardData;
  animate?: boolean;
}) {
  const r = (cls: string) => (animate ? cls : "");
  return (
    <div className="bg-heat relative mx-auto flex w-full max-w-[420px] flex-col rounded-2xl border border-oxblood p-6 shadow-[0_30px_80px_-20px_rgba(255,59,31,0.4)]">
      {/* header */}
      <div
        className={`flex items-center justify-between font-mono text-[10px] tracking-[0.2em] text-ashdim ${r("reveal reveal-1")}`}
      >
        <span>{COPY.tagline}</span>
        <span style={{ color: data.color }}>{data.serial}</span>
      </div>

      <div
        className={`font-display text-7xl leading-[0.85] tracking-wide text-vermillion ${r("reveal reveal-1")}`}
      >
        ROAST
      </div>

      <div className={`mt-4 flex items-center gap-4 ${r("reveal reveal-2")}`}>
        <div className="relative size-24 overflow-hidden rounded-2xl border-4 border-vermillion shadow-[0_0_40px_rgba(255,59,31,0.45)]">
          {data.photoDataUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.photoDataUrl}
                alt=""
                className="photo-duotone size-full object-cover"
              />
              <div className="absolute inset-0 bg-ember/30 mix-blend-multiply" />
            </>
          ) : (
            <FallbackAvatar username={data.username} size={96} />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-lg font-bold text-ash">
            @{data.username}
          </span>
          {/* Only apply the reveal-stamp class when animating — it sets opacity:0
              until the animation runs, which would otherwise hide the stamp on a
              static (animate=false) card. */}
          <div
            className={animate ? "reveal-stamp" : ""}
            style={{ display: "inline-block" }}
          >
            <SeverityStamp label={data.label} color={data.color} />
          </div>
        </div>
      </div>

      <p
        className={`mt-5 whitespace-pre-line font-mono text-[15px] leading-relaxed text-ash ${r("reveal reveal-3")}`}
      >
        {`"${formatRoastForReading(data.roast)}"`}
      </p>

      <div
        className={`mt-5 flex items-center justify-between border-t-2 border-dashed border-ashdim/50 pt-3 ${r("reveal reveal-3")}`}
      >
        <span className="font-display text-2xl tracking-wide text-vermillion">
          {COPY.brandName}
        </span>
        <span className="font-mono text-[10px] text-ashdim">
          {COPY.handle} · {COPY.footnote}
        </span>
      </div>
    </div>
  );
}
