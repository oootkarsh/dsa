const BIG_O = [
  { curve: 'O(1)', meaning: 'Constant', example: 'array/hash access, push/pop' },
  { curve: 'O(log n)', meaning: 'Logarithmic', example: 'binary search, balanced BST ops' },
  { curve: 'O(n)', meaning: 'Linear', example: 'single pass, two pointers' },
  { curve: 'O(n log n)', meaning: 'Linearithmic', example: 'sorting, heap-based top-k' },
  { curve: 'O(n²)', meaning: 'Quadratic', example: 'nested loop over pairs, naive DP grid' },
  { curve: 'O(2ⁿ)', meaning: 'Exponential', example: 'subsets, unpruned backtracking' },
  { curve: 'O(n!)', meaning: 'Factorial', example: 'permutations' },
]

const SIGNALS = [
  { signal: 'Sorted array + find a pair/triplet', pattern: 'Two pointers' },
  { signal: '"Longest/shortest substring or subarray with property X"', pattern: 'Sliding window' },
  { signal: '"Have I seen this / does this exist / count frequency"', pattern: 'Hash map / hash set' },
  { signal: 'Matching brackets, "next greater element"', pattern: 'Stack (monotonic stack)' },
  { signal: 'Sorted (or rotatable-to-sorted) array, or a monotonic feasibility check', pattern: 'Binary search (incl. "binary search the answer")' },
  { signal: 'Tree traversal, "path from root", subtree comparisons', pattern: 'DFS (recursive)' },
  { signal: '"Level order", "shortest path", unweighted graph/grid', pattern: 'BFS' },
  { signal: '"All possible combinations/subsets/permutations"', pattern: 'Backtracking' },
  { signal: '"Top k", running median, scheduling by priority', pattern: 'Heap / priority queue' },
  { signal: 'Prefix queries, autocomplete over many words', pattern: 'Trie' },
  { signal: 'Non-negative weighted shortest path', pattern: "Dijkstra's algorithm" },
  { signal: '"Are these connected", cycle detection in a graph', pattern: 'Union-Find' },
  { signal: 'Overlapping subproblems + optimal substructure, "count ways" / "min/max cost"', pattern: 'Dynamic programming' },
  { signal: 'Local optimal choice provably leads to global optimum, single pass', pattern: 'Greedy' },
  { signal: 'Sort by start/end time, then merge or count overlaps', pattern: 'Interval sweep' },
]

const FRAMEWORK = [
  {
    step: '1. Clarify',
    detail: 'Restate the problem. Ask about input size, duplicates, sorted-ness, negative numbers, empty input.',
  },
  {
    step: '2. Brute force',
    detail: 'State the naive solution and its complexity out loud, even if you won\'t code it.',
  },
  {
    step: '3. Find the bottleneck',
    detail: 'What\'s slow about the brute force? Repeated lookups? Repeated recomputation? Nested search?',
  },
  {
    step: '4. Match a pattern',
    detail: 'Use the signal table below to map the bottleneck to a known pattern.',
  },
  {
    step: '5. Code',
    detail: 'Narrate as you write. Use clear variable names. Handle edge cases (empty, single element, all-same).',
  },
  {
    step: '6. Test & analyze',
    detail: 'Trace through a small example by hand, then state final time/space complexity.',
  },
]

export default function Cheatsheet() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">Pattern Cheatsheet</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">
          A one-page reference for interview day — the growth curves, the interview framework, and a
          signal-to-pattern lookup table for quickly recognizing which technique a problem wants.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          The 6-step framework
        </h2>
        <ol className="flex flex-col gap-3">
          {FRAMEWORK.map((f) => (
            <li key={f.step} className="rounded-lg border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-white/5">
              <div className="font-semibold text-slate-800 dark:text-slate-200">{f.step}</div>
              <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">{f.detail}</div>
            </li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Big-O growth curves
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-2 font-medium">Curve</th>
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Typical example</th>
              </tr>
            </thead>
            <tbody>
              {BIG_O.map((row) => (
                <tr key={row.curve} className="border-t border-slate-100 dark:border-white/5">
                  <td className="py-2 font-mono text-indigo-600 dark:text-indigo-300">{row.curve}</td>
                  <td className="py-2 text-slate-700 dark:text-slate-300">{row.meaning}</td>
                  <td className="py-2 text-slate-600 dark:text-slate-400">{row.example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
          Signal → pattern lookup
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="pb-2 font-medium">If you see…</th>
                <th className="pb-2 font-medium">…think</th>
              </tr>
            </thead>
            <tbody>
              {SIGNALS.map((row) => (
                <tr key={row.pattern} className="border-t border-slate-100 dark:border-white/5">
                  <td className="py-2 pr-4 text-slate-600 dark:text-slate-400">{row.signal}</td>
                  <td className="py-2 font-medium text-slate-800 dark:text-slate-200">{row.pattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
