import { LC } from '../lc'

export const WEEK11_META = {
  id: 11,
  title: 'Interview Readiness, Part 1',
  goal: 'Shift from learning new material to rehearsing under real conditions: behavioral prep, three full mock interviews, and targeted drilling on whatever those mocks expose.',
  dayIds: [
    'behavioral-googleyness',
    'mock-interview-1',
    'mock-interview-2',
    'mock-interview-3',
    'weak-area-drilling-1',
    'weak-area-drilling-2',
    'week11-review',
  ],
}

export const WEEK11_TOPICS = {
  'behavioral-googleyness': {
    id: 'behavioral-googleyness',
    title: 'Behavioral & "Googleyness"',
    week: 11,
    day: 71,
    category: 'Interview Readiness',
    summary:
      'Google explicitly interviews for "Googleyness & Leadership" alongside coding ability. This round is scored just as heavily as a coding round — prepare it just as deliberately.',
    lesson: {
      intro:
        'Behavioral interviews assess how you work with others, handle ambiguity, and grow from setbacks — skills that matter as much as algorithmic ability once you\'re actually on a team. Unlike coding, there\'s no single "correct" answer, but there is a reliable structure for giving a strong one.',
      steps: [
        'Use the STAR method: Situation (brief context), Task (what you specifically needed to do), Action (what *you* did, in detail — this is the bulk of the answer), Result (the outcome, ideally with a concrete detail or number). Keep the whole story to about 2 minutes.',
        'Prepare 5-6 stories in advance covering: a conflict you resolved, a time you showed leadership without formal authority, a failure and what you learned from it, a time you helped a struggling teammate, and a time you drove an ambiguous situation to clarity. Having these ready means you\'re adapting a known story to the question asked, not improvising from scratch.',
        'Google\'s Googleyness & Leadership rubric specifically looks for: comfort with ambiguity, intellectual humility (updating your view when given new information), a collaborative (not ego-driven) approach to problem solving, and doing the right thing even when it\'s not the easy thing.',
        'Prepare 2-3 thoughtful questions to ask your interviewer at the end — about their work, team, or challenges. This round is a two-way conversation, and genuine curiosity about the role reads as strongly as your answers do.',
      ],
      example: {
        setup: 'A STAR-structured answer to "Tell me about a time you disagreed with a teammate."',
        walkthrough: [
          'Situation (10 seconds): "On a project last year, a teammate and I disagreed on whether to use a third-party library or build a component ourselves."',
          'Task (10 seconds): "I needed to make sure we picked the option that wouldn\'t cause problems for the team downstream, without just overruling them."',
          'Action (60-90 seconds, the bulk): "I asked to understand their reasoning first — they were worried about the library\'s maintenance risk. I proposed we time-box a half-day spike: I\'d prototype with the library, they\'d estimate the build-it-ourselves effort, and we\'d compare with real data instead of opinions."',
          'Result (15-20 seconds): "The spike showed the library saved us roughly two weeks, and addressed their maintenance concern by finding it had an active release cadence. We shipped on time, and it became our default way to resolve similar disagreements afterward."',
          'Notice the story shows collaboration and data-driven resolution, not "I was right and they were wrong" — that\'s the Googleyness signal being demonstrated, not just stated.',
        ],
      },
      pitfalls: [
        'Making the "Action" section too short and the "Situation" too long — interviewers want to hear what *you specifically* did, not mostly background context.',
        'Choosing a story where you were purely right and someone else was purely wrong — the strongest stories show growth, collaboration, or a change in your own thinking, not vindication.',
        'Having no questions prepared for the interviewer — arriving with none reads as lower genuine interest in the role, even if unintentional.',
      ],
    },
    keyIdeas: [
      'STAR method: Situation, Task, Action (the bulk), Result — keep each story to ~2 minutes.',
      'Prepare 5-6 stories in advance covering conflict, leadership, failure, mentorship, and ambiguity.',
      'Google looks for comfort with ambiguity, intellectual humility, and collaborative problem-solving.',
      'Prepare 2-3 genuine questions for your interviewer — this round is a two-way conversation.',
    ],
    problems: [],
  },

  'mock-interview-1': {
    id: 'mock-interview-1',
    title: 'Mock Interview 1',
    week: 11,
    day: 72,
    category: 'Interview Readiness',
    summary:
      'A timed, mixed-pattern problem set simulating a real onsite loop. Do these back to back with a short break between, out loud, without notes.',
    keyIdeas: [
      'Simulate real conditions: 35-45 minutes per problem, explain your approach before coding, talk while you code.',
      'Cover a representative spread: one array/string or hashing problem, one tree or graph problem, one DP problem.',
      'After each problem, do a 5-minute self-review: what would a strong interviewer have pushed back on? Where did you hesitate?',
      'If possible, book a live mock this week via Pramp or interviewing.io — real-time pressure and outside feedback catch things self-review can\'t.',
    ],
    problems: [
      { title: 'Group Anagrams', difficulty: 'Medium', url: LC('group-anagrams') },
      { title: 'Course Schedule', difficulty: 'Medium', url: LC('course-schedule') },
      { title: 'Longest Common Subsequence', difficulty: 'Medium', url: LC('longest-common-subsequence') },
      { title: 'Binary Tree Right Side View', difficulty: 'Medium', url: LC('binary-tree-right-side-view') },
    ],
  },

  'mock-interview-2': {
    id: 'mock-interview-2',
    title: 'Mock Interview 2',
    week: 11,
    day: 73,
    category: 'Interview Readiness',
    summary:
      'A second full mock loop with a different problem mix — repetition under realistic conditions is what actually builds interview stamina.',
    keyIdeas: [
      'Same conditions as yesterday: timed, out loud, no notes, self-review after each problem.',
      'This time, deliberately pick problems from topics you felt shakiest on in weeks 8-10 — use the mock to surface gaps while there\'s still time to address them.',
      'Practice explicitly stating time/space complexity out loud at the end of every solution, unprompted — Google interviewers expect this without having to ask.',
      'If you booked a live mock interview this week, do it today or tomorrow — schedule it now if you haven\'t.',
    ],
    problems: [
      { title: 'Top K Frequent Elements', difficulty: 'Medium', url: LC('top-k-frequent-elements') },
      { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', url: LC('pacific-atlantic-water-flow') },
      { title: 'Word Break', difficulty: 'Medium', url: LC('word-break') },
      { title: 'Merge Intervals', difficulty: 'Medium', url: LC('merge-intervals') },
    ],
  },

  'mock-interview-3': {
    id: 'mock-interview-3',
    title: 'Mock Interview 3',
    week: 11,
    day: 74,
    category: 'Interview Readiness',
    summary:
      'A third full mock loop — by now the mechanics (timing, narrating, complexity statements) should feel routine, freeing you to focus purely on problem-solving.',
    keyIdeas: [
      'If the first two mocks felt rushed, focus this one specifically on pacing — spend a deliberate 5 minutes clarifying and planning before writing any code.',
      'Try narrating your brute-force approach and its complexity out loud within the first 2 minutes of reading a new problem, every time — build this into muscle memory.',
      'Mix in a graph or backtracking problem you haven\'t seen — these are common sources of "I know the pattern but freeze on unfamiliar phrasing."',
      'After this mock, look back across all three: is there one topic that keeps costing you time? That\'s tomorrow and the next day\'s focus.',
    ],
    problems: [
      { title: 'Clone Graph', difficulty: 'Medium', url: LC('clone-graph') },
      { title: 'Subsets II', difficulty: 'Medium', url: LC('subsets-ii') },
      { title: 'Coin Change II', difficulty: 'Medium', url: LC('coin-change-ii') },
      { title: 'Kth Smallest Element in a BST', difficulty: 'Medium', url: LC('kth-smallest-element-in-a-bst') },
    ],
  },

  'weak-area-drilling-1': {
    id: 'weak-area-drilling-1',
    title: 'Weak-Area Drilling, Part 1',
    week: 11,
    day: 75,
    category: 'Interview Readiness',
    isReview: true,
    summary:
      'Go back through your notes and this week\'s three mock interviews, and spend today entirely on your single weakest topic.',
    keyIdeas: [
      'Look back at all three mock interviews this week — which problems took longest, or where did you get stuck? Rank your topics by confidence and pick the single lowest-ranked one for today.',
      'Re-solve 4-5 problems from that weakest topic from scratch, untimed, focusing on getting the pattern to genuinely click rather than just finishing.',
      'Re-derive that topic\'s core template from memory, then re-read its lesson page here line by line, checking your derivation against it.',
      'Don\'t spread thin across multiple weak topics today — depth on one beats a shallow pass over three, with tomorrow reserved for the next one.',
    ],
    problems: [],
  },

  'weak-area-drilling-2': {
    id: 'weak-area-drilling-2',
    title: 'Weak-Area Drilling, Part 2',
    week: 11,
    day: 76,
    category: 'Interview Readiness',
    isReview: true,
    summary:
      'Same process as yesterday, applied to your second-weakest topic — plus a first pass at re-deriving every core template from memory.',
    keyIdeas: [
      'Repeat yesterday\'s process on your second-weakest topic: re-solve 4-5 problems untimed, re-derive the template, cross-check against the lesson page.',
      'Time-box 20 minutes to rapid-fire re-derive every core template from memory, one after another, without looking anything up: two pointers, sliding window, DFS/BFS (tree and graph), backtracking, 1-D and 2-D DP, Dijkstra, Union-Find.',
      'Circle anything that didn\'t come out cleanly — that\'s a candidate for one more look during next week\'s final polish, not something to over-invest in today.',
      'If both weak topics now feel solid, use any remaining time for one more timed problem outside your weak areas, just to keep momentum on your strengths too.',
    ],
    problems: [],
  },

  'week11-review': {
    id: 'week11-review',
    title: 'Review & Spaced Practice',
    week: 11,
    day: 77,
    category: 'Review',
    isReview: true,
    summary:
      'A lighter day to consolidate the week — three mock interviews and two focused drilling sessions is real work; let it settle before next week\'s final push.',
    keyIdeas: [
      'Skim the Pattern Cheatsheet end to end once, at a comfortable pace — no timing pressure today.',
      'Re-read your 5-6 behavioral stories once, out loud, from memory — check they still come out smoothly after a week of focus on coding.',
      'Spaced repetition: re-solve one problem each from three different weeks you haven\'t touched recently (e.g., one from week 3, one from week 6, one from week 9).',
      'Rest is part of the plan — three mock interviews plus two drilling days is a heavy week; don\'t add extra problems on top of what\'s listed here.',
    ],
    problems: [],
  },
}
