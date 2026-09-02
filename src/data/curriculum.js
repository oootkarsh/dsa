// Curated 12-week intensive DSA study plan for Google SWE interview prep (~6 hours/day).
// Built for someone learning these concepts from scratch, not just brushing up.
// Each topic includes a from-the-ground-up lesson (with Python code) plus curated LeetCode problem links.

import { WEEK1_META, WEEK1_TOPICS } from './topics/week1'
import { WEEK2_META, WEEK2_TOPICS } from './topics/week2'
import { WEEK3_META, WEEK3_TOPICS } from './topics/week3'
import { WEEK4_META, WEEK4_TOPICS } from './topics/week4'
import { WEEK5_META, WEEK5_TOPICS } from './topics/week5'
import { WEEK6_META, WEEK6_TOPICS } from './topics/week6'
import { WEEK7_META, WEEK7_TOPICS } from './topics/week7'
import { WEEK8_META, WEEK8_TOPICS } from './topics/week8'
import { WEEK9_META, WEEK9_TOPICS } from './topics/week9'
import { WEEK10_META, WEEK10_TOPICS } from './topics/week10'
import { WEEK11_META, WEEK11_TOPICS } from './topics/week11'
import { WEEK12_META, WEEK12_TOPICS } from './topics/week12'

export const PLATFORMS = [
  {
    name: 'LeetCode',
    url: 'https://leetcode.com/problemset/',
    blurb: 'Primary practice platform used throughout this plan — closest to Google\'s actual interview format.',
  },
  {
    name: 'NeetCode 150',
    url: 'https://neetcode.io/practice',
    blurb: 'Free tracker that mirrors this same pattern-based problem set with video explanations.',
  },
  {
    name: 'Pramp',
    url: 'https://www.pramp.com/',
    blurb: 'Free live peer mock interviews — book several in weeks 11-12 to rehearse thinking out loud, including a system design mock.',
  },
  {
    name: 'interviewing.io',
    url: 'https://interviewing.io/',
    blurb: 'Anonymous mock interviews with real engineers, including some from Google.',
  },
  {
    name: 'HackerRank',
    url: 'https://www.hackerrank.com/domains/data-structures',
    blurb: 'Good secondary source for extra reps once a topic\'s core set is done.',
  },
]

export const WEEKS = [
  WEEK1_META,
  WEEK2_META,
  WEEK3_META,
  WEEK4_META,
  WEEK5_META,
  WEEK6_META,
  WEEK7_META,
  WEEK8_META,
  WEEK9_META,
  WEEK10_META,
  WEEK11_META,
  WEEK12_META,
]

export const TOPICS = {
  ...WEEK1_TOPICS,
  ...WEEK2_TOPICS,
  ...WEEK3_TOPICS,
  ...WEEK4_TOPICS,
  ...WEEK5_TOPICS,
  ...WEEK6_TOPICS,
  ...WEEK7_TOPICS,
  ...WEEK8_TOPICS,
  ...WEEK9_TOPICS,
  ...WEEK10_TOPICS,
  ...WEEK11_TOPICS,
  ...WEEK12_TOPICS,
}

export const ALL_TOPICS = Object.values(TOPICS).sort((a, b) => a.day - b.day)

export const TOTAL_PROBLEMS = ALL_TOPICS.reduce((sum, t) => sum + t.problems.length, 0)

export const TOTAL_DAYS = ALL_TOPICS.length

export function getProblemId(topicId, problemTitle) {
  return `${topicId}::${problemTitle}`
}
