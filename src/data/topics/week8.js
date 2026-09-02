import { LC } from '../lc'

export const WEEK8_META = {
  id: 8,
  title: 'String Algorithms & Advanced Structures',
  goal: 'Go beyond the basics with dedicated string-matching algorithms (KMP, Rabin-Karp) and range-query structures (segment trees, Fenwick trees) — lower-frequency than core patterns, but a strong signal when they come up, and genuinely useful CS fundamentals for a 12-week intensive plan.',
  dayIds: [
    'string-matching-basics',
    'kmp',
    'rabin-karp',
    'segment-tree',
    'fenwick-tree',
    'advanced-structures-practice',
    'week8-review',
  ],
}

export const WEEK8_TOPICS = {
  'string-matching-basics': {
    id: 'string-matching-basics',
    title: 'String Matching: The Naive Approach',
    week: 8,
    day: 50,
    category: 'Strings',
    summary:
      'Before learning KMP and Rabin-Karp, understand exactly what they improve on: the naive O(n·m) substring search, and why that\'s sometimes fine and sometimes not.',
    lesson: {
      intro:
        'Substring search asks: does pattern P occur inside text T, and if so, where? The naive approach tries every possible starting position in T and checks whether P matches there character by character. It\'s the right first answer in almost every interview — simple, obviously correct — and the springboard for understanding why smarter algorithms exist.',
      steps: [
        'Naive algorithm: for each starting index i in T (from 0 to len(T) - len(P)), compare P against T[i:i+len(P)] character by character; stop early on a mismatch, record i if all characters match.',
        'Worst case: for every starting position, you compare almost the whole pattern before a mismatch (e.g., T = "aaaa...a", P = "aaa...b") — that\'s O(n·m) time, where n = len(T) and m = len(P).',
        'In Python, the in operator and str.find() are implemented in C and highly optimized (using a variant of a fast substring search) — for interview purposes, if a problem just asks "does this substring exist" with no further constraints, using in/.find() directly is perfectly reasonable unless the question is explicitly about implementing search yourself.',
        'The naive approach\'s weakness is that it throws away information on every mismatch — if P = "abcabd" and you\'ve already matched "abcab" before failing on the last character, you know something about how P overlaps with itself that could avoid re-checking from scratch. That insight is exactly what KMP (tomorrow) formalizes.',
        'For most interview-sized inputs, O(n·m) naive search is completely fine — reach for KMP/Rabin-Karp specifically when the problem is *about* string matching at scale, or explicitly asks for better than O(n·m).',
      ],
      example: {
        setup: 'Naive search for pattern "aab" in text "aaaab".',
        walkthrough: [
          'i=0: compare "aaa..." vs "aab" — T[0]=\'a\'==P[0], T[1]=\'a\'==P[1], T[2]=\'a\' != P[2]=\'b\' — mismatch after 2 characters matched.',
          'i=1: compare T[1:4]="aaa" vs "aab" — same pattern, mismatch after 2 characters.',
          'i=2: compare T[2:5]="aab" vs "aab" — all 3 match! Found at index 2.',
          'Notice how much repeated comparison happened — at i=0 and i=1 we re-verified "aa" from scratch even though the first attempt already told us those characters matched.',
        ],
      },
      code: `def naive_search(text, pattern):
    n, m = len(text), len(pattern)
    positions = []
    for i in range(n - m + 1):
        if text[i:i+m] == pattern:
            positions.append(i)
    return positions

# For "does it exist," Python's built-in is usually the right interview answer:
def contains(text, pattern):
    return pattern in text`,
      pitfalls: [
        'Off-by-one on the loop range — it must stop at n - m (inclusive), i.e., range(n - m + 1), or you\'ll index past the end of text.',
        'Using text[i:i+m] == pattern inside the loop is concise but does its own O(m) slice + compare — fine for clarity, but know that a hand-rolled character-by-character comparison with early exit is what "naive search" formally refers to for complexity analysis.',
        'Defaulting to a from-scratch naive search when Python\'s in/.find() would do — only hand-roll it when the problem is explicitly testing string-matching implementation.',
      ],
    },
    keyIdeas: [
      'Naive search: try every starting position, compare character by character — O(n·m) worst case.',
      'Python\'s in and str.find() are fast, optimized, built-in — use them unless the problem is about implementing search itself.',
      'The naive approach\'s inefficiency: it discards information about partial matches on every mismatch.',
      'O(n·m) is completely fine for most interview inputs — smarter algorithms matter when the problem is specifically about matching at scale.',
    ],
    problems: [
      { title: 'Find the Index of the First Occurrence in a String', difficulty: 'Easy', url: LC('find-the-index-of-the-first-occurrence-in-a-string'), note: 'implement naive search by hand first' },
      { title: 'Repeated Substring Pattern', difficulty: 'Easy', url: LC('repeated-substring-pattern') },
      { title: 'Repeated String Match', difficulty: 'Medium', url: LC('repeated-string-match') },
    ],
  },

  kmp: {
    id: 'kmp',
    title: 'Knuth-Morris-Pratt (KMP) Algorithm',
    week: 8,
    day: 51,
    category: 'Strings',
    summary:
      'A string-matching algorithm that never re-examines a character of the text — O(n + m) by precomputing how the pattern overlaps with itself.',
    lesson: {
      intro:
        'KMP speeds up substring search by precomputing, for the pattern alone, how much of a prefix match can be reused after a mismatch — so the search pointer into the text never moves backward. The precomputed table is usually called the LPS array (Longest Proper Prefix which is also a Suffix), one entry per position in the pattern.',
      steps: [
        'LPS array: lps[i] = the length of the longest proper prefix of pattern[0..i] that is also a proper suffix of pattern[0..i] ("proper" means not the whole substring itself). This captures exactly how much of the pattern\'s start can be "reused" if a mismatch happens after matching up to position i.',
        'Building the LPS array: use two pointers into the pattern itself — length (the current matched prefix length) and i (the position being computed). If pattern[i] == pattern[length], extend: length += 1, lps[i] = length. On a mismatch with length > 0, fall back to length = lps[length - 1] (reuse previously computed overlap) instead of resetting to 0. This construction is itself O(m).',
        'Searching with the LPS array: walk through the text with pointer i and the pattern with pointer j. On a match, advance both. On a mismatch with j > 0, don\'t move i backward — instead set j = lps[j - 1], reusing the overlap information instead of restarting the pattern from position 0. On a mismatch with j == 0, just advance i.',
        'Because i (the text pointer) only ever moves forward, the text is scanned once — O(n) for the search, plus O(m) to build the LPS array, giving O(n + m) total, independent of how self-similar the pattern is (unlike naive search\'s O(n·m) worst case).',
        'This is a lower-frequency interview topic than hashing or trees — Google is more likely to accept "I\'ll use Python\'s built-in search, or explain the KMP idea at a high level" than require a flawless from-scratch implementation. Understanding the LPS idea (not necessarily memorizing exact index arithmetic) is what matters most.',
      ],
      example: {
        setup: 'Building the LPS array for pattern "ABABAC".',
        walkthrough: [
          'lps[0] = 0 always (a single character has no proper prefix).',
          'i=1 (\'B\'): pattern[1]=\'B\' vs pattern[length=0]=\'A\' — mismatch, length stays 0. lps[1] = 0.',
          'i=2 (\'A\'): pattern[2]=\'A\' vs pattern[0]=\'A\' — match, length=1. lps[2] = 1.',
          'i=3 (\'B\'): pattern[3]=\'B\' vs pattern[1]=\'B\' — match, length=2. lps[3] = 2.',
          'i=4 (\'A\'): pattern[4]=\'A\' vs pattern[2]=\'A\' — match, length=3. lps[4] = 3.',
          'i=5 (\'C\'): pattern[5]=\'C\' vs pattern[3]=\'B\' — mismatch. Fall back: length = lps[2] = 1. Try again: pattern[5]=\'C\' vs pattern[1]=\'B\' — still mismatch, length = lps[0] = 0. Try again: pattern[5]=\'C\' vs pattern[0]=\'A\' — mismatch, length stays 0. lps[5] = 0.',
          'Final LPS array: [0, 0, 1, 2, 3, 0] — during search, this tells you exactly how far to fall back the pattern pointer on each possible mismatch position, without ever re-scanning the text.',
        ],
      },
      code: `def build_lps(pattern):
    m = len(pattern)
    lps = [0] * m
    length = 0
    i = 1
    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            i += 1
        elif length > 0:
            length = lps[length - 1]  # fall back, reuse overlap -- don't advance i
        else:
            lps[i] = 0
            i += 1
    return lps

def kmp_search(text, pattern):
    if not pattern:
        return []
    lps = build_lps(pattern)
    positions = []
    i = j = 0  # i -> text, j -> pattern
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1
            j += 1
            if j == len(pattern):
                positions.append(i - j)
                j = lps[j - 1]
        elif j > 0:
            j = lps[j - 1]  # fall back the pattern pointer, i never moves back
        else:
            i += 1
    return positions`,
      pitfalls: [
        'Confusing the LPS array\'s "proper" prefix/suffix with the whole substring — lps[i] can never equal i + 1 (the full length), since a proper prefix/suffix must be strictly shorter.',
        'Moving the text pointer i backward on a mismatch — the entire point of KMP is that i never regresses; only the pattern pointer j falls back.',
        'Forgetting the elif length > 0 branch during LPS construction — without it, you\'d reset to 0 immediately instead of trying a shorter overlap first, which breaks the algorithm\'s correctness.',
      ],
    },
    keyIdeas: [
      'LPS array: for each prefix of the pattern, the length of the longest proper prefix that\'s also a suffix.',
      'On a mismatch, fall back the pattern pointer using the LPS array instead of restarting — the text pointer never moves backward.',
      'O(n + m) total: O(m) to build the LPS array, O(n) to scan the text once.',
      'Lower-frequency topic — understanding the idea matters more than memorizing exact index arithmetic under pressure.',
    ],
    problems: [
      { title: 'Find the Index of the First Occurrence in a String', difficulty: 'Easy', url: LC('find-the-index-of-the-first-occurrence-in-a-string'), note: 'now implement with KMP' },
      { title: 'Shortest Palindrome', difficulty: 'Hard', url: LC('shortest-palindrome'), note: 'LPS array on text + reversed text' },
      { title: 'Repeated Substring Pattern', difficulty: 'Easy', url: LC('repeated-substring-pattern'), note: 'the LPS array of the whole string answers this directly' },
    ],
  },

  'rabin-karp': {
    id: 'rabin-karp',
    title: 'Rabin-Karp & Rolling Hash',
    week: 8,
    day: 52,
    category: 'Strings',
    summary:
      'Hash the pattern once, then slide a window across the text updating its hash in O(1) per step — an average-case O(n + m) alternative to KMP that generalizes well to "multiple patterns" and "duplicate substring" problems.',
    lesson: {
      intro:
        'Rabin-Karp compares hashes instead of raw characters: compute a hash of the pattern once, then compute the hash of every same-length window in the text, comparing hashes instead of strings. The key trick is a rolling hash — updating a window\'s hash in O(1) as the window slides by one character, instead of recomputing it from scratch.',
      steps: [
        'Treat a string as a number in some base B (e.g., 26 or 256 for characters, using ord(ch) as each digit): hash(s) = s[0]*B^(m-1) + s[1]*B^(m-2) + ... + s[m-1], typically taken modulo a large prime to keep numbers manageable.',
        'Rolling update: given the hash of window T[i:i+m], the hash of the next window T[i+1:i+1+m] can be computed in O(1): subtract the outgoing character\'s contribution (T[i] * B^(m-1)), multiply by B (shifting everything left one digit), and add the incoming character (T[i+m]) — no need to re-hash the whole window.',
        'Compare the pattern\'s hash to each window\'s hash: only when hashes match do you do a full character-by-character verification (a "hash collision" — different strings can hash to the same value) — this is why Rabin-Karp is average-case O(n + m) but worst-case O(n·m) if collisions are frequent (rare with a good modulus, but worth mentioning).',
        'Rabin-Karp generalizes better than KMP to two important variants: searching for multiple patterns at once (hash all patterns into a set, then check each window\'s hash against the set), and finding *any* duplicated substring of a given length (hash every window of that length and check for repeats in a set — no separate "pattern" needed).',
        'For interview purposes, Python\'s arbitrary-precision integers mean you often don\'t even need the modulo step for correctness (only to keep the numbers from growing very large) — but including a modulus is still good practice to signal you understand why it\'s there.',
      ],
      example: {
        setup: 'Rolling hash for text "abcd", window size 3, base 256, tracking windows "abc" then "bcd".',
        walkthrough: [
          'hash("abc") = ord(\'a\')*256^2 + ord(\'b\')*256 + ord(\'c\') — computed directly the first time, O(m).',
          'To get hash("bcd") from hash("abc"): subtract ord(\'a\')*256^2 (remove the outgoing \'a\'\'s contribution), multiply the remainder by 256 (shift left), add ord(\'d\') (bring in the new character) — all O(1), no re-scanning "bcd" from scratch.',
          'This is why sliding across the whole text costs O(n) total for all the hash updates, instead of O(n·m) for recomputing each window\'s hash independently.',
        ],
      },
      code: `def rabin_karp_search(text, pattern):
    n, m = len(text), len(pattern)
    if m > n:
        return []
    base, mod = 256, 10**9 + 7

    high_order = pow(base, m - 1, mod)
    pattern_hash = 0
    window_hash = 0
    for i in range(m):
        pattern_hash = (pattern_hash * base + ord(pattern[i])) % mod
        window_hash = (window_hash * base + ord(text[i])) % mod

    positions = []
    for i in range(n - m + 1):
        if pattern_hash == window_hash:
            if text[i:i+m] == pattern:  # verify -- hashes can collide
                positions.append(i)
        if i < n - m:
            window_hash = (window_hash - ord(text[i]) * high_order) % mod
            window_hash = (window_hash * base + ord(text[i + m])) % mod
            window_hash %= mod
    return positions`,
      pitfalls: [
        'Skipping the verification step after a hash match — hash collisions are rare but real; always confirm with a direct string comparison before reporting a match.',
        'Forgetting that Python\'s % can return values differently than expected around subtraction with negative intermediate results — (window_hash - ...) % mod in Python correctly wraps to a non-negative result (unlike some other languages), which is actually a point in Python\'s favor here, but confirm this if translating to another language.',
        'Recomputing each window\'s hash from scratch (an O(m) hash inside an O(n) loop, giving O(n·m)) instead of rolling it in O(1) — this defeats the entire purpose of the technique.',
      ],
    },
    keyIdeas: [
      'Hash the pattern once; slide a rolling hash across the text, updating in O(1) per position.',
      'Only do a full string comparison when hashes match — protects against (rare) hash collisions.',
      'Average-case O(n + m); worst case O(n·m) under heavy collisions (rare with a good modulus).',
      'Generalizes naturally to multi-pattern search and "find any duplicated substring" problems, unlike KMP.',
    ],
    problems: [
      { title: 'Repeated DNA Sequences', difficulty: 'Medium', url: LC('repeated-dna-sequences') },
      { title: 'Longest Duplicate Substring', difficulty: 'Hard', url: LC('longest-duplicate-substring'), note: 'binary search on length + rolling hash' },
      { title: 'Find the Index of the First Occurrence in a String', difficulty: 'Easy', url: LC('find-the-index-of-the-first-occurrence-in-a-string'), note: 'now implement with Rabin-Karp' },
    ],
  },

  'segment-tree': {
    id: 'segment-tree',
    title: 'Segment Trees',
    week: 8,
    day: 53,
    category: 'Advanced Structures',
    summary:
      'A binary tree over an array that answers range queries (sum, min, max) and supports point updates in O(log n) — for when a plain prefix-sum array isn\'t enough because the array changes.',
    lesson: {
      intro:
        'A plain prefix-sum array answers "sum of a range" in O(1), but falls apart the moment the array can change — updating one element means recomputing every prefix sum after it, O(n) per update. A segment tree trades a little query speed (O(log n) instead of O(1)) for fast updates too (O(log n) instead of O(n)) — a much better balance when both queries and updates are frequent.',
      steps: [
        'Structure: each leaf represents one array element; each internal node represents the combined result (sum, min, whatever operation you need) of its two children\'s ranges. The root represents the whole array\'s combined result.',
        'Build: recursively split the array in half, build the left and right subtrees, then combine them at the current node — O(n) total (each level does O(n) combined work, and there are O(log n) levels, but a tighter accounting gives O(n) overall since node count is 2n).',
        'Range query [l, r]: recursively check each node\'s range against [l, r] — if a node\'s range is completely outside, return the identity (0 for sum, +infinity for min); if completely inside, return that node\'s precomputed value directly; if partially overlapping, recurse into both children and combine. O(log n) because at most a constant number of nodes at each level are "partially overlapping."',
        'Point update: update a leaf\'s value, then walk back up to the root recombining each ancestor from its two children — O(log n), the height of the tree.',
        'A common, simpler array-based implementation: store the tree as a flat array of size 4n (a safe upper bound), where a node at index i has children at 2i+1 and 2i+2 — the same index math as a heap (day 20), but here representing ranges rather than a priority ordering.',
      ],
      example: {
        setup: 'A sum segment tree over [1, 3, 5, 7], querying the sum of range [1, 2] (values 3 and 5).',
        walkthrough: [
          'Leaves: represent single elements — [1], [3], [5], [7].',
          'Level above: node covering [0,1] = 1+3 = 4; node covering [2,3] = 5+7 = 12.',
          'Root: covers [0,3] = 4+12 = 16 (the sum of the whole array).',
          'Querying [1,2]: the root\'s range [0,3] partially overlaps [1,2], so recurse into both children. Left child [0,1] partially overlaps [1,2] (only index 1 matters) → recurse further, eventually reading leaf value 3. Right child [2,3] partially overlaps [1,2] (only index 2 matters) → recurse further, reading leaf value 5. Combine: 3 + 5 = 8 — the answer, without touching index 0 or 3 directly at the leaf level for the final sum.',
        ],
      },
      code: `class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        if self.n:
            self._build(arr, 0, 0, self.n - 1)

    def _build(self, arr, node, lo, hi):
        if lo == hi:
            self.tree[node] = arr[lo]
            return
        mid = (lo + hi) // 2
        self._build(arr, 2 * node + 1, lo, mid)
        self._build(arr, 2 * node + 2, mid + 1, hi)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def update(self, idx, val, node=0, lo=0, hi=None):
        if hi is None:
            hi = self.n - 1
        if lo == hi:
            self.tree[node] = val
            return
        mid = (lo + hi) // 2
        if idx <= mid:
            self.update(idx, val, 2 * node + 1, lo, mid)
        else:
            self.update(idx, val, 2 * node + 2, mid + 1, hi)
        self.tree[node] = self.tree[2 * node + 1] + self.tree[2 * node + 2]

    def query(self, l, r, node=0, lo=0, hi=None):
        if hi is None:
            hi = self.n - 1
        if r < lo or hi < l:
            return 0  # identity for sum -- outside range
        if l <= lo and hi <= r:
            return self.tree[node]  # fully inside
        mid = (lo + hi) // 2
        return (self.query(l, r, 2 * node + 1, lo, mid) +
                self.query(l, r, 2 * node + 2, mid + 1, hi))`,
      pitfalls: [
        'Sizing the flat array too small — 4n is the standard safe bound for a segment tree that isn\'t perfectly balanced (n not a power of 2); using exactly 2n can index out of bounds.',
        'Forgetting to recombine ancestors after an update — the update must walk back up (or, in the recursive form, recombine on the way back out of recursion) so every ancestor\'s cached value stays correct.',
        'Reaching for a segment tree when a plain prefix-sum array would do — if the array never changes, prefix sums answer range-sum queries in O(1) with far less code; segment trees earn their complexity specifically when updates are also required.',
      ],
    },
    keyIdeas: [
      'Trades prefix-sum\'s O(1) query for O(log n) query — but gains O(log n) updates instead of O(n).',
      'Each internal node caches the combined result of its children\'s ranges.',
      'Range query and point update are both O(log n); build is O(n).',
      'Only worth the complexity when the array changes (updates) — otherwise a plain prefix-sum array is simpler and faster.',
    ],
    problems: [
      { title: 'Range Sum Query - Immutable', difficulty: 'Easy', url: LC('range-sum-query-immutable'), note: 'warm-up: plain prefix sums, no segment tree needed' },
      { title: 'Range Sum Query - Mutable', difficulty: 'Medium', url: LC('range-sum-query-mutable'), note: 'the segment tree use case' },
      { title: 'Range Sum Query 2D - Immutable', difficulty: 'Medium', url: LC('range-sum-query-2d-immutable') },
    ],
  },

  'fenwick-tree': {
    id: 'fenwick-tree',
    title: 'Fenwick Tree (Binary Indexed Tree)',
    week: 8,
    day: 54,
    category: 'Advanced Structures',
    summary:
      'A more compact alternative to a segment tree, specialized for prefix-sum-style queries — same O(log n) update/query, a fraction of the code.',
    lesson: {
      intro:
        'A Fenwick tree (Binary Indexed Tree, or BIT) answers the same kind of question a segment tree does — range sums with point updates — but only for sum-like (invertible) operations, using a clever indexing trick instead of an explicit tree structure. The code is shorter and the constant factor is smaller, which is why it\'s often preferred specifically for prefix-sum problems.',
      steps: [
        'Core trick: each index i in the underlying array (1-indexed) is responsible for a range of elements whose size is determined by i\'s lowest set bit — i & (-i) (the two\'s-complement trick from bit manipulation, week 6) isolates that lowest set bit directly.',
        'Update (add a value at position i): repeatedly add to tree[i], then jump to the next index responsible for a range containing i via i += i & (-i), until you walk off the end of the array. O(log n) steps.',
        'Prefix-sum query (sum of elements 1..i): repeatedly add tree[i], then jump backward via i -= i & (-i), until i reaches 0. O(log n) steps.',
        'Range sum query [l, r]: compute prefix_sum(r) - prefix_sum(l - 1) — the same "subtract the part you don\'t want" trick as a 1-D prefix sum array, just with each prefix_sum call now O(log n) instead of O(1), but supporting O(log n) updates in exchange.',
        'Fenwick trees are the standard tool behind "count of smaller elements after this one" and "count inversions" problems — you insert elements (via update) as you scan, and query how many smaller/larger elements have been inserted so far.',
      ],
      example: {
        setup: 'Building intuition for i & (-i): for i = 12 (binary 1100), what range is index 12 responsible for?',
        walkthrough: [
          '12 in binary is 1100. Its lowest set bit is the third bit from the right (value 4), so 12 & (-12) = 4.',
          'This means tree[12] is responsible for summarizing a range of 4 elements: positions 9 through 12.',
          'For i = 8 (binary 1000), the lowest set bit is 8 itself, so tree[8] summarizes 8 elements: positions 1 through 8 — larger powers of 2 summarize larger ranges, which is what makes both update and query walk in O(log n) jumps instead of a linear scan.',
        ],
      },
      code: `class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.tree = [0] * (n + 1)  # 1-indexed

    def update(self, i, delta):
        while i <= self.n:
            self.tree[i] += delta
            i += i & (-i)

    def prefix_sum(self, i):
        total = 0
        while i > 0:
            total += self.tree[i]
            i -= i & (-i)
        return total

    def range_sum(self, l, r):
        return self.prefix_sum(r) - self.prefix_sum(l - 1)`,
      pitfalls: [
        'Using 0-indexing — Fenwick trees rely on 1-indexing for the i & (-i) trick to work correctly; index 0 has no set bits, which breaks the jump logic.',
        'Confusing update(i, delta) (add delta to position i) with a plain assignment — to *set* position i to a new value, first query the current value there (e.g., via range_sum(i, i)) and update with the difference.',
        'Reaching for a full segment tree when only prefix-sum-style range queries are needed — a Fenwick tree does the same job in about a third of the code, though it can\'t easily support non-invertible operations like range minimum (segment trees handle those; Fenwick trees are specialized for sums and similar).',
      ],
    },
    keyIdeas: [
      'Specialized for sum-like (invertible) range queries with point updates — shorter code than a segment tree.',
      'i & (-i) isolates the lowest set bit, determining which range each index is responsible for.',
      'Update and prefix-sum query are both O(log n), via jumps of i += i & (-i) or i -= i & (-i).',
      'The standard tool behind "count smaller elements after this one" / "count inversions" problems.',
    ],
    problems: [
      { title: 'Range Sum Query - Mutable', difficulty: 'Medium', url: LC('range-sum-query-mutable'), note: 'revisit — implement with a Fenwick tree instead' },
      { title: 'Count of Smaller Numbers After Self', difficulty: 'Hard', url: LC('count-of-smaller-numbers-after-self') },
      { title: 'Reverse Pairs', difficulty: 'Hard', url: LC('reverse-pairs') },
    ],
  },

  'advanced-structures-practice': {
    id: 'advanced-structures-practice',
    title: 'String & Structure Practice',
    week: 8,
    day: 55,
    category: 'Strings',
    summary:
      'Mixed practice pulling together this week\'s tools — tries (week 3), KMP/Rabin-Karp, and Fenwick/segment trees — on harder combined problems.',
    lesson: {
      intro:
        'Today has no new fundamentals — it\'s about recognizing which of this week\'s (and week 3\'s) tools a harder problem actually needs, since real interview problems rarely announce "use a Fenwick tree" outright.',
      steps: [
        'Signal for KMP/Rabin-Karp: "find all occurrences," "does this pattern repeat," "shortest string containing this as a prefix/suffix" — anything centered on matching one string against another efficiently.',
        'Signal for segment/Fenwick trees: "range query" (sum/min/max over a subarray) combined with "the array changes" (point updates) — if the array is static, you don\'t need either; a prefix-sum array or sparse table suffices.',
        'Signal for tries: repeated prefix queries across many words, especially combined with backtracking over a grid (Word Search II, week 3) — the trie lets you prune impossible search branches instantly.',
        'When a problem seems to need "count elements smaller than X seen so far, while scanning left to right" — that\'s the Fenwick-tree-as-a-counter pattern (Count of Smaller Numbers After Self): map values to compressed ranks first (coordinate compression), then use rank as the Fenwick tree\'s index.',
      ],
      pitfalls: [
        'Reaching immediately for the most powerful structure (segment tree) when a simpler one (prefix sums, a plain hash map) solves the problem just as well — always check if the array is static or the query pattern is simpler than "arbitrary range, arbitrary updates" first.',
        'Forgetting coordinate compression when using a Fenwick tree for "count smaller/larger" problems on values with a huge range — the Fenwick tree\'s size is bounded by the value range unless you first compress values down to their sorted rank (0 to n-1).',
        'Underestimating how much setup (LPS array, Fenwick tree class) these problems need before the "real" logic starts — budget time accordingly in a timed practice session.',
      ],
    },
    keyIdeas: [
      'Match the tool to the signal: KMP/Rabin-Karp for pattern matching, segment/Fenwick trees for range query + update, tries for repeated prefix queries.',
      '"Count smaller elements seen so far while scanning" = Fenwick tree + coordinate compression.',
      'Always check whether a simpler structure (prefix sums, hash map) already solves the problem before reaching for the heavier tool.',
      'These problems often have more setup code than "logic" — that\'s normal, budget time for it.',
    ],
    problems: [
      { title: 'Shortest Palindrome', difficulty: 'Hard', url: LC('shortest-palindrome') },
      { title: 'Longest Duplicate Substring', difficulty: 'Hard', url: LC('longest-duplicate-substring') },
      { title: 'Count of Smaller Numbers After Self', difficulty: 'Hard', url: LC('count-of-smaller-numbers-after-self'), note: 'revisit with coordinate compression + Fenwick tree' },
      { title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', url: LC('design-add-and-search-words-data-structure'), note: 'revisit — trie refresher' },
    ],
  },

  'week8-review': {
    id: 'week8-review',
    title: 'Review & Spaced Practice',
    week: 8,
    day: 56,
    category: 'Review',
    isReview: true,
    summary:
      'Consolidate this week\'s lower-frequency-but-valuable tools, and make sure the core patterns from weeks 1-7 are still sharp.',
    keyIdeas: [
      'Re-derive the KMP LPS array construction from a blank file — it\'s the piece most likely to be forgotten since it\'s used less often than core patterns.',
      'Re-implement a Fenwick tree\'s update/prefix_sum from memory — notice how short it is once i & (-i) clicks.',
      'These are lower-frequency topics for a typical Google loop — don\'t over-invest relative to weeks 1-7\'s core patterns if time is tight in future review.',
      'Spaced repetition: re-solve one DP problem from week 6-7 and one graph problem from week 4-5 — the core patterns are what matter most on interview day.',
    ],
    problems: [],
  },
}
