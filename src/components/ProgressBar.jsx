export default function ProgressBar({ value, total, className = '', barClassName = 'bg-indigo-500' }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-white/10 ${className}`}>
      <div
        className={`h-full rounded-full transition-all duration-300 ${barClassName}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
