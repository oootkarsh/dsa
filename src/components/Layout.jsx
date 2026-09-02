import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useProgress } from '../context/ProgressContext'
import { useTheme } from '../context/ThemeContext'
import { TOTAL_PROBLEMS } from '../data/curriculum'
import ProgressBar from './ProgressBar'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="shrink-0 rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
          />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  )
}

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { count, reset } = useProgress()

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-200">
      <div className="mx-auto flex max-w-7xl">
        <aside className="hidden w-72 shrink-0 border-r border-slate-200 lg:block dark:border-white/10">
          <div className="sticky top-0 h-screen">
            <Sidebar />
          </div>
        </aside>

        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl dark:bg-slate-950">
              <Sidebar onNavigate={() => setMobileOpen(false)} />
            </div>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-slate-50/90 px-4 py-3 backdrop-blur lg:px-8 dark:border-white/10 dark:bg-slate-950/90">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 lg:hidden dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
              aria-label="Open navigation"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Overall progress · {count}/{TOTAL_PROBLEMS} problems
                </span>
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (count > 0 && confirm('Reset all progress? This cannot be undone.')) reset()
                    }}
                    disabled={count === 0}
                    className="text-xs text-slate-500 underline decoration-dotted hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-slate-500 dark:text-slate-500 dark:hover:text-slate-300 dark:disabled:hover:text-slate-500"
                  >
                    Reset progress
                  </button>
                  <ThemeToggle />
                </div>
              </div>
              <ProgressBar value={count} total={TOTAL_PROBLEMS} className="mt-1.5 max-w-md" />
            </div>
          </header>

          <main className="px-4 py-8 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
