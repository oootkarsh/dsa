import { LC } from '../lc'

export const WEEK9_META = {
  id: 9,
  title: 'Advanced Dynamic Programming & Graph Algorithms',
  goal: 'Extend DP into three new shapes (interval DP, tree DP, bitmask DP), then round out the graph toolkit with Bellman-Ford and Floyd-Warshall for negative weights and all-pairs shortest paths.',
  dayIds: ['interval-dp', 'dp-on-trees', 'bitmask-dp', 'bellman-ford', 'floyd-warshall', 'advanced-dp-graph-practice', 'week9-review-mock'],
}

export const WEEK9_TOPICS = {
  'interval-dp': {
    id: 'interval-dp',
    title: 'Interval DP',
    week: 9,
    day: 57,
    category: 'Dynamic Programming',
    summary:
      'DP over contiguous ranges [i, j], where the recurrence tries every possible split point — the shape behind matrix chain multiplication and several "minimum cost to combine a range" problems.',
    lesson: {
      intro:
        'Interval DP solves problems where you\'re choosing how to process or partition a contiguous range, and the cost depends on how you split it. The state is dp[i][j] = the optimal answer for the subproblem restricted to the range [i, j] (inclusive), and the recurrence tries every way to split that range into two smaller ranges, combining their answers plus a merge cost.',
      steps: [
        'Define the state precisely: dp[i][j] = optimal cost/count considering only elements from index i to index j.',
        'Base case: ranges of length 1 (i == j) are usually trivial — cost 0, or the single element itself.',
        'Recurrence: dp[i][j] = best over every split point k in [i, j) of dp[i][k] + dp[k+1][j] + merge_cost(i, k, j) — you\'re choosing where to "cut" the range, and merge_cost captures whatever it costs to combine the two resulting pieces.',
        'Fill order matters here in a way simple grid DP didn\'t: dp[i][j] depends on strictly *smaller* ranges, so you must fill the table by increasing range length (gap = j - i), not simple row-by-row — for each gap from 1 up to n-1, compute dp[i][i+gap] for every valid i.',
        'Complexity is typically O(n³): O(n²) distinct (i, j) states, each trying up to O(n) split points.',
      ],
      example: {
        setup: 'Matrix Chain Multiplication: given matrix dimensions p = [10, 30, 5, 60] (meaning matrix 1 is 10×30, matrix 2 is 30×5, matrix 3 is 5×60), find the minimum number of scalar multiplications to compute their product in some order.',
        walkthrough: [
          'dp[i][j] = minimum cost to multiply matrices i through j together (1-indexed matrices).',
          'Base case: dp[i][i] = 0 (a single matrix needs no multiplication).',
          'dp[1][2] (matrices 1-2, dims 10×30 and 30×5): only one way to split, cost = p[0]*p[1]*p[2] = 10*30*5 = 1500.',
          'dp[2][3] (matrices 2-3, dims 30×5 and 5×60): cost = p[1]*p[2]*p[3] = 30*5*60 = 9000.',
          'dp[1][3] (all three matrices): try split at k=1: dp[1][1] + dp[2][3] + p[0]*p[1]*p[3] = 0 + 9000 + 10*30*60 = 27000. Try split at k=2: dp[1][2] + dp[3][3] + p[0]*p[2]*p[3] = 1500 + 0 + 10*5*60 = 4500. Best: 4500 — multiply matrices 1-2 first, then multiply that result by matrix 3.',
        ],
      },
      code: `def matrix_chain_order(p):
    # p has length n+1; matrix i has dimensions p[i-1] x p[i], for i in 1..n
    n = len(p) - 1
    dp = [[0] * (n + 1) for _ in range(n + 1)]

    for gap in range(1, n):
        for i in range(1, n - gap + 1):
            j = i + gap
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k + 1][j] + p[i - 1] * p[k] * p[j]
                dp[i][j] = min(dp[i][j], cost)
    return dp[1][n]`,
      pitfalls: [
        'Filling the table in the wrong order (e.g., simple nested loops over i then j without accounting for range length) — dp[i][j] needs dp[i][k] and dp[k+1][j] for k strictly between, which are shorter ranges; you must guarantee those are already computed.',
        'Off-by-one on the split range — k should range so that both dp[i][k] and dp[k+1][j] are valid (non-empty) subranges; trace a 3-element example by hand to confirm your loop bounds.',
        'Not recognizing O(n³) might be too slow for large n — interval DP is fine for n up to a few hundred, but won\'t scale to n in the tens of thousands the way O(n log n) approaches do.',
      ],
    },
    keyIdeas: [
      'dp[i][j] = optimal answer for the range [i, j] — try every split point k, combine dp[i][k] + dp[k+1][j] + merge cost.',
      'Must fill the table by increasing range length (gap), not simple row-by-row — smaller ranges must be ready first.',
      'Typically O(n³): O(n²) states × O(n) split points each.',
      'Signal: "minimum/maximum cost to combine/partition a contiguous range," especially when order of combination matters.',
    ],
    problems: [
      { title: 'Palindrome Partitioning II', difficulty: 'Hard', url: LC('palindrome-partitioning-ii') },
      { title: 'Minimum Cost to Cut a Stick', difficulty: 'Hard', url: LC('minimum-cost-to-cut-a-stick') },
      { title: 'Minimum Cost Tree From Leaf Values', difficulty: 'Medium', url: LC('minimum-cost-tree-from-leaf-values') },
      { title: 'Burst Balloons', difficulty: 'Hard', url: LC('burst-balloons'), note: 'revisit from week 7 through the interval-DP lens' },
    ],
  },

  'dp-on-trees': {
    id: 'dp-on-trees',
    title: 'Dynamic Programming on Trees',
    week: 9,
    day: 58,
    category: 'Dynamic Programming',
    summary:
      'Layer DP onto the post-order DFS pattern from week 3: instead of returning one value per node, return a small set of answers under different conditions, and let the parent combine them.',
    lesson: {
      intro:
        'Tree DP is the week 3 "bottom-up, trust the recursive call on children" pattern, extended so each recursive call returns more than one value — typically "the best answer if this node is included" alongside "the best answer if this node is excluded" — because the parent needs to know both to make its own decision correctly.',
      steps: [
        'Identify what information a parent needs from each child beyond a single combined number — usually this is exactly two numbers: the best answer *including* this subtree\'s root in some choice, and the best answer *excluding* it.',
        'Post-order DFS (same shape as week 3\'s bottom-up pattern): recurse into left and right children first, get their (included, excluded) pairs back, then compute the current node\'s own (included, excluded) pair from them.',
        'Base case: a None child contributes (0, 0) — no node means no contribution either way.',
        'The final answer is usually the max/min of the root\'s two returned values, since the root has no parent constraining which choice it must make.',
        'This same "return multiple states per call" idea generalizes beyond include/exclude — e.g., "longest path ending at this node going down-left" vs "down-right," or "count of a property, plus whether a condition holds" — the recipe is the same: figure out what minimal extra state the parent needs, and return exactly that.',
      ],
      example: {
        setup: 'House Robber III: rob houses arranged in a binary tree, no two directly-connected houses (parent-child) can both be robbed. Maximize total value. Tree: root=3, left child=2 (with a right child=3), right child=3 (with a right child=1).',
        walkthrough: [
          'Each node returns (rob_this, skip_this): rob_this = the best total if this node IS robbed; skip_this = the best total if this node is NOT robbed.',
          'Leaf nodes (e.g., the "3" under the left child, and the "1" under the right child): rob_this = their own value, skip_this = 0.',
          'Left child (value 2, with one right leaf child valued 3): rob_this = 2 + skip_this(child) = 2 + 0 = 2. skip_this = max(rob_this(child), skip_this(child)) = max(3, 0) = 3.',
          'Right child (value 3, with one right leaf child valued 1): rob_this = 3 + 0 = 3. skip_this = max(1, 0) = 1.',
          'Root (value 3): rob_this = 3 + skip_this(left) + skip_this(right) = 3 + 3 + 1 = 7. skip_this = max(2,3) + max(3,1) = 3 + 3 = 6. Answer: max(7, 6) = 7.',
        ],
      },
      code: `def rob(root):
    def dfs(node):
        if node is None:
            return (0, 0)  # (rob_this, skip_this)
        left_rob, left_skip = dfs(node.left)
        right_rob, right_skip = dfs(node.right)

        rob_this = node.val + left_skip + right_skip
        skip_this = max(left_rob, left_skip) + max(right_rob, right_skip)
        return (rob_this, skip_this)

    return max(dfs(root))`,
      pitfalls: [
        'Collapsing to a single return value too early — if the parent needs to know "what if I don\'t take you" separately from "the best you could do overall," merging those into one number loses information the parent needs.',
        'Forgetting the base case for a None child — it must return the identity for both states (e.g., (0, 0) for a sum-based problem), not just one value.',
        'Overcomplicating the state — many tree DP problems only need 2 states (included/excluded); before adding a third, double-check the parent actually needs it.',
      ],
    },
    keyIdeas: [
      'Extend week 3\'s bottom-up DFS pattern: return multiple values per call (e.g., included vs. excluded) instead of one.',
      'A None child contributes the identity for every state — usually (0, 0).',
      'The root\'s combined answer is the max/min across its returned states, since nothing constrains the root itself.',
      'Still just one DFS pass — O(n) time, same as plain tree traversal.',
    ],
    problems: [
      { title: 'House Robber III', difficulty: 'Medium', url: LC('house-robber-iii') },
      { title: 'Diameter of Binary Tree', difficulty: 'Easy', url: LC('diameter-of-binary-tree'), note: 'revisit — a simpler single-extra-state tree DP' },
      { title: 'Longest Path With Different Adjacent Characters', difficulty: 'Hard', url: LC('longest-path-with-different-adjacent-characters') },
      { title: 'Distribute Coins in Binary Tree', difficulty: 'Medium', url: LC('distribute-coins-in-binary-tree') },
    ],
  },

  'bitmask-dp': {
    id: 'bitmask-dp',
    title: 'Bitmask DP',
    week: 9,
    day: 59,
    category: 'Dynamic Programming',
    summary:
      'When "which subset of items has been used" is part of the state and n is small, represent that subset as a single integer — turning an unmanageable state space into a just-barely-tractable one.',
    lesson: {
      intro:
        'Bitmask DP represents a subset of n items as a single integer from 0 to 2ⁿ - 1, where bit i being 1 means item i is included. This turns "which subset have I used/visited so far" — normally an intractable amount of state — into a single integer you can index a DP array with, at the cost of exponential space/time in n. It only works when n is small, typically up to about 15-20.',
      steps: [
        'Represent a subset as mask, an integer where bit j (mask & (1 << j)) tells you whether item j is in the subset.',
        'dp[mask][i] = the best answer when the set of used/visited items is exactly mask, and (if relevant to the problem) you\'re currently "at" item i.',
        'Transition: from state (mask, i), try adding each item j not yet in mask — checked via mask & (1 << j) == 0 — and move to state (mask | (1 << j), j), updating that state\'s best answer.',
        'Complexity: O(2ⁿ × n) states, each with up to O(n) transitions, giving O(2ⁿ × n²) time in the worst case — this grows extremely fast, which is exactly why n must stay small in practice.',
        'Signal words: "visit all nodes/cities" (traveling-salesman-shaped), "assign every worker to a task," "partition into exactly k groups," "minimum/maximum over all subsets" — anything centered on *which subset* has been handled, on a small input size.',
      ],
      example: {
        setup: 'Shortest Path Visiting All Nodes: 3 nodes (0, 1, 2) fully connected, find the shortest path (by edge count) that visits every node, starting from any node.',
        walkthrough: [
          'State: (mask, node) — mask tracks which nodes have been visited, node is the current position. Start states: (1 << i, i) for every i, each at distance 0 (you can start anywhere).',
          'Goal: reach any state where mask == 0b111 (all 3 nodes visited) — the answer is the minimum distance to reach any such state.',
          'BFS explores (mask, node) states level by level (since all edges cost 1 here): from (0b001, 0), moving to neighbor 1 gives (0b011, 1) at distance 1; moving to neighbor 2 gives (0b101, 2) at distance 1.',
          'From (0b011, 1) (visited 0 and 1, at node 1), moving to node 2 gives (0b111, 2) at distance 2 — all nodes visited! This is a candidate answer.',
          'BFS guarantees the first time any (0b111, *) state is reached is the shortest such path — answer: 2 edges.',
        ],
      },
      code: `from collections import deque

def shortest_path_length(graph):
    n = len(graph)
    if n == 1:
        return 0
    full_mask = (1 << n) - 1

    visited = set()
    queue = deque()
    for i in range(n):
        state = (1 << i, i)
        visited.add(state)
        queue.append((state, 0))  # (state, distance)

    while queue:
        (mask, node), dist = queue.popleft()
        for neighbor in graph[node]:
            next_mask = mask | (1 << neighbor)
            if next_mask == full_mask:
                return dist + 1
            next_state = (next_mask, neighbor)
            if next_state not in visited:
                visited.add(next_state)
                queue.append((next_state, dist + 1))
    return -1`,
      pitfalls: [
        'Applying bitmask DP when n is too large — 2²⁰ is about a million, already pushing practical limits; 2³⁰ is over a billion and won\'t run in time. Recognize the input-size hint (often explicitly n ≤ 15 or similar) as confirmation this technique is intended.',
        'Off-by-one on bit indexing — item j corresponds to bit position j (value 1 << j), not item number j meaning "the j-th bit from some other offset." Keep this consistent throughout.',
        'Recomputing whether an item is in the mask with a slow method (like converting to a binary string) instead of the O(1) bitwise check mask & (1 << j).',
      ],
    },
    keyIdeas: [
      'Represent a subset of n items as an integer 0 to 2ⁿ-1; bit j tells whether item j is included.',
      'dp[mask][i] = best answer with exactly this subset used, currently at item i.',
      'O(2ⁿ × n) or worse states — only tractable for small n (roughly ≤ 15-20).',
      'Signal: "visit all X," "assign every Y to a Z," "partition into exactly k groups," with a small input size.',
    ],
    problems: [
      { title: 'Shortest Path Visiting All Nodes', difficulty: 'Hard', url: LC('shortest-path-visiting-all-nodes') },
      { title: 'Partition to K Equal Sum Subsets', difficulty: 'Medium', url: LC('partition-to-k-equal-sum-subsets') },
      { title: 'Maximum Students Taking Exam', difficulty: 'Hard', url: LC('maximum-students-taking-exam') },
    ],
  },

  'bellman-ford': {
    id: 'bellman-ford',
    title: 'Bellman-Ford Algorithm',
    week: 9,
    day: 60,
    category: 'Graphs',
    summary:
      'Shortest paths when edges can have negative weights — Dijkstra\'s greedy assumption breaks there, so Bellman-Ford relaxes every edge repeatedly instead.',
    lesson: {
      intro:
        'Dijkstra (week 5) assumes the closest not-yet-finalized node can safely be finalized — an assumption that breaks with negative edge weights, since a longer-looking path could later be reduced by a negative edge. Bellman-Ford handles negative weights correctly (as long as there\'s no negative cycle reachable from the source) with a simpler, if slower, approach: relax every edge, repeatedly, a bounded number of times.',
      steps: [
        'Initialize distances to infinity for every node except the source (0).',
        'Relax every edge (u, v, weight): if dist[u] + weight < dist[v], update dist[v] = dist[u] + weight. "Relaxing" just means checking if going through this edge improves the known distance.',
        'Repeat the full pass over all edges V - 1 times (V = number of nodes). This is guaranteed sufficient because any shortest path in a graph with no negative cycle uses at most V - 1 edges — so V - 1 rounds of relaxing every edge is enough for the improvement to "propagate" all the way along the longest possible shortest path.',
        'Negative cycle detection: after V - 1 rounds, do one more pass — if any edge can still be relaxed, a negative cycle exists that\'s reachable from the source (distances would keep decreasing forever around that cycle).',
        'Complexity: O(V × E) — much worse than Dijkstra\'s O((V+E) log V), so only reach for Bellman-Ford when negative weights are actually possible; use Dijkstra whenever weights are guaranteed non-negative.',
      ],
      example: {
        setup: 'Cheapest Flights Within K Stops is a bounded version of Bellman-Ford: instead of V-1 full rounds, you relax edges only K+1 times, because the problem caps the path length at K+1 edges (K stops). Graph: 0→1 (100), 1→2 (100), 0→2 (500), find cheapest 0→2 with at most 1 stop (K=1).',
        walkthrough: [
          'Round 1 (allows paths of 1 edge): relax 0→1: dist[1] = 100. Relax 1→2: dist[1] is still infinity from *before this round started* if using a proper snapshot, so this doesn\'t fire yet (see the pitfall below on snapshotting). Relax 0→2: dist[2] = 500.',
          'Round 2 (allows paths of 2 edges, i.e., 1 stop — matching K=1): relax 0→1: no change. Relax 1→2: dist[1] + 100 = 100 + 100 = 200 < dist[2]=500 → update dist[2] = 200. Relax 0→2: no improvement.',
          'After K+1=2 rounds: dist[2] = 200 (path 0→1→2, using exactly 1 stop) — cheaper than the direct 500 edge, found because we allowed exactly enough rounds for a 1-stop path.',
        ],
      },
      code: `def bellman_ford(n, edges, source):
    dist = [float('inf')] * n
    dist[source] = 0

    for _ in range(n - 1):
        for u, v, weight in edges:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight

    # optional: one more pass to detect a negative cycle
    for u, v, weight in edges:
        if dist[u] + weight < dist[v]:
            return None  # negative cycle reachable from source
    return dist

# Cheapest Flights Within K Stops: bounded to K+1 rounds, with a snapshot per round
def find_cheapest_price(n, flights, src, dst, k):
    dist = [float('inf')] * n
    dist[src] = 0
    for _ in range(k + 1):
        new_dist = dist[:]  # snapshot -- don't use this round's own updates mid-round
        for u, v, price in flights:
            if dist[u] + price < new_dist[v]:
                new_dist[v] = dist[u] + price
        dist = new_dist
    return dist[dst] if dist[dst] != float('inf') else -1`,
      pitfalls: [
        'Updating the distance array in place during a single round instead of using a snapshot — for bounded-rounds variants (like Cheapest Flights Within K Stops), this lets one relaxation "chain" into another within the same round, violating the edge-count cap the round is supposed to enforce.',
        'Running full V - 1 rounds when the problem actually bounds the number of edges allowed (like the K-stops variant) — use exactly the bound the problem specifies, not always V - 1.',
        'Using Bellman-Ford when Dijkstra would do — if you\'re certain weights are non-negative, Dijkstra\'s O((V+E) log V) is strictly better than Bellman-Ford\'s O(V×E).',
      ],
    },
    keyIdeas: [
      'Relax every edge, repeated V - 1 times — guaranteed sufficient since shortest paths use at most V - 1 edges.',
      'Handles negative weights correctly, unlike Dijkstra; detects negative cycles with one extra pass.',
      'O(V × E) — worse than Dijkstra, so only use it when negative weights are actually possible.',
      'Bounded variants (K stops) relax only K+1 times, using a snapshot per round to enforce the edge-count cap correctly.',
    ],
    problems: [
      { title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', url: LC('cheapest-flights-within-k-stops'), note: 'revisit from week 5 through the Bellman-Ford lens' },
      { title: 'Network Delay Time', difficulty: 'Medium', url: LC('network-delay-time'), note: 'revisit — solvable with either Dijkstra or Bellman-Ford' },
    ],
  },

  'floyd-warshall': {
    id: 'floyd-warshall',
    title: 'Floyd-Warshall Algorithm',
    week: 9,
    day: 61,
    category: 'Graphs',
    summary:
      'Shortest paths between every pair of nodes at once, in a deceptively short triple-nested loop — O(V³), works with negative edges (not negative cycles).',
    lesson: {
      intro:
        'When you need shortest paths between *every* pair of nodes — not just from one source — Floyd-Warshall computes all of them at once with one of the shortest classic algorithms to write: three nested loops, one line of relaxation logic inside.',
      steps: [
        'Initialize a V×V distance matrix: dist[i][j] = the direct edge weight if one exists, 0 if i == j, and infinity otherwise.',
        'For each node k (from 0 to V-1), for every pair (i, j): check if routing through k is better — dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]).',
        'The loop order matters critically: k must be the *outermost* loop. After the iteration for a given k completes, dist[i][j] correctly represents "the shortest path from i to j using only nodes 0..k as allowed intermediate stops" — an invariant that only holds if k is held fixed while i and j vary underneath it.',
        'After all V values of k have been processed, dist[i][j] holds the true shortest path between every pair — O(V³) time, O(V²) space for the matrix.',
        'Compare with running Dijkstra from every single node: O(V × (V+E) log V). Floyd-Warshall\'s O(V³) is simpler to code and wins on dense graphs (E close to V²) or when negative weights are present; per-source Dijkstra wins on sparse graphs with non-negative weights.',
      ],
      example: {
        setup: 'Floyd-Warshall on 3 nodes with edges: 0→1 (3), 1→2 (1), 0→2 (10).',
        walkthrough: [
          'Initial dist: dist[0][1]=3, dist[1][2]=1, dist[0][2]=10, dist[i][i]=0, everything else infinity.',
          'k=0 (route through node 0): check all (i,j) — no improvements, since nothing currently routes usefully through 0 as an intermediate.',
          'k=1 (route through node 1): check dist[0][2] vs dist[0][1] + dist[1][2] = 3 + 1 = 4. 4 < 10, so update dist[0][2] = 4.',
          'k=2 (route through node 2): no further improvements available.',
          'Final: dist[0][2] = 4 (the path 0→1→2), correctly found by "discovering" that routing through node 1 beats the direct edge — this is the essence of what the k-loop accomplishes for every pair simultaneously.',
        ],
      },
      code: `def floyd_warshall(n, edges):
    dist = [[float('inf')] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    for u, v, weight in edges:
        dist[u][v] = min(dist[u][v], weight)  # handle duplicate edges safely

    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    return dist`,
      pitfalls: [
        'Putting i or j as the outermost loop instead of k — this breaks the algorithm\'s core invariant and produces wrong (usually too-large) distances that only look plausible on small test cases.',
        'Using O(V³) on a large, sparse graph — for V much beyond a few hundred, this is too slow; per-source Dijkstra (or Bellman-Ford, if weights are negative) is the better choice on sparse graphs.',
        'Not checking dist[i][i] < 0 after running — a negative value on the diagonal indicates a negative cycle passes through node i, which Floyd-Warshall doesn\'t handle gracefully otherwise (distances involving that cycle become meaningless, not just "wrong sign").',
      ],
    },
    keyIdeas: [
      'dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) — for every k, i, j, with k as the outermost loop.',
      'Computes all-pairs shortest paths in O(V³) time, O(V²) space — works with negative edges (not negative cycles).',
      'Loop order (k outermost) is not optional — it\'s what makes the algorithm correct.',
      'Wins over per-source Dijkstra on dense graphs or with negative weights; loses on large sparse graphs.',
    ],
    problems: [
      { title: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance', difficulty: 'Medium', url: LC('find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance') },
      { title: 'Course Schedule IV', difficulty: 'Medium', url: LC('course-schedule-iv'), note: 'transitive closure — a Floyd-Warshall variant' },
    ],
  },

  'advanced-dp-graph-practice': {
    id: 'advanced-dp-graph-practice',
    title: 'Advanced DP & Graph Practice',
    week: 9,
    day: 62,
    category: 'Dynamic Programming',
    summary:
      'Mixed practice pulling together this week\'s tools — interval DP, tree DP, bitmask DP, Bellman-Ford, Floyd-Warshall — under time pressure.',
    lesson: {
      intro:
        'Today has no new fundamentals — it\'s about pattern-matching under pressure: given a problem statement with no labeled category, correctly identify which of this week\'s (lower-frequency but real) tools applies, the same skill you\'ll need in an actual interview when nobody tells you which week\'s lesson a problem belongs to.',
      steps: [
        'Signal for interval DP: "contiguous range," "order of combining/merging matters," "minimum/maximum cost to fully reduce/combine a sequence."',
        'Signal for tree DP: any tree problem where the answer depends on a choice at each node (include/exclude, color, direction) that constrains what the parent can validly do.',
        'Signal for bitmask DP: small n (≤ ~15-20), and the state needs to track "which specific subset of items has been handled" rather than just a count.',
        'Signal for Bellman-Ford / Floyd-Warshall: negative weights are explicitly possible (Bellman-Ford, single-source) or you need shortest paths between many/all pairs at once on a small-to-medium graph (Floyd-Warshall).',
      ],
      pitfalls: [
        'Spending too long searching for the "perfect" advanced technique when a simpler week 1-7 pattern actually solves the problem — these tools are real but lower-frequency; don\'t let today\'s focus bias you toward overcomplicating tomorrow\'s interview problems.',
        'Mixing up interval DP\'s "increasing range length" fill order with plain 2-D DP\'s row-by-row order — re-confirm which one a given problem needs before coding.',
        'Forgetting that these topics, while good to know for a thorough 12-week plan, are less central to a typical Google loop than the core patterns from weeks 1-7 — keep them in proportion during future review.',
      ],
    },
    keyIdeas: [
      'The real skill today is pattern-matching an unlabeled problem to the right tool — practice recognizing signals, not just executing known recipes.',
      'Don\'t force an advanced technique onto a problem a simpler pattern already solves.',
      'Interval DP fills by range length; tree DP extends bottom-up DFS; bitmask DP needs small n; Bellman-Ford/Floyd-Warshall are for negative weights or all-pairs queries.',
      'Keep these lower-frequency topics in proportion — weeks 1-7\'s core patterns matter most on interview day.',
    ],
    problems: [
      { title: 'Palindrome Partitioning II', difficulty: 'Hard', url: LC('palindrome-partitioning-ii') },
      { title: 'House Robber III', difficulty: 'Medium', url: LC('house-robber-iii') },
      { title: 'Partition to K Equal Sum Subsets', difficulty: 'Medium', url: LC('partition-to-k-equal-sum-subsets') },
      { title: 'Network Delay Time', difficulty: 'Medium', url: LC('network-delay-time') },
      { title: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance', difficulty: 'Medium', url: LC('find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance') },
    ],
  },

  'week9-review-mock': {
    id: 'week9-review-mock',
    title: 'Review & Mock Interview',
    week: 9,
    day: 63,
    category: 'Review',
    isReview: true,
    summary:
      'Consolidate advanced DP and graph algorithms, then run a mock interview — by this point you have the full technical toolkit this plan covers.',
    keyIdeas: [
      'Re-derive interval DP\'s fill order (by increasing range length) and tree DP\'s "return multiple states" pattern from blank files.',
      'Re-derive Bellman-Ford\'s edge relaxation and explain out loud why V - 1 rounds is always sufficient.',
      'Run a mock interview — mix in a harder problem from this week if you\'re feeling confident, otherwise stick to core weeks 1-7 patterns, which matter more for a typical loop.',
      'Spaced repetition: re-solve one 2-D DP problem from week 7 and one system design concept walkthrough from week 7.',
    ],
    problems: [],
  },
}
