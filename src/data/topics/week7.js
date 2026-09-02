import { LC } from '../lc'

export const WEEK7_META = {
  id: 7,
  title: '2-D Dynamic Programming & System Design',
  goal: 'Extend DP to two-dimensional state (grids, pairs of strings), then get a first grounding in system design fundamentals.',
  dayIds: ['dp-2d-intro', 'dp-2d-1', 'dp-2d-2', 'dp-2d-practice', 'system-design-1', 'system-design-2', 'week7-review-mock'],
}

export const WEEK7_TOPICS = {
  'dp-2d-intro': {
    id: 'dp-2d-intro',
    title: '2-D Dynamic Programming: Introduction',
    week: 7,
    day: 43,
    category: 'Dynamic Programming',
    summary:
      'When state needs two indices — a grid position, or a pair of positions in two strings — dp becomes a 2-D table. Same principles as week 6, one more dimension.',
    lesson: {
      intro:
        'Some problems can\'t be described by a single index. A path through a grid needs both a row and a column; comparing two strings needs a position in each. 2-D DP handles this by using a 2-D table, dp[i][j], where each cell\'s answer is built from a small number of neighboring cells — usually the cell above, the cell to the left, and/or the diagonal cell.',
      steps: [
        'Define the state in words first, just like 1-D: for a grid, dp[r][c] = "the answer considering the path/subgrid up to cell (r, c)." For two strings, dp[i][j] = "the answer considering the first i characters of string A and the first j characters of string B."',
        'Grid problems (Unique Paths shape): if you can only move right or down, dp[r][c] = dp[r-1][c] + dp[r][c-1] — the number of ways to reach a cell is the sum of ways to reach the cell above and the cell to the left, since those are the only two places you could have come from.',
        'Two-string problems: dp[i][j] typically compares characters A[i-1] and B[j-1] (offset by one, since dp[0][j] and dp[i][0] represent empty-prefix base cases) and branches based on whether they match, referencing dp[i-1][j-1], dp[i-1][j], or dp[i][j-1] depending on the problem\'s rules.',
        'Base cases live along the first row and first column of the table — fill those in directly (often "1 way" or "0 characters means empty-string rules apply") before the main double loop, the same way 1-D DP needed dp[0]/dp[1] set explicitly.',
        'Draw a small grid by hand (4×4 or a short 3-character vs. 3-character pair) and fill in a few cells manually — this is the fastest way to see the recurrence and catch an off-by-one before you\'ve written a full solution.',
      ],
      example: {
        setup: 'Unique Paths on a 3×3 grid, moving only right or down from top-left to bottom-right.',
        walkthrough: [
          'First row: only one way to reach any cell (keep moving right) → dp[0][*] = 1 for all columns.',
          'First column: similarly, only one way (keep moving down) → dp[*][0] = 1 for all rows.',
          'dp[1][1] = dp[0][1] + dp[1][0] = 1 + 1 = 2.',
          'dp[1][2] = dp[0][2] + dp[1][1] = 1 + 2 = 3.',
          'dp[2][1] = dp[1][1] + dp[2][0] = 2 + 1 = 3.',
          'dp[2][2] = dp[1][2] + dp[2][1] = 3 + 3 = 6 — six distinct paths from top-left to bottom-right in a 3×3 grid.',
        ],
      },
      code: `def unique_paths(rows, cols):
    dp = [[1] * cols for _ in range(rows)]
    # first row and first column are already correctly 1 (only one way along an edge)
    for r in range(1, rows):
        for c in range(1, cols):
            dp[r][c] = dp[r - 1][c] + dp[r][c - 1]
    return dp[rows - 1][cols - 1]`,
      pitfalls: [
        'Forgetting to initialize the first row/column base cases before the main loop — they can\'t be derived from the general recurrence since they\'re missing one of their two "neighbor" cells.',
        'Building the table with [[1] * cols] * rows instead of [[1] * cols for _ in range(rows)] — the first creates rows references to the *same* inner list, so updating dp[2][3] silently changes dp[0][3], dp[1][3], etc. too. Always use a list comprehension to build each row independently.',
        'Off-by-one between string length and DP table size — a 2-D string DP table is typically (lenA+1) × (lenB+1) to leave room for the empty-prefix row/column at index 0.',
        'Filling the table in the wrong order — always fill so that dp[i][j]\'s dependencies (usually up/left/diagonal) are already computed, which for most grid/string problems just means a simple row-by-row, left-to-right sweep.',
      ],
    },
    keyIdeas: [
      'dp[i][j] = answer considering position i in one dimension and j in the other — define this sentence before coding.',
      'Grid paths: dp[r][c] = dp[r-1][c] + dp[r][c-1] (sum of ways to arrive from above or from the left).',
      'Two-string DP: dp[i][j] usually compares A[i-1] vs B[j-1] and branches on whether they match.',
      'Base cases along the first row/column must be set explicitly before the main double loop.',
    ],
    problems: [
      { title: 'Unique Paths', difficulty: 'Medium', url: LC('unique-paths') },
      { title: 'Unique Paths II', difficulty: 'Medium', url: LC('unique-paths-ii') },
      { title: 'Minimum Path Sum', difficulty: 'Medium', url: LC('minimum-path-sum') },
    ],
  },

  'dp-2d-1': {
    id: 'dp-2d-1',
    title: '2-D DP, Part 1: Comparing Two Strings',
    week: 7,
    day: 44,
    category: 'Dynamic Programming',
    summary:
      'The classic two-string DP problems: Longest Common Subsequence and Edit Distance — both build a dp[i][j] table comparing prefixes.',
    lesson: {
      intro:
        'Longest Common Subsequence (LCS) and Edit Distance are the two problems most 2-D string DP questions trace back to. Both compare two strings character by character using a dp[i][j] table, but they combine sub-results differently — LCS "agrees" when characters match, Edit Distance "pays a cost" when they don\'t.',
      steps: [
        'LCS: dp[i][j] = length of the longest common subsequence between A[0..i) and B[0..j). If A[i-1] == B[j-1] (the characters just before these prefixes end), they can both be part of the subsequence: dp[i][j] = dp[i-1][j-1] + 1. If they don\'t match, take the best of skipping one character from either string: dp[i][j] = max(dp[i-1][j], dp[i][j-1]).',
        'Edit Distance: dp[i][j] = minimum operations (insert, delete, replace) to turn A[0..i) into B[0..j). If the last characters match, no operation needed here: dp[i][j] = dp[i-1][j-1]. If they don\'t match, try all three operations and take the cheapest: dp[i][j] = 1 + min(dp[i-1][j-1] (replace), dp[i-1][j] (delete from A), dp[i][j-1] (insert into A)).',
        'Both recurrences only ever look at dp[i-1][j-1], dp[i-1][j], and dp[i][j-1] — one row up, one column left, or the diagonal. This is why filling the table row by row, left to right, always has the needed values ready.',
        'Once the O(n·m)-space table version works, note that each row only depends on the previous row — an interviewer follow-up ("can you reduce the space?") is answered by keeping just two rows (or one row updated carefully) instead of the full table, dropping space to O(min(n,m)).',
      ],
      example: {
        setup: 'LCS of "ABCBDAB" and "BDCAB" — tracing the first few cells (prefixes "A" vs "B", "A" vs "BD", "AB" vs "B").',
        walkthrough: [
          'dp[0][*] = 0 and dp[*][0] = 0 (empty prefix has no common subsequence with anything).',
          'A[0]=\'A\' vs B[0]=\'B\': no match → dp[1][1] = max(dp[0][1], dp[1][0]) = max(0,0) = 0.',
          'A[0]=\'A\' vs B[0..1]=\'BD\': still comparing \'A\' against \'D\' at this cell, no match → dp[1][2] = max(dp[0][2], dp[1][1]) = 0.',
          'A[0..1]=\'AB\' vs B[0]=\'B\': comparing \'B\' (A[1]) against \'B\' (B[0]) — match! → dp[2][1] = dp[1][0] + 1 = 1.',
          'Continuing this fill for the full table eventually gives dp[7][5] = 4 (the LCS "BCAB" or similar, length 4) — the point here is just seeing how each cell only needs its up/left/diagonal neighbors.',
        ],
      },
      code: `def longest_common_subsequence(a, b):
    n, m = len(a), len(b)
    dp = [[0] * (m + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[n][m]`,
      pitfalls: [
        'Mixing up "index into the string" (0-based) with "index into the DP table" (1-based, offset by the empty-prefix row/column) — always double check a[i-1] vs a[i] carefully.',
        'For Edit Distance, forgetting one of the three operations (insert/delete/replace) in the min() — each corresponds to a specific neighbor cell, and skipping one silently gives a wrong (too-optimistic) answer.',
        'Assuming LCS and Edit Distance share the same recurrence because they look similar — LCS only rewards matches, Edit Distance also prices *mismatches*; conflating the two is a common mistake under interview pressure.',
      ],
    },
    keyIdeas: [
      'LCS: matching characters extend the diagonal (+1); mismatches take the best of skipping from either string.',
      'Edit Distance: matching characters are free (diagonal); mismatches cost 1 plus the best of insert/delete/replace.',
      'Both only ever reference the up, left, and diagonal neighbor cells.',
      'Space can be reduced from O(n·m) to O(min(n,m)) since each row only needs the previous row.',
    ],
    problems: [
      { title: 'Longest Common Subsequence', difficulty: 'Medium', url: LC('longest-common-subsequence') },
      { title: 'Edit Distance', difficulty: 'Hard', url: LC('edit-distance') },
      { title: 'Delete Operation for Two Strings', difficulty: 'Medium', url: LC('delete-operation-for-two-strings') },
    ],
  },

  'dp-2d-2': {
    id: 'dp-2d-2',
    title: '2-D DP, Part 2: Knapsack-Style Problems',
    week: 7,
    day: 45,
    category: 'Dynamic Programming',
    summary:
      'The other major 2-D DP family: choosing a subset of items under a constraint (weight, sum, count) — the "0/1 knapsack" shape.',
    lesson: {
      intro:
        'Knapsack-style DP asks: given a set of items, each usable at most once, which subset best satisfies some constraint (fits a capacity, hits a target sum)? The state is naturally 2-D: dp[i][capacity] = "the best achievable value using only the first i items, within this capacity" — one dimension for "how many items considered," one for "how much room/target is left."',
      steps: [
        'The core recurrence at each cell asks one yes/no question: for item i, either don\'t use it (carry forward dp[i-1][capacity] unchanged) or use it (dp[i-1][capacity - weight[i]] + value[i], if it fits) — take whichever is better.',
        'This differs from Coin Change (week 6) specifically because each item can be used at most once — that\'s why the "used it" branch looks back to row i-1 (items *before* this one), not row i (which would allow reusing the current item, the unbounded/"unlimited coins" case).',
        'Coin Change II (count the number of combinations that sum to a target) is the counting variant of this same shape: dp[i][target] = dp[i-1][target] (don\'t use coin i) + dp[i][target-coin[i]] (do use coin i, and since coins ARE reusable here, stay on row i) — note this one does allow reuse, so compare its recurrence carefully against 0/1 knapsack\'s to see the difference.',
        'Target Sum (assign + or - to each number to hit a target) reduces to a subset-sum knapsack in disguise: if S is the total sum and T is the target, you need a subset with sum (S + T) / 2 — recognizing this transformation is most of the problem.',
        'Just like Part 1, if dp[i][*] only depends on row i-1 (true 0/1 knapsack) or row i itself in one direction (unbounded), space can often be compressed to a single 1-D array, updated carefully (usually iterating capacity in a specific direction to avoid reusing an item accidentally).',
      ],
      example: {
        setup: '0/1 knapsack-style: items with weights [1,3,4], values [15,20,30], capacity 4 — pick a subset (each item once) maximizing value.',
        walkthrough: [
          'dp[0][*] = 0 (no items considered, no value possible).',
          'Item 1 (w=1,v=15): for capacity ≥ 1, taking it gives 15. dp[1] row: capacities 0-4 → [0,15,15,15,15].',
          'Item 2 (w=3,v=20): at capacity 3, compare skip (dp[1][3]=15) vs take (dp[1][0]+20=20) → 20 is better. At capacity 4: skip (15) vs take (dp[1][1]+20=35) → 35.',
          'Item 3 (w=4,v=30): at capacity 4, compare skip (35, from previous row) vs take (dp[2][0]+30=30) → 35 is still better (using items 1+2 beats using item 3 alone).',
          'Final answer at dp[3][4] = 35 (items 1 and 2, weights 1+3=4, values 15+20=35).',
        ],
      },
      code: `def knapsack(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for cap in range(capacity + 1):
            dp[i][cap] = dp[i - 1][cap]  # don't use item i-1 (0-indexed items, 1-indexed dp rows)
            if weights[i - 1] <= cap:
                dp[i][cap] = max(dp[i][cap], dp[i - 1][cap - weights[i - 1]] + values[i - 1])
    return dp[n][capacity]`,
      pitfalls: [
        'Referencing row i instead of row i-1 in the "use this item" branch for a 0/1 (use-once) knapsack — that mistake silently allows reusing the same item multiple times, turning 0/1 knapsack into unbounded knapsack.',
        'When compressing to 1-D space for 0/1 knapsack, iterating capacity forward (low to high) instead of backward (high to low) — forward iteration lets an item\'s effect leak into a capacity that hasn\'t been "finalized" yet for the current item, again silently allowing reuse.',
        'Not recognizing a problem as knapsack-in-disguise (like Target Sum) — spend time up front looking for a transformation into a constraint you already know how to solve, rather than inventing a new recurrence from scratch.',
      ],
    },
    keyIdeas: [
      '0/1 knapsack: dp[i][cap] = max(skip item i → dp[i-1][cap], take item i → dp[i-1][cap-weight]+value).',
      '"Use-once" recurrences reference the previous item row; "reusable" recurrences (like Coin Change) reference the current row.',
      'Some problems (Target Sum) are knapsack in disguise — look for the transformation.',
      '1-D space compression for 0/1 knapsack requires iterating capacity backward to avoid accidental reuse.',
    ],
    problems: [
      { title: 'Partition Equal Subset Sum', difficulty: 'Medium', url: LC('partition-equal-subset-sum'), note: 'revisit as a knapsack problem' },
      { title: 'Target Sum', difficulty: 'Medium', url: LC('target-sum') },
      { title: 'Coin Change II', difficulty: 'Medium', url: LC('coin-change-ii') },
      { title: 'Last Stone Weight II', difficulty: 'Medium', url: LC('last-stone-weight-ii') },
    ],
  },

  'dp-2d-practice': {
    id: 'dp-2d-practice',
    title: '2-D DP: Leveling Up',
    week: 7,
    day: 46,
    category: 'Dynamic Programming',
    summary:
      'Harder 2-D DP that mixes grid movement, string interleaving, and multi-directional state — apply everything from this week under more pressure.',
    lesson: {
      intro:
        'Today has no new fundamentals — it\'s about recognizing that harder problems are still built from the same dp[i][j] shape, just with more complex transitions (more directions to check, or a third variable folded into the state).',
      steps: [
        'Longest Increasing Path in a Matrix: dp[r][c] = longest strictly-increasing path *starting* at (r, c), computed via DFS + memoization (top-down, not a simple double loop) since a cell\'s dependencies (its increasing neighbors) aren\'t in a fixed "already computed" direction the way a grid-path problem\'s up/left neighbors are.',
        'Interleaving String: dp[i][j] = "can the first i+j characters of the interleaved result be formed using the first i characters of A and first j characters of B?" — two possible transitions (the next character came from A or from B), a direct extension of the two-pointer-into-two-strings idea from Part 1.',
        'Burst Balloons: a case where the "obvious" state (process balloons left to right) doesn\'t work cleanly, because bursting a balloon affects its neighbors\' values — the trick is to think in reverse: dp[i][j] = max coins from bursting all balloons strictly between i and j, treating the *last* balloon burst in that range as the one to choose, which cleanly separates the range into two independent subproblems.',
        'When a 2-D recurrence doesn\'t obviously fill row-by-row (like Burst Balloons, filled by increasing range length), that\'s a sign to think about *what order* subproblems must be solved in, not just what the recurrence formula is — get this order right on paper before coding.',
      ],
      code: `def longest_increasing_path(matrix):
    rows, cols = len(matrix), len(matrix[0])
    memo = [[0] * cols for _ in range(rows)]

    def dfs(r, c):
        if memo[r][c] != 0:
            return memo[r][c]
        dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        best = 1
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and matrix[nr][nc] > matrix[r][c]:
                best = max(best, 1 + dfs(nr, nc))
        memo[r][c] = best
        return best

    answer = 0
    for r in range(rows):
        for c in range(cols):
            answer = max(answer, dfs(r, c))
    return answer`,
      pitfalls: [
        'Trying to fill a grid-DFS-DP table in simple row-by-row order when the dependency direction isn\'t fixed (a cell might depend on a neighbor in any of 4 directions) — memoized top-down recursion sidesteps this ordering problem entirely.',
        'For Burst Balloons-style problems, thinking about which balloon to burst *first* instead of *last* — choosing the last balloon in a range is what cleanly splits the problem into two independent halves.',
        'Underestimating how much these problems reward working the recurrence out on paper before coding — the code itself is often short; the hard part is identifying the right state and transition.',
      ],
    },
    keyIdeas: [
      'Not every 2-D DP fills in simple row-by-row order — when dependencies go in multiple directions, use memoized top-down recursion instead.',
      'Interleaving String extends two-string DP with two possible transition sources per cell.',
      'Burst Balloons: think about the *last* choice in a range, not the first, to cleanly split into subproblems.',
      'These problems are more about correctly identifying state/order on paper than about complex code.',
    ],
    problems: [
      { title: 'Longest Increasing Path in a Matrix', difficulty: 'Hard', url: LC('longest-increasing-path-in-a-matrix') },
      { title: 'Interleaving String', difficulty: 'Medium', url: LC('interleaving-string') },
      { title: 'Distinct Subsequences', difficulty: 'Hard', url: LC('distinct-subsequences') },
      { title: 'Burst Balloons', difficulty: 'Hard', url: LC('burst-balloons') },
      { title: 'Best Time to Buy and Sell Stock with Cooldown', difficulty: 'Medium', url: LC('best-time-to-buy-and-sell-stock-with-cooldown') },
    ],
  },

  'system-design-1': {
    id: 'system-design-1',
    title: 'System Design Basics, Part 1',
    week: 7,
    day: 47,
    category: 'Interview Readiness',
    summary:
      'New-grad and early-career Google loops are mostly coding + Googleyness, but every level benefits from knowing these fundamentals — and they make LRU Cache/Design Twitter-style coding questions click.',
    lesson: {
      intro:
        'System design is about making deliberate trade-offs for systems that serve many users at once — there\'s rarely one "correct" answer, only better- or worse-justified ones. Today covers the vocabulary: how clients and servers talk, and the two numbers that describe "how fast" a system feels — latency and throughput.',
      steps: [
        'Client-server model: a client (browser, mobile app) sends a request over the network to a server, which processes it (often talking to a database) and sends back a response. Most system design questions are about what happens between "client sends request" and "server sends response" at scale.',
        'Latency vs. throughput: latency is how long *one* request takes (milliseconds); throughput is how many requests the system can handle *per second*, in aggregate. You can improve one without the other — e.g., batching requests can improve throughput while making each individual request\'s latency worse.',
        'Vertical scaling (a bigger single machine — more CPU/RAM) is simple but has a ceiling and a single point of failure. Horizontal scaling (more machines working together) has no practical ceiling but requires the system to coordinate across machines — which is where most of system design\'s complexity comes from.',
        'A load balancer sits in front of multiple servers and distributes incoming requests across them — the standard first step in scaling horizontally, and the reason a single server going down doesn\'t take the whole system offline.',
        'An API (Application Programming Interface) is the contract between client and server — what requests look like, what responses look like. REST (resource-oriented, using HTTP verbs like GET/POST/PUT/DELETE) is the most common style to know for an interview.',
      ],
      example: {
        setup: 'Walking through what happens when you tap "like" on a post in a simple social app.',
        walkthrough: [
          'The client sends a request (e.g., POST /posts/123/like) over the network to a load balancer.',
          'The load balancer picks one of several identical backend servers (round-robin, least-connections, or another strategy) to handle it — spreading load so no single server is overwhelmed.',
          'That server processes the request — likely incrementing a like-count in a database — and sends a response back confirming success.',
          'Latency here is the time from tap to confirmation for *this one request*; throughput is how many total "like" requests (from all users) the whole system can process per second before it starts falling behind.',
        ],
      },
      pitfalls: [
        'Treating "faster" as one-dimensional — always clarify whether a design goal is about latency (individual request speed) or throughput (total system capacity), since optimizing for one can hurt the other.',
        'Jumping straight to a complex distributed design before clarifying requirements — scale (how many users, how much data, read-heavy vs. write-heavy) should come before architecture choices.',
        'Assuming horizontal scaling is "free" once you add a load balancer — it introduces new problems (state needs to be shared or replicated across servers) that the rest of this week\'s lessons address.',
      ],
    },
    keyIdeas: [
      'Client-server model: requests go out, responses come back — most design questions live in what happens in between.',
      'Latency (time for one request) and throughput (requests handled per second) are different axes — clarify which matters most.',
      'Vertical scaling (bigger machine) is simple but limited; horizontal scaling (more machines) needs coordination — that\'s where load balancers come in.',
      'Always clarify scale and requirements before proposing an architecture.',
    ],
    problems: [
      { title: 'Design HashMap', difficulty: 'Easy', url: LC('design-hashmap'), note: 'a tiny, codeable preview of "build a system component"' },
      { title: 'Insert Delete GetRandom O(1)', difficulty: 'Medium', url: LC('insert-delete-getrandom-o1') },
    ],
    resources: [{ label: 'system-design-primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer' }],
  },

  'system-design-2': {
    id: 'system-design-2',
    title: 'System Design Basics, Part 2',
    week: 7,
    day: 48,
    category: 'Interview Readiness',
    summary:
      'Building on yesterday: how systems store and speed up access to data — databases, caching, and message queues.',
    lesson: {
      intro:
        'Once requests reach a server, they usually need to read or write data — and at scale, doing that quickly and reliably requires more than "just use a database." Today covers the pieces that sit around data storage: choosing a database type, caching to avoid repeated work, and queues to decouple slow operations from fast ones.',
      steps: [
        'SQL (relational) databases store structured data in tables with defined schemas and strong consistency guarantees (ACID) — good when data has clear relationships and correctness matters more than raw write throughput. NoSQL databases (document, key-value, wide-column) trade some consistency/structure for flexibility and horizontal scalability — good for huge, loosely-structured, high-throughput data.',
        'Replication: keeping copies of the database on multiple machines. A common pattern is one primary (handles writes) with several replicas (handle reads) — this scales read throughput and provides a backup if the primary fails, at the cost of replicas being briefly out of date (eventual consistency).',
        'Sharding: splitting a database\'s data across multiple machines by some key (e.g., user ID range), so no single machine needs to hold everything — necessary once data no longer fits on one machine, but it makes some queries (especially ones spanning shards) harder.',
        'Caching: storing the result of an expensive operation (a database query, a computed value) in fast-access memory (like Redis, or an in-process LRU Cache — the exact structure from week 3!) so repeated requests for the same thing don\'t redo the work. The trade-off is staleness: a cache can serve outdated data until it\'s invalidated or expires.',
        'Message queues (e.g., Kafka, RabbitMQ, or the abstract idea behind them) let a fast-producing service hand off work to a slower consumer without waiting for it — the producer pushes a message and moves on; a separate consumer processes it whenever it\'s ready. This decouples systems and smooths out spikes in load.',
      ],
      example: {
        setup: 'Adding caching to a "get user profile" endpoint that\'s hit millions of times per day but the underlying data rarely changes.',
        walkthrough: [
          'Without a cache: every request hits the database directly — at high traffic, the database becomes the bottleneck (limited by its own throughput).',
          'With a cache: on each request, first check the cache (e.g., Redis) for this user\'s profile. If present ("cache hit"), return it immediately — much faster than a database round-trip.',
          'If absent ("cache miss"), query the database, return the result to the client, AND store it in the cache for next time.',
          'When the profile is updated, invalidate (delete or overwrite) that cache entry so future reads don\'t serve stale data — this cache-invalidation step is often the trickiest part of caching to get right, and worth mentioning explicitly in an interview.',
        ],
      },
      pitfalls: [
        'Suggesting caching without mentioning invalidation — a cache that\'s never told when data changes will confidently serve wrong answers.',
        'Assuming NoSQL is "just faster" than SQL in general — the right choice depends on the data\'s shape and the consistency guarantees the application actually needs, not a blanket speed claim.',
        'Proposing sharding before establishing that a single, replicated database genuinely can\'t handle the load — sharding adds real complexity (cross-shard queries, rebalancing) and shouldn\'t be the first move.',
      ],
    },
    keyIdeas: [
      'SQL: structured, strong consistency. NoSQL: flexible schema, scales more easily horizontally — choose based on data shape and consistency needs.',
      'Replication scales reads and adds redundancy; sharding scales storage/writes by splitting data across machines.',
      'Caching avoids repeated expensive work — but always requires an invalidation strategy.',
      'Message queues decouple a fast producer from a slower consumer, smoothing out load spikes.',
    ],
    problems: [
      { title: 'LRU Cache', difficulty: 'Medium', url: LC('lru-cache'), note: 'revisit — this *is* the caching concept, in code' },
      { title: 'Design Twitter', difficulty: 'Medium', url: LC('design-twitter'), note: 'revisit — a feed/fan-out preview' },
      { title: 'Time Based Key-Value Store', difficulty: 'Medium', url: LC('time-based-key-value-store'), note: 'revisit — versioned storage concept' },
    ],
    resources: [{ label: 'system-design-primer (GitHub)', url: 'https://github.com/donnemartin/system-design-primer' }],
  },

  'week7-review-mock': {
    id: 'week7-review-mock',
    title: 'Review & Mock Interview',
    week: 7,
    day: 49,
    category: 'Review',
    isReview: true,
    summary:
      'You now have the complete core DP toolkit and basic system design vocabulary. Consolidate before weeks 8-10 add lower-frequency (but valuable) advanced topics on top of this foundation.',
    keyIdeas: [
      'Re-derive the LCS and 0/1 knapsack recurrences from a blank file, stating the state definition out loud before coding either one.',
      'Run a mock interview using a 2-D DP problem you haven\'t seen before — narrate your state definition and recurrence before writing code.',
      'Practice a 2-minute verbal walkthrough of the client-server + caching + database basics, as if a non-technical interviewer asked "how would a "like" button work at scale?"',
      'Spaced repetition: re-solve one 1-D DP problem from week 6 and one graph problem from week 4-5.',
    ],
    problems: [],
  },
}
