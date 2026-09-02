import { LC } from '../lc'

export const WEEK6_META = {
  id: 6,
  title: 'Bit Manipulation, Math & DP Introduction',
  goal: 'Pick up two smaller standalone toolkits, then build dynamic programming from first principles — memoization, tabulation, and the 1-D DP shape.',
  dayIds: ['bit-manipulation', 'math-geometry', 'dp-intro', 'dp-1d-1', 'dp-1d-2', 'dp-1d-practice', 'week6-review'],
}

export const WEEK6_TOPICS = {
  'bit-manipulation': {
    id: 'bit-manipulation',
    title: 'Bit Manipulation',
    week: 6,
    day: 36,
    category: 'Patterns',
    summary:
      'A small, well-defined toolkit of bit tricks that occasionally turns an O(n) or O(n log n) problem into O(1) or O(n) with O(1) space.',
    lesson: {
      intro:
        'Every integer is stored as a sequence of bits (1s and 0s). Bitwise operators let you manipulate those bits directly — much faster than arithmetic for certain tasks, and the basis of a handful of classic tricks that show up repeatedly once you know to look for them.',
      steps: [
        'AND (&): 1 only where both bits are 1 — used to check/clear specific bits. OR (|): 1 where either bit is 1 — used to set bits. XOR (^): 1 where the bits differ — used to toggle bits, and famously, a ^ a = 0 for any a, and a ^ 0 = a.',
        'Left shift (x << 1) multiplies by 2; right shift (x >> 1) divides by 2 (rounding toward negative infinity) — useful for bit-by-bit construction or fast multiply/divide by powers of two.',
        'XOR cancels duplicates: XOR-ing every number in a list together, where every number appears twice except one, leaves only the unpaired number — pairs cancel to 0, and 0 ^ x = x for the survivor.',
        'n & (n - 1) clears the lowest set bit of n — repeatedly applying it and counting how many times until n becomes 0 counts the number of 1 bits (Hamming weight); it\'s also a quick way to check if n is a power of two (n & (n-1) == 0 for positive n).',
        'Python integers have arbitrary precision and no fixed width — unlike most languages, there\'s no 32-bit wraparound by default. This is convenient, but it means problems that explicitly rely on 32-bit two\'s-complement behavior (Reverse Bits, Sum of Two Integers "without +/-") need you to mask explicitly with & 0xFFFFFFFF to simulate a 32-bit unsigned value, and to manually convert back to a signed result if the top bit is set.',
        "This is a lower-frequency topic in Google interviews than hashing or trees, but it's cheap to master — a handful of tricks cover the vast majority of bit-manipulation questions you'll see.",
      ],
      example: {
        setup: 'Finding the single number that appears once in [4, 1, 2, 1, 2] (everything else appears exactly twice).',
        walkthrough: [
          'result = 0. XOR with 4: result = 0^4 = 4.',
          'XOR with 1: result = 4^1 = 5.',
          'XOR with 2: result = 5^2 = 7.',
          'XOR with 1 again: result = 7^1 = 6 (the two 1s have now cancelled out across these steps, in combination with later terms).',
          'XOR with 2 again: result = 6^2 = 4. All pairs have cancelled (1^1=0, 2^2=0), leaving only 4 — the single number — in O(n) time, O(1) space, no hash set required.',
        ],
      },
      code: `from functools import reduce

def single_number(nums):
    return reduce(lambda acc, x: acc ^ x, nums, 0)

def count_bits(n):
    count = 0
    while n > 0:
        n = n & (n - 1)  # clears the lowest set bit
        count += 1
    return count

def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

# 32-bit masking example: needed because Python ints don't wrap on their own
def get_sum(a, b):
    mask = 0xFFFFFFFF
    while b & mask:
        a, b = a ^ b, (a & b) << 1
    a &= mask
    # convert back to a signed 32-bit result if the top bit is set
    return a if a <= 0x7FFFFFFF else ~(a ^ mask)`,
      pitfalls: [
        'Forgetting that Python has no native 32-bit integer overflow — problems framed around it (Reverse Bits, bitwise-only addition) need explicit & 0xFFFFFFFF masking and manual signed-conversion, shown above.',
        'Right-shifting a negative Python int with >> behaves like floor division (rounds toward negative infinity, and never introduces sign-extension bits the way a fixed-width language would) — know this differs from some other languages\' shift semantics if a problem depends on it.',
        'Reaching for a hash set (O(n) space) out of habit when XOR solves the same "find the unique element" problem in O(1) space — recognizing the XOR-cancellation shape is the whole skill here.',
      ],
    },
    keyIdeas: [
      'XOR cancels duplicates (a^a=0) — the classic "find the single/missing number" trick.',
      'n & (n-1) clears the lowest set bit — used for counting bits and checking powers of two.',
      'Left/right shifts are fast multiply/divide by 2 — useful for bit-by-bit construction.',
      'Lower frequency than most topics in this plan, but cheap to master fully.',
    ],
    problems: [
      { title: 'Single Number', difficulty: 'Easy', url: LC('single-number') },
      { title: 'Number of 1 Bits', difficulty: 'Easy', url: LC('number-of-1-bits') },
      { title: 'Counting Bits', difficulty: 'Easy', url: LC('counting-bits') },
      { title: 'Missing Number', difficulty: 'Easy', url: LC('missing-number') },
      { title: 'Reverse Bits', difficulty: 'Easy', url: LC('reverse-bits') },
      { title: 'Sum of Two Integers', difficulty: 'Medium', url: LC('sum-of-two-integers') },
    ],
  },

  'math-geometry': {
    id: 'math-geometry',
    title: 'Math & Geometry',
    week: 6,
    day: 37,
    category: 'Patterns',
    summary:
      'A grab bag of matrix manipulation and number-theory problems that reward careful implementation over clever algorithmic insight.',
    lesson: {
      intro:
        'This category doesn\'t share one unifying trick the way sliding window or two pointers do — it\'s a collection of matrix/simulation and basic-math problems that show up often enough to deserve a dedicated pass. The common thread is that success usually comes from careful, methodical implementation rather than a flash of insight.',
      steps: [
        'Matrix rotation/transpose: work out the index mapping on paper first — e.g., rotating a matrix 90° clockwise sends matrix[r][c] to newMatrix[c][rows-1-r]. A common in-place trick: transpose the matrix (swap matrix[r][c] with matrix[c][r]), then reverse each row.',
        'Simulation problems (spiral traversal, Game of Life): explicitly track boundaries (top/bottom/left/right, shrinking as you go) or explicitly enumerate the small set of steps a problem describes — resist the urge to find a clever shortcut before you have a working brute-force simulation.',
        'Modular arithmetic (%): used to avoid integer overflow when a problem asks for "the answer modulo 10^9+7," and to wrap indices around a fixed range (e.g., circular buffers).',
        'For these problems specifically, draw a small example by hand before coding — a 3×3 or 4×4 grid is usually enough to see the index pattern clearly.',
      ],
      example: {
        setup: 'Rotating [[1,2],[3,4]] 90° clockwise via transpose + reverse-each-row.',
        walkthrough: [
          'Transpose (swap across the diagonal, matrix[r][c] ↔ matrix[c][r]): [[1,2],[3,4]] → [[1,3],[2,4]].',
          'Reverse each row: [1,3] → [3,1], [2,4] → [4,2]. Result: [[3,1],[4,2]].',
          'Check against a direct rotation: original top-left (1) should end up top-right after a 90° clockwise turn — in the result, 1 is at position [0][1] — correct.',
        ],
      },
      code: `def rotate(matrix):
    n = len(matrix)
    # transpose in place
    for r in range(n):
        for c in range(r + 1, n):
            matrix[r][c], matrix[c][r] = matrix[c][r], matrix[r][c]
    # reverse each row
    for row in matrix:
        row.reverse()`,
      pitfalls: [
        'Off-by-one errors on shrinking boundaries in spiral-style simulations — trace a small (3×3) example by hand before trusting the loop bounds.',
        'Forgetting the modulo operation partway through a calculation (only applying it at the end) — in problems that require it, intermediate overflow can already corrupt the result before you get there.',
        'Over-engineering a clever formula before you have a working brute-force simulation — for this category especially, get a correct slow version first, then optimize only if needed.',
      ],
    },
    keyIdeas: [
      'No single unifying trick — success comes from careful, methodical implementation.',
      'Work out index mappings (rotation, transpose) on paper before coding.',
      'Simulation problems: track explicit boundaries or steps; don\'t look for a shortcut before you have a working brute force.',
      'Use modulo (%) throughout a calculation, not just at the end, when overflow avoidance matters.',
    ],
    problems: [
      { title: 'Rotate Image', difficulty: 'Medium', url: LC('rotate-image') },
      { title: 'Spiral Matrix', difficulty: 'Medium', url: LC('spiral-matrix') },
      { title: 'Set Matrix Zeroes', difficulty: 'Medium', url: LC('set-matrix-zeroes') },
      { title: 'Happy Number', difficulty: 'Easy', url: LC('happy-number') },
      { title: 'Plus One', difficulty: 'Easy', url: LC('plus-one') },
    ],
  },

  'dp-intro': {
    id: 'dp-intro',
    title: 'Dynamic Programming: Introduction',
    week: 6,
    day: 38,
    category: 'Dynamic Programming',
    summary:
      'The most feared interview topic, demystified: DP is just recursion (week 2) plus remembering answers you\'ve already computed.',
    lesson: {
      intro:
        'Dynamic programming solves a problem by breaking it into overlapping subproblems — smaller instances of the same problem that get computed *more than once* if you solve them naively. DP\'s entire trick is: compute each distinct subproblem once, store its answer, and reuse it instead of recomputing — turning exponential naive recursion into polynomial time.',
      steps: [
        'Start every DP problem by writing the brute-force recursive solution first (week 2\'s skills) — get it correct before optimizing anything.',
        'Identify overlapping subproblems: if your recursion tree calls the same (arguments) combination more than once, you have overlap, and memoization will help. (If every call has unique arguments, there\'s no overlap, and DP won\'t speed anything up — plain recursion or a different technique is the answer.)',
        'Memoization (top-down): keep a cache (dict) keyed by function arguments. Before computing, check the cache; after computing, store the result before returning. This is "recursion, but skip work you\'ve already done." Python\'s functools.lru_cache(maxsize=None) decorator does this automatically for any pure function — just add @lru_cache(maxsize=None) above the function definition and every call is memoized by its arguments for you.',
        'Tabulation (bottom-up): instead of recursing top-down with a cache, build an array iteratively from the base cases upward, computing dp[i] from dp[i-1], dp[i-2], etc., in order — mechanically equivalent to memoization but avoids recursion/call-stack overhead, and is usually what "optimize the space" follow-up questions are looking for.',
        'Define the state precisely in words before writing code: "dp[i] = the answer to the problem considering only the first i elements" (or whatever the problem\'s natural sub-unit is) — this sentence is the single most important thing to get right; the recurrence and code follow naturally once the state definition is correct.',
      ],
      example: {
        setup: 'Fibonacci — the canonical first DP example — comparing naive recursion to memoized DP.',
        walkthrough: [
          'Naive fib(5) calls fib(4) and fib(3). fib(4) calls fib(3) and fib(2) — notice fib(3) is now being computed twice, independently, from scratch.',
          'Zoom out further: fib(2) ends up computed 3 times, fib(1) 5 times, across the full call tree for fib(5) — this redundant recomputation is exactly what makes naive fib O(2ⁿ).',
          'With memoization: the first time fib(3) is computed, cache its result. The second time it\'s requested (from fib(4)\'s call tree), return the cached value instantly instead of recomputing its own subtree.',
          'Now every distinct argument (0 through n) is computed exactly once → O(n) time, O(n) space (for the cache and the call stack) — an exponential-to-linear speedup from one idea: don\'t redo work.',
        ],
      },
      code: `# Top-down (memoization) -- hand-rolled cache
def fib_memo(n, cache=None):
    if cache is None:
        cache = {}
    if n <= 1:
        return n
    if n in cache:
        return cache[n]
    result = fib_memo(n - 1, cache) + fib_memo(n - 2, cache)
    cache[n] = result
    return result

# Top-down (memoization) -- Python's built-in decorator does the caching for you
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_memo_builtin(n):
    if n <= 1:
        return n
    return fib_memo_builtin(n - 1) + fib_memo_builtin(n - 2)

# Bottom-up (tabulation)
def fib_tab(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i - 1] + dp[i - 2]
    return dp[n]`,
      pitfalls: [
        'Writing a recursive solution and calling it "DP" without adding a cache — memoization is what makes it DP; plain uncached recursion on an overlapping-subproblem tree is still exponential.',
        'Choosing the wrong state definition — if dp[i] doesn\'t capture everything needed to compute dp[i+1] from it, the recurrence won\'t work no matter how carefully you code it. Nail the state definition in words first.',
        'Forgetting base cases in the cache/table — every recursive/iterative recurrence needs its starting values defined explicitly, just like plain recursion needed a base case.',
        '@lru_cache remembers results *across calls to the outer function too*, for the life of the program — fine for a single LeetCode submission, but be aware of it as a source of stale results if you reuse a decorated function across independent test cases with, e.g., mutable default arguments involved elsewhere.',
      ],
    },
    keyIdeas: [
      'DP = recursion + memoization (or its bottom-up array equivalent) — nothing more mystical than that.',
      'Overlapping subproblems (the same arguments computed repeatedly) is the signal DP applies.',
      'Define the state in words first: "dp[i] = ..." — get this right before writing any code.',
      'Top-down (memoize a recursive function) and bottom-up (fill a table iteratively) compute the same answers; bottom-up avoids call-stack overhead.',
    ],
    problems: [
      { title: 'Fibonacci Number', difficulty: 'Easy', url: LC('fibonacci-number'), note: 'implement both memoized and tabulated versions' },
      { title: 'Climbing Stairs', difficulty: 'Easy', url: LC('climbing-stairs') },
      { title: 'N-th Tribonacci Number', difficulty: 'Easy', url: LC('n-th-tribonacci-number') },
    ],
  },

  'dp-1d-1': {
    id: 'dp-1d-1',
    title: '1-D Dynamic Programming, Part 1',
    week: 6,
    day: 39,
    category: 'Dynamic Programming',
    summary:
      'Applying yesterday\'s framework to classic 1-D problems: state defined by a single index, decisions like "take it or skip it."',
    lesson: {
      intro:
        'A 1-D DP problem has state defined by a single index into the input — dp[i] means "the answer considering the first i elements" (or "ending at index i," depending on the problem). Today\'s problems share a recurring shape: at each position, decide between a small number of choices (e.g., "rob this house or don\'t"), and dp[i] is built from one or two previous dp values.',
      steps: [
        'House Robber shape: at each position, you either take the current element (and must skip the previous one, since adjacent items conflict) or skip it (keeping whatever was best up to the previous position). dp[i] = max(dp[i-1], dp[i-2] + value[i]) — "don\'t take i" vs. "take i, plus the best from two positions back."',
        'Because dp[i] here only depends on dp[i-1] and dp[i-2], you don\'t need a full array — two rolling variables suffice, dropping space from O(n) to O(1). This space optimization is a very common DP follow-up question once your O(n)-space solution works.',
        'Always establish base cases explicitly: dp[0] and dp[1] (or whatever the smallest valid indices are) usually can\'t be derived from the general recurrence and must be set directly.',
        'When a problem has a circular/wraparound constraint (like House Robber II, where the first and last houses are adjacent), a common trick is to run the linear version twice — once excluding the first element, once excluding the last — and take the better result.',
      ],
      example: {
        setup: 'House Robber on [2, 7, 9, 3, 1] — maximize sum of non-adjacent elements.',
        walkthrough: [
          'dp[0] = 2 (only option). dp[1] = max(2, 7) = 7 (either rob house 0, or house 1, can\'t do both since adjacent).',
          'dp[2] = max(dp[1], dp[0] + 9) = max(7, 2+9) = 11 (skip house 2 and keep 7, or take house 2 plus the best from before house 1).',
          'dp[3] = max(dp[2], dp[1] + 3) = max(11, 7+3) = 11.',
          'dp[4] = max(dp[3], dp[2] + 1) = max(11, 11+1) = 12. Final answer: 12 (rob houses 0, 2, 4: 2+9+1=12).',
        ],
      },
      code: `def rob(nums):
    prev2, prev1 = 0, 0  # dp[i-2], dp[i-1], rolling
    for val in nums:
        current = max(prev1, prev2 + val)
        prev2 = prev1
        prev1 = current
    return prev1`,
      pitfalls: [
        'Forgetting that dp[i] can depend on dp[i-2], not just dp[i-1] — always double check exactly how far back the recurrence needs to look before assuming two rolling variables are enough.',
        'Not handling small inputs (empty array, single element) as explicit edge cases before the main loop.',
        'For circular variants: forgetting that "run it twice, excluding first vs. excluding last" only works because the *linear* recurrence is already correct — get the straight-line version right first.',
      ],
    },
    keyIdeas: [
      'dp[i] = answer considering the first i elements — write this sentence out before coding.',
      '"Take it or skip it" recurrences: dp[i] = max(dp[i-1], dp[i-2] + value[i]) is a common shape.',
      'If dp[i] only depends on the last 1-2 values, drop the array for O(1) space with rolling variables.',
      'Circular constraints: often solved by running the linear version twice with different exclusions.',
    ],
    problems: [
      { title: 'Climbing Stairs', difficulty: 'Easy', url: LC('climbing-stairs'), note: 'revisit as dp[i]=dp[i-1]+dp[i-2]' },
      { title: 'Min Cost Climbing Stairs', difficulty: 'Easy', url: LC('min-cost-climbing-stairs') },
      { title: 'House Robber', difficulty: 'Medium', url: LC('house-robber') },
      { title: 'House Robber II', difficulty: 'Medium', url: LC('house-robber-ii') },
      { title: 'Maximum Product Subarray', difficulty: 'Medium', url: LC('maximum-product-subarray') },
      { title: 'Partition Equal Subset Sum', difficulty: 'Medium', url: LC('partition-equal-subset-sum') },
    ],
  },

  'dp-1d-2': {
    id: 'dp-1d-2',
    title: '1-D Dynamic Programming, Part 2: Strings',
    week: 6,
    day: 40,
    category: 'Dynamic Programming',
    summary:
      '1-D DP over strings: word breaking, palindromic substrings, and decoding — same state-per-index shape, applied to text.',
    lesson: {
      intro:
        'String-based 1-D DP uses the same core idea as yesterday — dp[i] describes an answer up to position i — but the recurrence usually involves checking a substring, not just a single element, which changes what "looking back" means.',
      steps: [
        'Word Break shape: dp[i] = "can the first i characters be segmented into dictionary words?" To compute dp[i], try every earlier split point j < i: if dp[j] is True AND s[j:i] is a valid word, then dp[i] is True. This is technically O(n²) (or O(n³) with substring-checking cost) — a reminder that not all DP is O(n).',
        'Longest Palindromic Substring / Palindromic Substrings: define dp[i][j] = "is the substring from i to j a palindrome?" A substring is a palindrome if its outer characters match AND the substring inside them is also a palindrome (or is short enough not to need checking) — dp[i][j] = (s[i]==s[j]) and dp[i+1][j-1]. This is technically 2-D state even though the input is a string, foreshadowing next week.',
        'Decode Ways: dp[i] = "number of ways to decode the first i characters." At each position, you can decode a single digit (if valid, 1-9) contributing dp[i-1] ways, or the last two digits together (if they form a valid 10-26 code) contributing dp[i-2] ways — dp[i] = dp[i-1] + dp[i-2], but only when those interpretations are actually valid, unlike plain Fibonacci.',
        'For string DP, always work out the base case for the empty string / empty prefix explicitly (usually dp[0] = true or 1) — it\'s easy to get wrong and it anchors the whole recurrence.',
      ],
      example: {
        setup: 'Word Break: can "leetcode" be segmented using dictionary ["leet", "code"]?',
        walkthrough: [
          'dp[0] = True (empty prefix trivially "breaks").',
          'Check dp[1..3]: no valid split makes these True (no dictionary word matches "l", "le", "lee").',
          'dp[4]: check j=0, s[0:4]="leet" — a dictionary word, and dp[0]=True → dp[4] = True.',
          'dp[5..7]: no valid j makes these True.',
          'dp[8] (full string): check j=4, s[4:8]="code" — a dictionary word, and dp[4]=True → dp[8] = True. "leetcode" can be segmented as "leet"+"code".',
        ],
      },
      code: `def word_break(s, word_dict):
    words = set(word_dict)
    dp = [False] * (len(s) + 1)
    dp[0] = True  # empty prefix

    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in words:
                dp[i] = True
                break
    return dp[len(s)]`,
      pitfalls: [
        'Assuming all 1-D DP is O(n) — Word Break\'s "try every split point" makes it O(n²) or worse; the dimension of the *state* (dp[i]) doesn\'t determine the time complexity by itself, the recurrence\'s cost per state does.',
        'Off-by-one errors between "index into the string" and "length of prefix" — dp[i] meaning "first i characters" is offset by one from s[i] (the i-th character) — keep this distinction explicit.',
        'For palindrome DP, computing dp[i][j] before its dependency dp[i+1][j-1] is ready — this requires filling the table in a specific order (e.g., by increasing substring length), not simple row-by-row.',
      ],
    },
    keyIdeas: [
      'String DP\'s dp[i] usually means "considering the first i characters" — a substring, not a single element.',
      'Word Break: dp[i] = True if some earlier dp[j] is True and s[j:i] is valid — O(n²), not O(n).',
      'Palindrome checks are naturally 2-D (dp[i][j] over a range) — a preview of next week.',
      'Decode Ways: dp[i] = dp[i-1] + dp[i-2], but only counting valid digit/two-digit interpretations.',
    ],
    problems: [
      { title: 'Word Break', difficulty: 'Medium', url: LC('word-break') },
      { title: 'Decode Ways', difficulty: 'Medium', url: LC('decode-ways') },
      { title: 'Longest Palindromic Substring', difficulty: 'Medium', url: LC('longest-palindromic-substring') },
      { title: 'Palindromic Substrings', difficulty: 'Medium', url: LC('palindromic-substrings') },
    ],
  },

  'dp-1d-practice': {
    id: 'dp-1d-practice',
    title: '1-D DP: Leveling Up',
    week: 6,
    day: 41,
    category: 'Dynamic Programming',
    summary:
      'Harder 1-D DP: coin change (unbounded choices) and longest increasing subsequence (O(n²) → O(n log n)).',
    lesson: {
      intro:
        'Today\'s two problems extend the 1-D shape in two new directions: Coin Change allows *reusing* the same choice unlimited times (unlike House Robber\'s one-time take-or-skip), and Longest Increasing Subsequence needs a comparison against *every* earlier state, not just the last one or two — plus a clever trick to speed that up.',
      steps: [
        'Coin Change (unbounded knapsack shape): dp[amount] = minimum coins to make that amount. For each amount from 1 upward, try every coin: dp[amount] = min(dp[amount], dp[amount - coin] + 1) for each coin ≤ amount. Because you can reuse a coin, this loops coins on the *inside* of the amount loop, referencing a smaller amount\'s already-computed answer — not a fixed lookback like dp[i-1].',
        'Longest Increasing Subsequence (LIS), O(n²) version: dp[i] = length of the longest increasing subsequence *ending at* index i. To compute dp[i], check every earlier index j < i where arr[j] < arr[i], and take dp[i] = max(dp[j] + 1) over those — O(n²) because for each i you scan all earlier j.',
        'LIS, O(n log n) version: maintain an array tails, where tails[k] = the smallest possible tail value of an increasing subsequence of length k+1. For each new number, binary search (day 8!) for where it belongs in tails, and either extend tails or replace an entry — the length of tails at the end is the LIS length. This doesn\'t reconstruct the actual subsequence directly, but gives the length in O(n log n).',
        'Recognizing when an O(n²) DP can be sped up (often via binary search, a heap, or a smarter state) is a strong signal in interviews — mention the O(n²) approach first, get it correct, then discuss the optimization if time allows.',
      ],
      example: {
        setup: 'Coin Change with coins [1, 3, 4], target amount 6.',
        walkthrough: [
          'dp[0] = 0 (zero coins needed for amount 0).',
          'dp[1]: try coin 1 → dp[0]+1=1. dp[1] = 1.',
          'dp[2]: try coin 1 → dp[1]+1=2. dp[2] = 2.',
          'dp[3]: try coin 1 → dp[2]+1=3; try coin 3 → dp[0]+1=1. Best: dp[3] = 1.',
          'dp[4]: try coin 1→dp[3]+1=2; coin 3→dp[1]+1=2; coin 4→dp[0]+1=1. Best: dp[4] = 1.',
          'dp[5]: coin1→dp[4]+1=2; coin3→dp[2]+1=3; coin4→dp[1]+1=2. Best: dp[5]=2.',
          'dp[6]: coin1→dp[5]+1=3; coin3→dp[3]+1=2; coin4→dp[2]+1=3. Best: dp[6]=2 (e.g., 3+3).',
        ],
      },
      code: `def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for coin in coins:
            if coin <= a:
                dp[a] = min(dp[a], dp[a - coin] + 1)
    return dp[amount] if dp[amount] != float('inf') else -1`,
      pitfalls: [
        'Looping amount on the inside and coins on the outside for problems that care about *combinations vs. permutations* (Coin Change II counts combinations, not orderings) — the loop order actually changes what\'s being counted, not just performance.',
        'Forgetting to initialize dp[0] = 0 (and the rest to float(\'inf\')) before the Coin Change loop — without a valid base case, every other value stays wrong.',
        'Assuming O(n²) LIS is "wrong" or unacceptable to present first — for many interviews, presenting the correct O(n²) version, explaining it clearly, and then mentioning the O(n log n) binary-search optimization is a completely acceptable, strong answer.',
      ],
    },
    keyIdeas: [
      'Unbounded choice problems (reuse allowed) loop the "item" inside the "target" loop, referencing smaller already-computed targets.',
      'LIS: dp[i] = longest increasing subsequence ending at i — O(n²) baseline, checking all earlier j.',
      'LIS can be sped up to O(n log n) with a tails array + binary search.',
      'Presenting a correct O(n²) solution first, then discussing the optimization, is a strong interview strategy.',
    ],
    problems: [
      { title: 'Coin Change', difficulty: 'Medium', url: LC('coin-change') },
      { title: 'Coin Change II', difficulty: 'Medium', url: LC('coin-change-ii') },
      { title: 'Longest Increasing Subsequence', difficulty: 'Medium', url: LC('longest-increasing-subsequence') },
      { title: 'Perfect Squares', difficulty: 'Medium', url: LC('perfect-squares') },
    ],
  },

  'week6-review': {
    id: 'week6-review',
    title: 'Review & Spaced Practice',
    week: 6,
    day: 42,
    category: 'Review',
    isReview: true,
    summary:
      'You\'ve now built DP from first principles. Consolidate before 2-D DP next week, which builds directly on this foundation.',
    keyIdeas: [
      'Re-derive the memoized and tabulated Fibonacci from a blank file — say the state definition out loud before coding.',
      'Re-solve House Robber and Coin Change cold, and explicitly compare their recurrences — one is "take or skip once," the other is "reuse unlimited times."',
      'Re-solve one bit-manipulation problem (Single Number is the fastest gut-check).',
      'Spaced repetition: re-solve one graph problem from week 4-5 and one backtracking problem from week 4.',
    ],
    problems: [],
  },
}
