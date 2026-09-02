import { Link } from 'react-router-dom'
import { WEEKS, TOPICS, ALL_TOPICS, TOTAL_PROBLEMS, TOTAL_DAYS, getProblemId } from '../data/curriculum'
import { useProgress } from '../context/ProgressContext'
import ProgressBar from '../components/ProgressBar'

function weekStats(week, isDone) {
  const topics = week.dayIds.map((id) => TOPICS[id])
  const total = topics.reduce((s, t) => s + t.problems.length, 0)
  const done = topics.reduce(
    (s, t) => s + t.problems.filter((p) => isDone(getProblemId(t.id, p.title))).length,
    0,
  )
  return { done, total }
}

export default function Home() {
  const { isDone, count } = useProgress()

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          12-Week Intensive Interview Prep Plan · ~6 hrs/day
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          Learn DSA from scratch for Google SWE interviews
        </h1>
        <p className="max-w-2xl text-slate-600 dark:text-slate-400">
          Built for learning these concepts for the first time, not just brushing up. Every topic starts with
          a from-the-ground-up lesson — what it is, how it works, a worked example traced step by step, a
          Python code template, and common pitfalls — before linking to hand-picked practice problems on
          LeetCode. Check problems off as you solve them; progress is saved locally in your browser.
        </p>
        <div className="max-w-2xl rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
          <span className="font-medium text-slate-800 dark:text-slate-300">Suggested daily rhythm (~6 hours): </span>
          spend 45-60 min reading the day&apos;s lesson and tracing the worked example by hand, then 4-4.5
          hours solving that day&apos;s practice problems (attempt each one solo for 20-25 min before checking
          a hint), and close with 30-45 min re-deriving the pattern from a blank file, no notes.
        </div>
        <div className="mt-2 max-w-sm">
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="text-slate-700 dark:text-slate-300">Overall progress</span>
            <span className="tabular-nums text-slate-500 dark:text-slate-400">
              {count}/{TOTAL_PROBLEMS}
            </span>
          </div>
          <ProgressBar value={count} total={TOTAL_PROBLEMS} />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WEEKS.map((week) => {
          const { done, total } = weekStats(week, isDone)
          const firstTopic = TOPICS[week.dayIds[0]]
          return (
            <Link
              key={week.id}
              to={`/topic/${firstTopic.id}`}
              className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-indigo-400 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-indigo-500/40 dark:hover:bg-white/[0.07]"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Week {week.id}
                </span>
                <span className="text-xs tabular-nums text-slate-500">
                  {done}/{total} solved
                </span>
              </div>
              <h2 className="text-lg font-semibold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-300">
                {week.title}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">{week.goal}</p>
              <ProgressBar value={done} total={total} className="mt-1" />
            </Link>
          )
        })}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{TOTAL_DAYS}-day schedule</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7">
          {ALL_TOPICS.map((topic) => {
            const total = topic.problems.length
            const done = topic.problems.filter((p) => isDone(getProblemId(topic.id, p.title))).length
            const complete = total > 0 && done === total
            return (
              <Link
                key={topic.id}
                to={`/topic/${topic.id}`}
                className={`flex flex-col gap-1 rounded-lg border p-3 text-sm transition hover:border-indigo-400 hover:bg-slate-50 dark:hover:border-indigo-500/40 dark:hover:bg-white/5 ${
                  complete
                    ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/5'
                    : 'border-slate-200 bg-white dark:border-white/10 dark:bg-white/[0.02]'
                }`}
              >
                <span className="text-xs text-slate-500">Day {topic.day}</span>
                <span className="line-clamp-2 font-medium text-slate-800 dark:text-slate-200">{topic.title}</span>
                {total > 0 ? (
                  <span
                    className={`mt-1 text-xs tabular-nums ${
                      complete ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {done}/{total}
                  </span>
                ) : (
                  <span className="mt-1 text-xs text-slate-400 dark:text-slate-600">review day</span>
                )}
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
