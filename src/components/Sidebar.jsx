import { NavLink } from 'react-router-dom'
import { WEEKS, TOPICS } from '../data/curriculum'
import { useProgress } from '../context/ProgressContext'
import { getProblemId } from '../data/curriculum'

function topicCompletion(topic, isDone) {
  if (topic.problems.length === 0) return null
  const done = topic.problems.filter((p) => isDone(getProblemId(topic.id, p.title))).length
  return { done, total: topic.problems.length }
}

export default function Sidebar({ onNavigate }) {
  const { isDone } = useProgress()

  return (
    <nav className="flex h-full flex-col gap-6 overflow-y-auto px-4 py-6">
      <NavLink
        to="/"
        onClick={onNavigate}
        className="flex items-center gap-2 px-2 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
      >
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500 text-sm text-white">
          G
        </span>
        DSAlgo for Google
      </NavLink>

      <div className="flex flex-col gap-1 px-2">
        <NavLink
          to="/"
          end
          onClick={onNavigate}
          className={({ isActive }) =>
            `rounded-md px-2 py-1.5 text-sm font-medium ${
              isActive
                ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`
          }
        >
          Roadmap
        </NavLink>
        <NavLink
          to="/cheatsheet"
          onClick={onNavigate}
          className={({ isActive }) =>
            `rounded-md px-2 py-1.5 text-sm font-medium ${
              isActive
                ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`
          }
        >
          Pattern Cheatsheet
        </NavLink>
        <NavLink
          to="/resources"
          onClick={onNavigate}
          className={({ isActive }) =>
            `rounded-md px-2 py-1.5 text-sm font-medium ${
              isActive
                ? 'bg-slate-100 text-slate-900 dark:bg-white/10 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`
          }
        >
          Resources
        </NavLink>
      </div>

      {WEEKS.map((week) => (
        <div key={week.id} className="flex flex-col gap-1">
          <div className="px-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Week {week.id}
          </div>
          {week.dayIds.map((topicId) => {
            const topic = TOPICS[topicId]
            const completion = topicCompletion(topic, isDone)
            return (
              <NavLink
                key={topicId}
                to={`/topic/${topicId}`}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center justify-between gap-2 rounded-md px-2 py-1.5 text-sm ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300'
                      : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white'
                  }`
                }
              >
                <span className="flex items-center gap-2 truncate">
                  <span className="w-5 shrink-0 text-right text-xs text-slate-400 dark:text-slate-600">
                    D{topic.day}
                  </span>
                  <span className="truncate">{topic.title}</span>
                </span>
                {completion && (
                  <span
                    className={`shrink-0 text-xs tabular-nums ${
                      completion.done === completion.total
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {completion.done}/{completion.total}
                  </span>
                )}
              </NavLink>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
