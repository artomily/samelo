/** Lightweight class-name merge helper (no external dep needed) */
export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ')
}
