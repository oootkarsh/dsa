import { Link, Navigate, useParams } from 'react-router-dom'
import { ALL_TOPICS, TOPICS, getProblemId } from '../data/curriculum'
import { useProgress } from '../context/ProgressContext'
import DifficultyBadge from '../components/DifficultyBadge'
import ProgressBar from '../components/ProgressBar'

function SectionHeading({ children }) {
  return (
    <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
      {children}
    </h2>
  )
}

export default function TopicPage() {
  const { topicId } = useParams()
  const topic = TOPICS[topicId]
  const { isDone, toggle } = useProgress()

  if (!topic) return <Navigate to="/" replace />

  const idx = ALL_TOPICS.findIndex((t) => t.id === topicId)
  const prev = idx > 0 ? ALL_TOPICS[idx - 1] : null
  const next = idx < ALL_TOPICS.length - 1 ? ALL_TOPICS[idx + 1] : null

  const doneCount = topic.problems.filter((p) => isDone(getProblemId(topic.id, p.title))).length
  const lesson = topic.lesson

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
          <span>Week {topic.week}</span>
          <span>·</span>
          <span>Day {topic.day}</span>
          <span>·</span>
          <span className="text-slate-600 dark:text-slate-400">{topic.category}</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">{topic.title}</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">{topic.summary}</p>
      </div>

      {lesson && (
        <section className="flex flex-col gap-6 rounded-xl border border-indigo-200 bg-indigo-50/60 p-5 dark:border-indigo-500/20 dark:bg-indigo-500/[0.04]">
          <div>
            <SectionHeading>Learn the concept</SectionHeading>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{lesson.intro}</p>
          </div>

          {lesson.steps?.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                How it works
              </h3>
              <ol className="flex flex-col gap-2.5">
                {lesson.steps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {lesson.example && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Worked example
              </h3>
              <div className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]">
                <p className="mb-3 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {lesson.example.setup}
                </p>
                <ul className="flex flex-col gap-2">
                  {lesson.example.walkthrough.map((step, i) => (
                    <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {lesson.code && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Code template
              </h3>
              <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4 text-xs leading-relaxed text-slate-100">
                <code>{lesson.code}</code>
              </pre>
            </div>
          )}

          {lesson.pitfalls?.length > 0 && (
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Common pitfalls
              </h3>
              <ul className="flex flex-col gap-2">
                {lesson.pitfalls.map((pitfall, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-amber-800 dark:text-amber-200/80">
                    <span className="mt-1 shrink-0">⚠</span>
                    <span>{pitfall}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {topic.keyIdeas?.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <SectionHeading>{lesson ? 'Quick recap' : 'What to internalize today'}</SectionHeading>
          <ul className="flex flex-col gap-2.5">
            {topic.keyIdeas.map((idea, i) => (
              <li key={i} className="flex gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                {idea}
              </li>
            ))}
          </ul>
        </section>
      )}

      {topic.complexity?.length > 0 && (
        <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <SectionHeading>Complexity reference</SectionHeading>
          <table className="w-full min-w-[420px] text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-2 font-medium">Operation</th>
                <th className="pb-2 font-medium">Time</th>
                <th className="pb-2 font-medium">Space</th>
              </tr>
            </thead>
            <tbody>
              {topic.complexity.map((row) => (
                <tr key={row.op} className="border-t border-slate-100 dark:border-white/5">
                  <td className="py-2 text-slate-700 dark:text-slate-300">{row.op}</td>
                  <td className="py-2 font-mono text-indigo-600 dark:text-indigo-300">{row.time}</td>
                  <td className="py-2 font-mono text-slate-600 dark:text-slate-400">{row.space}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {topic.problems.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Practice problems
            </h2>
            <span className="text-xs tabular-nums text-slate-500">
              {doneCount}/{topic.problems.length}
            </span>
          </div>
          <ProgressBar value={doneCount} total={topic.problems.length} className="mb-4" />
          <ul className="flex flex-col divide-y divide-slate-100 dark:divide-white/5">
            {topic.problems.map((p) => {
              const id = getProblemId(topic.id, p.title)
              const complete = isDone(id)
              return (
                <li key={id} className="flex items-center gap-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={complete}
                    onChange={() => toggle(id)}
                    className="h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 bg-transparent accent-indigo-500 dark:border-slate-600"
                    aria-label={`Mark ${p.title} as solved`}
                  />
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 truncate text-sm hover:text-indigo-600 hover:underline dark:hover:text-indigo-300 ${
                      complete ? 'text-slate-400 line-through dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    {p.title}
                  </a>
                  {p.note && <span className="hidden shrink-0 text-xs text-slate-500 sm:inline">{p.note}</span>}
                  <DifficultyBadge level={p.difficulty} />
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {topic.resources?.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <SectionHeading>Further reading</SectionHeading>
          <ul className="flex flex-col gap-2">
            {topic.resources.map((r) => (
              <li key={r.url}>
                <a
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-indigo-600 hover:underline dark:text-indigo-300"
                >
                  {r.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="flex items-center justify-between border-t border-slate-200 pt-6 dark:border-white/10">
        {prev ? (
          <Link
            to={`/topic/${prev.id}`}
            className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            ← Day {prev.day}: {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to={`/topic/${next.id}`}
            className="text-right text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          >
            Day {next.day}: {next.title} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  )
}
