import { PLATFORMS } from '../data/curriculum'

export default function Resources() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Resources</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          Platforms referenced throughout this plan, plus a few notes on how to use each one well.
        </p>
      </div>

      <ul className="flex flex-col gap-3">
        {PLATFORMS.map((p) => (
          <li key={p.url} className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="text-lg font-semibold text-indigo-600 hover:underline dark:text-indigo-300"
            >
              {p.name} ↗
            </a>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{p.blurb}</p>
          </li>
        ))}
      </ul>

      <section className="rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          How to use this plan well
        </h2>
        <ul className="flex flex-col gap-2.5 text-sm text-slate-700 dark:text-slate-300">
          <li>
            Solve every problem yourself for at least 20-25 minutes before looking at a hint or editorial —
            productive struggle is where the pattern actually sinks in.
          </li>
          <li>
            After solving (or reading a solution), re-solve it again from a blank file the next day. Recall
            beats re-reading.
          </li>
          <li>
            Say your approach out loud, even alone. Google interviews grade communication as much as
            correctness.
          </li>
          <li>
            If a topic isn't clicking after two problems, that's normal — move to the next problem in the
            same topic rather than grinding one problem for hours.
          </li>
        </ul>
      </section>
    </div>
  )
}
