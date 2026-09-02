const STYLES = {
  Easy: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30',
  Medium: 'bg-amber-50 text-amber-700 ring-1 ring-amber-300 dark:bg-amber-500/10 dark:text-amber-400 dark:ring-amber-500/30',
  Hard: 'bg-rose-50 text-rose-700 ring-1 ring-rose-300 dark:bg-rose-500/10 dark:text-rose-400 dark:ring-rose-500/30',
}

export default function DifficultyBadge({ level }) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${STYLES[level] ?? STYLES.Medium}`}>
      {level}
    </span>
  )
}
