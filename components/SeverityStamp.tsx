export function SeverityStamp({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex -rotate-3 items-center rounded-md px-3 py-1.5 font-mono text-sm font-bold tracking-widest text-char shadow-[0_4px_0_rgba(0,0,0,0.35)]"
      style={{ backgroundColor: color }}
    >
      {label}
    </span>
  )
}
