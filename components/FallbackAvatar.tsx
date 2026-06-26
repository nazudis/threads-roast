import { initials } from '@/lib/initials'

export function FallbackAvatar({ username, size = 96 }: { username: string; size?: number }) {
  return (
    <div
      className="grid place-items-center rounded-2xl bg-char2 font-display text-vermillion"
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-label={`Avatar ${username}`}
    >
      {initials(username)}
    </div>
  )
}
