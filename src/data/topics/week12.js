import { LC } from '../lc'

export const WEEK12_META = {
  id: 12,
  title: 'Interview Readiness, Part 2: Final Push',
  goal: 'The final week — one more mock, a dedicated system design mock, two full simulated onsite loops, last targeted drilling, and deliberate rest before interview day.',
  dayIds: [
    'mock-interview-4',
    'system-design-mock',
    'final-mock-loop-1',
    'final-mock-loop-2',
    'final-weak-area-drilling',
    'final-polish',
    'rest-and-reflect',
  ],
}

export const WEEK12_TOPICS = {
  'mock-interview-4': {
    id: 'mock-interview-4',
    title: 'Mock Interview 4',
    week: 12,
    day: 78,
    category: 'Interview Readiness',
    summary:
      'One more single-round mock before this week\'s full simulated onsites — a last check that the fundamentals are automatic before the pressure ramps up.',
    keyIdeas: [
      'By now this should feel routine: 35-45 minutes, narrate before coding, state complexity unprompted at the end.',
      'Pick problems specifically from the two topics you drilled last week — confirm they\'ve actually stuck under fresh timed pressure, not just during untimed practice.',
      'If something still wobbles, that\'s useful information now, three days before the final mock loops — better to find it today than during final-polish.',
      'Keep the self-review habit: 5 minutes after each problem, honestly note what a strong interviewer would have pushed back on.',
    ],
    problems: [
      { title: 'Longest Increasing Subsequence', difficulty: 'Medium', url: LC('longest-increasing-subsequence') },
      { title: 'Number of Islands', difficulty: 'Medium', url: LC('number-of-islands') },
      { title: 'Validate Binary Search Tree', difficulty: 'Medium', url: LC('validate-binary-search-tree') },
      { title: 'Task Scheduler', difficulty: 'Medium', url: LC('task-scheduler') },
    ],
  },

  'system-design-mock': {
    id: 'system-design-mock',
    title: 'System Design Mock Interview',
    week: 12,
    day: 79,
    category: 'Interview Readiness',
    summary:
      'A dedicated system design mock — a genuinely different rhythm from a coding round, worth rehearsing on its own rather than assuming coding practice transfers automatically.',
    lesson: {
      intro:
        'A system design round has no compiler and often no single correct answer — the skill being evaluated is how you structure an open-ended conversation: clarifying scope, estimating scale, proposing an architecture, and defending trade-offs under follow-up questions. That\'s different enough from coding interview mechanics to deserve its own dedicated rehearsal.',
      steps: [
        'Pick one system you haven\'t explicitly designed yet (not URL Shortener, Rate Limiter, or News Feed from week 10 — pick something adjacent, like "design a parking garage payment system\'s backend" or "design a simple pastebin/Google Docs-lite") and give yourself 35-45 minutes.',
        'Follow the same flow as week 10\'s case studies: clarify requirements and explicit scope → estimate scale (users, data volume, read/write ratio) → API design → data model → identify the bottleneck and address it (usually caching, sharding, or a queue) → discuss trade-offs.',
        'Practice being comfortable with silence while you think, and with saying "let me estimate that" before doing back-of-envelope math out loud — both read as confidence, not hesitation, when done deliberately.',
        'If you can, do this one as a live mock (Pramp and interviewing.io both support system design format) — the improvised follow-up questions from another person are the hardest part to simulate alone.',
        'Afterward, compare your process against week 10\'s case studies: did you estimate scale before proposing architecture? Did you name at least one trade-off explicitly rather than presenting a single "correct" design?',
      ],
      pitfalls: [
        'Jumping to a detailed architecture in the first five minutes — the clarify-and-scope step is where weak answers most often lose points, precisely because it\'s easy to rush past.',
        'Presenting one design with total confidence instead of surfacing trade-offs — system design rounds reward "here\'s option A vs B, and here\'s why I\'d lean toward A given these requirements" over a single unexamined answer.',
        'Going silent for long stretches while thinking — narrate your reasoning even when you\'re unsure, since the interviewer is evaluating your process, not just your final diagram.',
      ],
    },
    keyIdeas: [
      'System design rounds evaluate process (clarify → estimate → design → defend trade-offs), not one "correct" architecture.',
      'Reuse week 10\'s flow on a fresh system you haven\'t explicitly designed before.',
      'Narrate your thinking, including scale estimates, out loud — silence reads as uncertainty even when you\'re making progress.',
      'A live mock (Pramp/interviewing.io) is especially valuable here, since improvised follow-ups are hard to simulate alone.',
    ],
    problems: [],
  },

  'final-mock-loop-1': {
    id: 'final-mock-loop-1',
    title: 'Final Mock Loop 1',
    week: 12,
    day: 80,
    category: 'Interview Readiness',
    isReview: true,
    summary:
      'A full simulated onsite: 3-4 back-to-back timed coding rounds plus one behavioral round, as close to real conditions as you can make it.',
    keyIdeas: [
      'Simulate a real Google onsite: 3-4 coding rounds (35-45 min each) + 1 behavioral round, with short breaks between, in one sitting if possible.',
      'Use unseen problems if you can (ask a friend to pick, or pull random Mediums/Hards you haven\'t done) so it\'s a genuine test, not pattern-matching to memory.',
      'Time yourself strictly and stop at the limit even if unfinished — that\'s realistic interview pressure, and it\'s useful data about your pacing.',
      'Debrief immediately afterward: which rounds felt shaky? That\'s exactly what today\'s remaining time and tomorrow\'s loop should target.',
    ],
    problems: [
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: LC('longest-substring-without-repeating-characters') },
      { title: 'Course Schedule II', difficulty: 'Medium', url: LC('course-schedule-ii') },
      { title: 'Coin Change', difficulty: 'Medium', url: LC('coin-change') },
      { title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: LC('kth-largest-element-in-an-array') },
    ],
  },

  'final-mock-loop-2': {
    id: 'final-mock-loop-2',
    title: 'Final Mock Loop 2',
    week: 12,
    day: 81,
    category: 'Interview Readiness',
    isReview: true,
    summary:
      'A second full simulated onsite — back-to-back with yesterday\'s on purpose, to rehearse recovering and staying sharp across consecutive high-pressure days.',
    keyIdeas: [
      'Same format as yesterday: 3-4 timed coding rounds + 1 behavioral round, strict timing, unseen problems if possible.',
      'This time, deliberately include one problem type you haven\'t seen in a mock yet this plan (e.g., a heap or trie problem if your last three mocks skewed toward graphs and DP).',
      'Notice whether yesterday\'s debrief actually changed anything today — did the specific weak spot you identified show up again, and did you handle it better?',
      'Debrief again: this is your last full simulated loop before final polish — be honest about what still needs attention over the next two days.',
    ],
    problems: [
      { title: 'Find Median from Data Stream', difficulty: 'Hard', url: LC('find-median-from-data-stream') },
      { title: 'Word Search II', difficulty: 'Hard', url: LC('word-search-ii') },
      { title: 'House Robber II', difficulty: 'Medium', url: LC('house-robber-ii') },
      { title: 'Redundant Connection', difficulty: 'Medium', url: LC('redundant-connection') },
    ],
  },

  'final-weak-area-drilling': {
    id: 'final-weak-area-drilling',
    title: 'Final Weak-Area Drilling',
    week: 12,
    day: 82,
    category: 'Interview Readiness',
    isReview: true,
    summary:
      'Address exactly what the two final mock loops exposed — nothing more, nothing less. This is the last day for substantive new practice.',
    keyIdeas: [
      'Work only from what the last two days\' debriefs surfaced — resist the urge to branch into new topics this close to the end.',
      'Re-solve 3-4 problems from each weak spot identified, untimed, until the pattern feels automatic rather than effortful.',
      'Re-derive core templates one final time from a blank file for anything that felt shaky: two pointers, sliding window, DFS/BFS, backtracking, 1-D/2-D DP, Dijkstra, Union-Find.',
      'This is the last day for substantive new problem-solving in this plan — tomorrow is light touch-up only.',
    ],
    problems: [],
  },

  'final-polish': {
    id: 'final-polish',
    title: 'Final Polish',
    week: 12,
    day: 83,
    category: 'Interview Readiness',
    isReview: true,
    summary:
      'Light touch-up day. Fix only the smallest remaining gaps; don\'t start new topics this late.',
    keyIdeas: [
      'Address only small, specific gaps — don\'t branch into new material one day before showtime.',
      'Re-read your 5-6 behavioral stories once, out loud, from memory.',
      'Skim the Pattern Cheatsheet end to end one more time — the signal-to-pattern table especially.',
      'Get a normal night\'s sleep tonight — this matters more than one more problem.',
    ],
    problems: [],
  },

  'rest-and-reflect': {
    id: 'rest-and-reflect',
    title: 'Rest & Reflect',
    week: 12,
    day: 84,
    category: 'Interview Readiness',
    isReview: true,
    summary:
      'Deliberate rest day. Twelve weeks of building real understanding from the ground up, not just memorizing solutions — trust the preparation.',
    keyIdeas: [
      'No new problems today. Light review only if it genuinely reduces anxiety (skim the cheatsheet, nothing more).',
      'Re-read your behavioral stories once, out loud.',
      'Prepare logistics for interview day: quiet space, working webcam/mic, water, notepad and pen.',
      'Remind yourself: twelve weeks of deliberate, intensive practice — building concepts from scratch, then rehearsing them under real conditions — beats last-minute cramming every time. You\'re ready.',
    ],
    problems: [],
  },
}
