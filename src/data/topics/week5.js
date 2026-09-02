import { LC } from '../lc'

export const WEEK5_META = {
  id: 5,
  title: 'Advanced Graphs & Interview Patterns',
  goal: 'Round out graph algorithms (topological sort, Union-Find, Dijkstra, MSTs) and pick up two more standalone patterns: intervals and greedy.',
  dayIds: ['topological-sort', 'union-find', 'dijkstra', 'mst', 'intervals', 'greedy', 'week5-review-mock'],
}

export const WEEK5_TOPICS = {
  'topological-sort': {
    id: 'topological-sort',
    title: 'Topological Sort',
    week: 5,
    day: 29,
    category: 'Graphs',
    summary:
      'Ordering tasks with dependencies — a direct extension of the directed-cycle detection you learned in week 4.',
    lesson: {
      intro:
        'A topological sort of a directed acyclic graph (DAG) is a linear ordering of its nodes such that every edge A → B has A appearing before B. It only makes sense on graphs with no cycles (hence "acyclic") — if a cycle exists, no valid ordering can satisfy every dependency, which is exactly what Course Schedule was testing last week.',
      steps: [
        'DFS-based approach (postorder): run DFS from every unvisited node; when a node has finished exploring *all* its neighbors (i.e., you\'re about to return from its recursive call), push it onto the front of a result list (or append to a list and reverse at the end). Intuitively, a node is only "done" after everything it depends on is done, so postorder naturally produces a valid reverse-dependency order.',
        "Kahn's algorithm (BFS-based): compute each node's in-degree (number of incoming edges). Start a queue with all nodes that have in-degree 0 (no prerequisites). Repeatedly pop a node, add it to the result, and decrement the in-degree of each of its neighbors — if a neighbor's in-degree hits 0, it's now free to be added to the queue.",
        "Cycle detection falls out for free: with Kahn's algorithm, if the result list ends up shorter than the total node count, some nodes never reached in-degree 0 — meaning a cycle exists among them.",
        'Both approaches are O(V + E) — same complexity as plain DFS/BFS, since it\'s the same traversal with different bookkeeping.',
      ],
      example: {
        setup: "Kahn's algorithm on courses with prerequisites: 0 requires nothing, 1 requires 0, 2 requires 0, 3 requires 1 and 2.",
        walkthrough: [
          'In-degrees: 0→0, 1→1, 2→1, 3→2. Queue starts with all in-degree-0 nodes: [0].',
          'Pop 0, add to result: [0]. Decrement neighbors\' in-degrees: 1→0, 2→0. Both now free — push both. Queue: [1, 2].',
          'Pop 1, add to result: [0, 1]. Decrement 3\'s in-degree: 3→1 (not yet 0, don\'t push).',
          'Pop 2, add to result: [0, 1, 2]. Decrement 3\'s in-degree: 3→0. Now push it. Queue: [3].',
          'Pop 3, add to result: [0, 1, 2, 3]. Queue empty, result has all 4 nodes → valid ordering, no cycle.',
        ],
      },
      code: `from collections import deque

def topological_sort(num_nodes, edges):
    graph = {i: [] for i in range(num_nodes)}
    in_degree = [0] * num_nodes
    for src, dst in edges:
        graph[src].append(dst)
        in_degree[dst] += 1

    queue = deque(i for i in range(num_nodes) if in_degree[i] == 0)

    order = []
    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return order if len(order) == num_nodes else []  # empty = cycle detected`,
      pitfalls: [
        'Forgetting that the DFS-based approach needs to *reverse* the postorder result (or prepend) — appending in postorder gives the reverse of a valid topological order.',
        'Not checking len(order) == num_nodes at the end of Kahn\'s algorithm — this is the check that tells you whether a cycle made a full ordering impossible.',
        'A DAG can have multiple valid topological orderings — don\'t assume there\'s one "correct" answer to compare against; any ordering respecting all edges is valid.',
      ],
    },
    keyIdeas: [
      'Only defined for directed acyclic graphs (DAGs) — a cycle means no valid ordering exists.',
      "Kahn's algorithm (BFS): repeatedly remove in-degree-0 nodes, decrementing neighbors' in-degrees.",
      'DFS-based: postorder, then reverse — a node is "done" only after everything it depends on is done.',
      'O(V + E), same as plain BFS/DFS — just with extra bookkeeping.',
    ],
    problems: [
      { title: 'Course Schedule', difficulty: 'Medium', url: LC('course-schedule'), note: 'revisit through the topo-sort lens' },
      { title: 'Course Schedule II', difficulty: 'Medium', url: LC('course-schedule-ii') },
      { title: 'Alien Dictionary', difficulty: 'Hard', url: LC('alien-dictionary') },
    ],
  },

  'union-find': {
    id: 'union-find',
    title: 'Union-Find (Disjoint Set)',
    week: 5,
    day: 30,
    category: 'Graphs',
    summary:
      'A structure purpose-built to answer "are these two things connected?" and "would adding this edge create a cycle?" in near-constant time.',
    lesson: {
      intro:
        'Union-Find (a.k.a. Disjoint Set Union) tracks a collection of elements partitioned into groups, and answers two questions efficiently: find(x) — "which group is x in?" — and union(x, y) — "merge x\'s group and y\'s group into one." Both are much faster than DFS/BFS would be if you needed to answer many such connectivity queries one after another.',
      steps: [
        'Each element starts as its own group, represented as a tree where every node points to a parent; a group\'s root is a node that points to itself. find(x) walks up parent pointers until it hits a root — that root is the group\'s identifier.',
        'union(x, y) finds both roots; if they differ, it makes one root point to the other, merging the two trees (and therefore the two groups) into one.',
        'Path compression: while doing find(x), re-point every node visited along the way directly to the root, flattening the tree — this makes future find calls on those nodes O(1)-ish.',
        'Union by rank/size: when merging two trees, attach the smaller/shallower one under the root of the larger/deeper one, instead of arbitrarily — this keeps trees from becoming tall, skinny chains.',
        'With both optimizations, find and union run in "amortized inverse-Ackermann time" — for any practical input size, this is effectively O(1). You don\'t need to prove this in an interview, just know the two optimizations by name and use them.',
      ],
      example: {
        setup: 'Detecting whether adding edge (2, 3) to a graph with existing edges (0,1) and (1,2) creates a cycle.',
        walkthrough: [
          'Initially: parent = [0, 1, 2, 3] (everyone their own root).',
          'Process edge (0,1): find(0)=0, find(1)=1 — different roots, no cycle. Union: parent[0] = 1 (or attach by rank). Now parent = [1,1,2,3].',
          'Process edge (1,2): find(1)=1, find(2)=2 — different roots, no cycle. Union: parent[2] = 1. Now roughly parent = [1,1,1,3].',
          'Process edge (2,3): find(2) walks 2→1 (root), find(3)=3 — different roots, still no cycle. Union merges them.',
          'If instead we tried to add edge (0,2): find(0)=1, find(2)=1 — same root already! Adding this edge would create a cycle, detected in two find() calls instead of a full graph traversal.',
        ],
      },
      code: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # path compression
        return self.parent[x]

    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return False  # already connected -> would create a cycle
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        return True`,
      pitfalls: [
        'Forgetting path compression (find without re-pointing to the root) — still correct, but degrades toward O(n) per call on adversarial inputs instead of near-O(1).',
        'union(x, y) returning nothing when the roots are already equal — that return value (False = "already connected") is exactly how you detect a cycle would be created, so don\'t discard it.',
        'Reaching for full DFS/BFS to answer many repeated "are these connected" queries when Union-Find answers each one in near-O(1) after an O(n α(n)) ≈ O(n) setup — recognize this as a distinct, faster tool for that specific question shape.',
      ],
    },
    keyIdeas: [
      'find(x): walk parent pointers to the group\'s root. union(x, y): merge two groups\' roots.',
      'Path compression + union by rank together make both operations near-O(1) in practice.',
      'union(x, y) returning "already same root" is exactly how you detect a cycle.',
      'The right tool specifically for repeated "are these connected?" queries — faster than re-running DFS/BFS each time.',
    ],
    problems: [
      { title: 'Number of Provinces', difficulty: 'Medium', url: LC('number-of-provinces'), note: 'revisit with Union-Find' },
      { title: 'Redundant Connection', difficulty: 'Medium', url: LC('redundant-connection'), note: 'revisit — union() returning false is the answer' },
      { title: 'Accounts Merge', difficulty: 'Medium', url: LC('accounts-merge') },
      { title: 'Number of Connected Components in an Undirected Graph', difficulty: 'Medium', url: LC('number-of-connected-components-in-an-undirected-graph') },
    ],
  },

  dijkstra: {
    id: 'dijkstra',
    title: "Dijkstra's Algorithm",
    week: 5,
    day: 31,
    category: 'Graphs',
    summary:
      'Finding shortest paths when edges have different (non-negative) costs — plain BFS assumes every edge costs 1, Dijkstra generalizes that.',
    lesson: {
      intro:
        'Plain BFS finds shortest paths by edge *count*, which only works when every edge has equal weight. Dijkstra\'s algorithm finds shortest paths by total *cost*, when edges can have different non-negative weights (e.g., flight prices, road distances). The key idea: always expand the closest not-yet-finalized node next, using a min-heap (day 20, Python\'s heapq) instead of a plain queue.',
      steps: [
        'Maintain a distances dict, initialized to infinity for every node except the start (0). Use a heapq list holding (distance, node) tuples, seeded with (0, start) — heapq compares tuples element by element, so it naturally orders by distance first.',
        'Repeatedly pop the smallest-distance entry from the heap. If you\'ve already finalized this node with a smaller distance, skip it (a node can appear in the heap multiple times with stale entries). Otherwise, this pop\'s distance is that node\'s true shortest distance — finalized, and won\'t change again.',
        "For each neighbor, compute candidate = current node's distance + edge weight to neighbor. If candidate is better than the neighbor's currently known distance, update it (this is called \"relaxing\" the edge) and push (candidate, neighbor) onto the heap.",
        'This only works correctly with non-negative weights — a negative edge could make a "finalized" shortest path wrong after the fact, since the greedy "always expand the closest" assumption breaks down. (Graphs with negative weights need Bellman-Ford, outside this plan\'s scope but worth knowing by name.)',
        'Complexity: O((V + E) log V) with a binary heap — each edge can trigger one heap push (O(log V)), and there are E edges.',
      ],
      example: {
        setup: 'Shortest distance from A, graph: A→B (4), A→C (1), C→B (1), B→D (1), C→D (5).',
        walkthrough: [
          'Heap: [(0,A)]. Pop (0,A) — finalize A=0. Relax: B candidate 0+4=4 (better than ∞, update), C candidate 0+1=1 (update). Heap: [(1,C),(4,B)].',
          'Pop (1,C) — finalize C=1. Relax: B candidate 1+1=2 (better than 4! update), D candidate 1+5=6 (update). Heap: [(2,B),(4,B) stale,(6,D)].',
          'Pop (2,B) — finalize B=2 (the (4,B) entry still sitting in the heap is now stale and will be skipped later). Relax: D candidate 2+1=3 (better than 6! update). Heap: [(3,D),(4,B) stale,(6,D) stale].',
          'Pop (3,D) — finalize D=3. Final distances: A=0, B=2, C=1, D=3 — note B\'s true shortest path went through C, not the direct A→B edge, which is exactly why relaxing continues even after a node is first reached.',
        ],
      },
      code: `import heapq

def dijkstra(graph, start):
    # graph: dict[node, list[(neighbor, weight)]]
    dist = {node: float('inf') for node in graph}
    dist[start] = 0

    heap = [(0, start)]  # heapq orders tuples by first element (distance)

    while heap:
        d, node = heapq.heappop(heap)
        if d > dist[node]:
            continue  # stale entry, already found better

        for neighbor, weight in graph[node]:
            candidate = d + weight
            if candidate < dist[neighbor]:
                dist[neighbor] = candidate
                heapq.heappush(heap, (candidate, neighbor))

    return dist`,
      pitfalls: [
        'Applying Dijkstra to a graph with negative edge weights — the greedy "closest node is finalized" assumption silently breaks, giving wrong answers with no error.',
        'Forgetting the stale-entry check (if d > dist[node]: continue) — without it, you may re-process a node using an outdated, larger distance.',
        'Using a plain queue instead of a heap — that gives you BFS again, which is only correct for unweighted (or equal-weight) graphs.',
        'Pushing (distance, node) tuples where node is itself a non-comparable object (rare here, but common with custom classes) — if two distances tie, heapq falls through to comparing the second element, which can throw. Keep nodes as plain ints/strings, or add a tiebreaker.',
      ],
    },
    keyIdeas: [
      'Generalizes BFS to weighted graphs: always expand the closest not-yet-finalized node next, via a min-heap.',
      '"Relax" an edge: update a neighbor\'s distance if going through the current node is cheaper than what\'s known so far.',
      'Requires non-negative weights — negative weights need a different algorithm (Bellman-Ford).',
      'O((V + E) log V) with a binary heap.',
    ],
    problems: [
      { title: 'Network Delay Time', difficulty: 'Medium', url: LC('network-delay-time'), note: 'textbook Dijkstra' },
      { title: 'Cheapest Flights Within K Stops', difficulty: 'Medium', url: LC('cheapest-flights-within-k-stops') },
      { title: 'Path with Maximum Probability', difficulty: 'Medium', url: LC('path-with-maximum-probability') },
      { title: 'Swim in Rising Water', difficulty: 'Hard', url: LC('swim-in-rising-water') },
    ],
  },

  mst: {
    id: 'mst',
    title: 'Minimum Spanning Trees',
    week: 5,
    day: 32,
    category: 'Graphs',
    summary:
      'Connecting every node in a weighted graph with the least total edge cost, using either Union-Find (Kruskal) or a min-heap (Prim) — both patterns you already have.',
    lesson: {
      intro:
        'A minimum spanning tree (MST) connects all nodes of a weighted, undirected graph using a subset of its edges, with no cycles, at the lowest possible total edge weight. Two classic algorithms solve this, and both are really just yesterday\'s and last week\'s tools applied to a new question — that\'s worth noticing, since it\'s a good example of how a small toolkit combines to solve "new" problems.',
      steps: [
        "Kruskal's algorithm: sort all edges by weight, ascending. Walk through them in order, and add an edge to the MST only if its two endpoints aren't already connected (checked with Union-Find, day 30) — this greedily picks the cheapest edge that doesn't create a cycle. Stop once you've added (V - 1) edges (enough to connect V nodes with no cycles).",
        "Prim's algorithm: start from any node, and repeatedly add the cheapest edge that connects the growing tree to a new, not-yet-included node — using a min-heap of (weight, node) candidates, exactly like Dijkstra's relaxation step, but tracking \"cheapest edge to reach this node\" rather than \"shortest distance from start.\"",
        "Kruskal's is usually easier to reason about and code from scratch (sort + Union-Find); Prim's can be more efficient on dense graphs. Either is acceptable in an interview — pick whichever you can implement confidently under pressure.",
        'Complexity: Kruskal\'s is O(E log E) dominated by the sort; Prim\'s with a binary heap is O(E log V), the same shape as Dijkstra.',
      ],
      example: {
        setup: "Kruskal's on 4 nodes (A,B,C,D) with edges: A-B(1), B-C(2), A-C(3), C-D(4), B-D(5).",
        walkthrough: [
          'Sort edges by weight: A-B(1), B-C(2), A-C(3), C-D(4), B-D(5).',
          'A-B(1): different components (Union-Find), add it. MST so far: {A-B}, 1 edge.',
          'B-C(2): B and C in different components, add it. MST: {A-B, B-C}, 2 edges.',
          'A-C(3): A and C are now in the *same* component (via A-B-C) — adding this would create a cycle, skip.',
          'C-D(4): C and D in different components, add it. MST: {A-B, B-C, C-D}, 3 edges = V-1 = 4-1, done. Total weight: 1+2+4=7.',
        ],
      },
      code: `def kruskal_mst(num_nodes, edges):
    # edges: list of (u, v, weight)
    sorted_edges = sorted(edges, key=lambda e: e[2])
    uf = UnionFind(num_nodes)
    total_weight = 0
    mst_edges = []

    for u, v, weight in sorted_edges:
        if uf.union(u, v):  # True means they weren't already connected
            total_weight += weight
            mst_edges.append((u, v, weight))
            if len(mst_edges) == num_nodes - 1:
                break
    return total_weight, mst_edges`,
      pitfalls: [
        'Forgetting that a spanning tree needs exactly V - 1 edges — adding more would create a cycle by definition, and this count is a useful sanity check / early-stop condition.',
        'Using Dijkstra instinctively for "connect everything cheaply" problems — Dijkstra minimizes distance *from one source to each node*, while MST minimizes *total edge weight to connect all nodes*. They solve different questions and can give different edge sets.',
        'Running MST algorithms on a directed graph — MST is defined for undirected graphs; directed equivalents exist (minimum arborescence) but are out of scope here.',
      ],
    },
    keyIdeas: [
      "Kruskal's: sort edges, greedily add the cheapest one that doesn't create a cycle (via Union-Find).",
      "Prim's: grow a tree by always adding the cheapest edge to a new node (via a min-heap).",
      'A spanning tree always has exactly V - 1 edges.',
      'MST minimizes total connection cost — a different question from Dijkstra\'s single-source shortest path.',
    ],
    problems: [
      { title: 'Min Cost to Connect All Points', difficulty: 'Medium', url: LC('min-cost-to-connect-all-points') },
      { title: 'Connecting Cities With Minimum Cost', difficulty: 'Medium', url: LC('connecting-cities-with-minimum-cost') },
    ],
  },

  intervals: {
    id: 'intervals',
    title: 'Intervals',
    week: 5,
    day: 33,
    category: 'Patterns',
    summary:
      'Sort by start (or end) time, then sweep once — nearly every interval problem follows this same skeleton.',
    lesson: {
      intro:
        'An interval problem gives you ranges — [start, end] pairs like meeting times — and asks you to merge, count overlaps, or schedule them. Almost the entire category collapses to one recipe: sort the intervals in a specific order, then walk through once comparing each interval to what you\'ve built up so far.',
      steps: [
        'Sort by start time first, in nearly every interval problem — this ensures that once you\'ve moved past an interval, nothing later can start before it, which is what makes a single left-to-right sweep sufficient.',
        'Merge pattern: keep a "current merged interval." For each next interval, if its start is ≤ the current merged interval\'s end, they overlap — extend the current one\'s end to the max of the two ends. Otherwise, the current merged interval is finalized (push it to results) and the next interval becomes the new current one.',
        'Greedy scheduling ("max non-overlapping intervals" / "min removals to eliminate overlaps"): sort by *end* time instead of start. Greedily keep an interval if its start is ≥ the last kept interval\'s end — always preferring the interval that frees up the earliest end time leaves the most room for future intervals. (This is a specific, provably-correct greedy — see tomorrow\'s lesson for why this reasoning generalizes.)',
        'A sweep-line with a running "active count": to find, e.g., the maximum number of overlapping intervals at any point in time, convert each interval into a +1 event at its start and a -1 event at its end, sort all events by time, and sweep through summing — the running sum\'s peak is the answer. This generalizes intervals to "meeting room" style resource-counting questions.',
      ],
      example: {
        setup: 'Merging intervals [[1,3], [2,6], [8,10], [15,18]] (already sorted by start).',
        walkthrough: [
          'current = [1,3]. Next [2,6]: 2 ≤ 3 (current\'s end) → overlap, extend current to [1, max(3,6)] = [1,6].',
          'Next [8,10]: 8 > 6 (current\'s end) → no overlap. Finalize [1,6] into results. current = [8,10].',
          'Next [15,18]: 15 > 10 → no overlap. Finalize [8,10]. current = [15,18].',
          'End of input: finalize [15,18]. Result: [[1,6], [8,10], [15,18]].',
        ],
      },
      code: `def merge(intervals):
    if not intervals:
        return []
    sorted_intervals = sorted(intervals, key=lambda iv: iv[0])
    result = [sorted_intervals[0]]

    for start, end in sorted_intervals[1:]:
        current = result[-1]
        if start <= current[1]:
            current[1] = max(current[1], end)  # overlap, extend
        else:
            result.append([start, end])  # no overlap, start a new group
    return result`,
      pitfalls: [
        'Forgetting to sort first — this pattern only works because sorting guarantees you never need to "look back" at an earlier interval once you\'ve moved past it.',
        'Using strict < instead of <= (or vice versa) when checking overlap — decide up front whether touching endpoints (e.g., [1,3] and [3,5]) count as overlapping for the specific problem, and match your comparison to that.',
        'Sorting by start time for the "max non-overlapping" scheduling variant, when it actually needs sorting by *end* time — mixing these up is the most common interval-pattern mistake.',
      ],
    },
    keyIdeas: [
      'Sort by start time first for merge-style problems; nothing later can start before an already-passed interval.',
      'Merge: extend the current group\'s end, or finalize it and start a new group.',
      'Greedy scheduling (max non-overlapping): sort by *end* time instead.',
      'Sweep-line with +1/-1 events finds peak overlap count — generalizes to meeting-room style problems.',
    ],
    problems: [
      { title: 'Merge Intervals', difficulty: 'Medium', url: LC('merge-intervals') },
      { title: 'Insert Interval', difficulty: 'Medium', url: LC('insert-interval') },
      { title: 'Non-overlapping Intervals', difficulty: 'Medium', url: LC('non-overlapping-intervals') },
      { title: 'Meeting Rooms II', difficulty: 'Medium', url: LC('meeting-rooms-ii') },
      { title: 'Minimum Interval to Include Each Query', difficulty: 'Hard', url: LC('minimum-interval-to-include-each-query') },
    ],
  },

  greedy: {
    id: 'greedy',
    title: 'Greedy Algorithms',
    week: 5,
    day: 34,
    category: 'Patterns',
    summary:
      'Make the locally-optimal choice at each step, and prove (or trust the pattern) that it leads to a globally optimal answer.',
    lesson: {
      intro:
        'A greedy algorithm builds a solution one step at a time, always making the choice that looks best *right now*, and never reconsidering it later. This only produces a correct final answer for problems that have a specific property — "optimal substructure" combined with "the greedy choice never rules out an optimal solution" — which is why greedy isn\'t a universal tool the way, say, DFS is: it happens to work for some problems and silently gives wrong answers for others.',
      steps: [
        'Recognize a greedy-shaped problem: usually a single pass, "maximize/minimize," and no need to reconsider past decisions once made — if a problem seems to require comparing many different orderings of past choices, that\'s a signal for DP (week 6-7), not greedy.',
        'To justify a greedy choice, use an exchange argument: assume some optimal solution *doesn\'t* make your proposed greedy choice, then show you could swap it in without making the solution worse — this is the standard way to convince an interviewer (and yourself) that greedy is valid here, rather than just hoping it works.',
        'Interval scheduling (yesterday\'s "sort by end time" trick) is a canonical example: greedily picking the interval that ends soonest is provably optimal because it leaves the most room for everything after it.',
        'When greedy *doesn\'t* obviously work — you find a counterexample where the locally-best choice leads to a worse overall outcome — that\'s often the signal the problem actually wants dynamic programming, which considers all choices rather than committing early.',
      ],
      example: {
        setup: 'Jump Game: given max-jump-lengths per position, can you reach the last index? nums = [2,3,1,1,4].',
        walkthrough: [
          'Greedy idea: track the farthest index reachable so far. At each position i (only if i is itself reachable, i.e., i ≤ farthest), update farthest = max(farthest, i + nums[i]).',
          'i=0: farthest starts at 0, reachable. nums[0]=2 → farthest = max(0, 0+2) = 2.',
          'i=1: 1 ≤ 2 (reachable). nums[1]=3 → farthest = max(2, 1+3) = 4.',
          'i=2: 2 ≤ 4. nums[2]=1 → farthest = max(4, 2+1) = 4 (no improvement).',
          'By the time we\'d check i=3 and i=4, farthest is already 4, which is the last index (length-1=4) — reachable, return true. No need to actually try every combination of jump choices; tracking the single best "farthest reachable" greedily is enough.',
        ],
      },
      code: `def can_jump(nums):
    farthest = 0
    for i, num in enumerate(nums):
        if i > farthest:
            return False  # this position is unreachable
        farthest = max(farthest, i + num)
    return True`,
      pitfalls: [
        'Applying greedy without checking it actually holds for the problem — always sanity-check with a small counterexample attempt before committing; if you can\'t find one after trying, that\'s (weak) evidence greedy might work, but articulating *why* (the exchange argument) is stronger.',
        'Confusing "greedy" with "brute force with early exit" — true greedy never backtracks or reconsiders; if your solution needs to undo a choice, it\'s backtracking or DP, not greedy.',
        'Assuming sorting + greedy is always O(n log n) and therefore "the fast solution" — that\'s only true if greedy is actually valid for the problem; an invalid greedy is fast *and wrong*, which is worse than a correct but slower DP.',
      ],
    },
    keyIdeas: [
      'Make the locally-best choice at each step, never reconsider it — only valid for problems with the right structural property.',
      'Justify greedy with an exchange argument: show swapping in your choice can\'t make an optimal solution worse.',
      'Signal: single pass, maximize/minimize, no need to revisit past decisions.',
      'If you find a counterexample, that\'s the signal to switch to dynamic programming instead.',
    ],
    problems: [
      { title: 'Maximum Subarray', difficulty: 'Medium', url: LC('maximum-subarray') },
      { title: 'Jump Game', difficulty: 'Medium', url: LC('jump-game') },
      { title: 'Jump Game II', difficulty: 'Medium', url: LC('jump-game-ii') },
      { title: 'Gas Station', difficulty: 'Medium', url: LC('gas-station') },
      { title: 'Hand of Straights', difficulty: 'Medium', url: LC('hand-of-straights') },
      { title: 'Partition Labels', difficulty: 'Medium', url: LC('partition-labels') },
      { title: 'Valid Parenthesis String', difficulty: 'Medium', url: LC('valid-parenthesis-string') },
    ],
  },

  'week5-review-mock': {
    id: 'week5-review-mock',
    title: 'Review & Mock Interview',
    week: 5,
    day: 35,
    category: 'Review',
    isReview: true,
    summary:
      "You now have the complete graph toolkit. Consolidate, then run a mock interview focused on a graph or interval/greedy problem.",
    keyIdeas: [
      "Re-derive Union-Find's find/union with path compression and union by rank from a blank file.",
      "Re-derive Dijkstra's relaxation step and explain out loud why it requires non-negative weights.",
      'Run a mock interview using a graph, interval, or greedy problem you haven\'t seen before.',
      'Spaced repetition: re-solve one backtracking problem from week 4 and one tree problem from week 3.',
    ],
    problems: [],
  },
}
