import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'dsalgo-progress-v1'
const ProgressContext = createContext(null)

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

export function ProgressProvider({ children }) {
  const [done, setDone] = useState(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done))
    } catch {
      // storage unavailable (private browsing, quota) — progress just won't persist
    }
  }, [done])

  const api = useMemo(
    () => ({
      done,
      isDone: (id) => Boolean(done[id]),
      toggle: (id) =>
        setDone((prev) => {
          const next = { ...prev }
          if (next[id]) {
            delete next[id]
          } else {
            next[id] = true
          }
          return next
        }),
      reset: () => setDone({}),
      count: Object.keys(done).length,
    }),
    [done],
  )

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
