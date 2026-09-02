import { LC } from '../lc'

export const WEEK4_META = {
  id: 4,
  title: 'Backtracking & Graph Basics',
  goal: 'Learn systematic brute force (backtracking), then step into graphs from the ground up — terminology, representations, DFS, and BFS.',
  dayIds: ['backtracking-1', 'backtracking-2', 'graphs-intro', 'graph-dfs', 'graph-bfs', 'graph-practice', 'week4-review'],
}

export const WEEK4_TOPICS = {
  'backtracking-1': {
    id: 'backtracking-1',
    title: 'Backtracking Fundamentals',
    week: 4,
    day: 22,
    category: 'Data Structures',
    summary:
      'Systematic brute force: build a candidate solution incrementally, and abandon ("backtrack") the moment it can\'t possibly work.',
    lesson: {
      intro:
        'Backtracking explores all possible candidates by building them one choice at a time, and immediately abandoning ("backtracking" out of) any partial candidate that can\'t lead to a valid solution. It\'s implemented as recursion (week 2) where each call represents "having made one more choice," and it\'s the standard tool for "generate all ..." or "find all valid combinations of ..." problems.',
      steps: [
        'The template has three parts at each recursive step: choose (pick an option and add it to the current candidate), explore (recurse to make the next choice), un-choose (remove the option, restoring the candidate to how it was before this call) — that last step is what people forget, and it\'s essential for trying the *next* option correctly.',
        'A base case detects when the candidate is complete (e.g., it has the required length, or covers all positions) — at that point, record a copy of the candidate (not a reference to the mutable array you\'ve been building!) as one valid answer.',
        'Pruning: check constraints as early as possible during "choose," not only once the candidate is complete — this cuts off entire branches of impossible candidates before wasting time exploring them, which is often the difference between a solution finishing in milliseconds vs. timing out.',
        'The state space of most backtracking problems is exponential (O(2ⁿ) for subsets, O(n!) for permutations) — that\'s expected and usually unavoidable, since you\'re genuinely enumerating an exponential number of possibilities. Pruning reduces the constant factor and average case, not the worst-case shape.',
      ],
      example: {
        setup: 'Generating all subsets of [1, 2] using choose/explore/un-choose.',
        walkthrough: [
          'Start with an empty candidate [] and index 0.',
          'At each index, you have two choices: include arr[index] in the candidate, or don\'t — recurse into both.',
          'Path A: don\'t include 1 → don\'t include 2 → candidate is complete: record [].',
          'Backtrack to index 1: include 2 → candidate is complete: record [2]. Un-choose 2 (remove it, candidate is [] again).',
          'Backtrack to index 0: include 1 → candidate is [1]. Recurse to index 1: don\'t include 2 → record [1]. Un-choose (nothing to undo). Include 2 → record [1, 2]. Un-choose 2.',
          'All branches explored: [], [2], [1], [1, 2] — all 2² = 4 subsets, matching the expected O(2ⁿ) count.',
        ],
      },
      code: `def subsets(nums):
    result = []
    candidate = []

    def backtrack(index):
        if index == len(nums):
            result.append(candidate[:])  # copy! candidate keeps mutating after this
            return
        # choice 1: skip nums[index]
        backtrack(index + 1)

        # choice 2: include nums[index]
        candidate.append(nums[index])  # choose
        backtrack(index + 1)           # explore
        candidate.pop()                # un-choose

    backtrack(0)
    return result`,
      pitfalls: [
        'Appending the mutable candidate list itself instead of a copy (candidate[:] or list(candidate)) — every recorded answer ends up pointing at the same list, which keeps changing as backtracking continues, corrupting all your saved results.',
        'Forgetting the "un-choose" step — without it, choices from one branch leak into sibling branches.',
        'Not sorting the input first when duplicate values need to be skipped cleanly (see tomorrow) — without sorting, duplicates aren\'t adjacent and are much harder to detect.',
      ],
    },
    keyIdeas: [
      'Template: choose → explore (recurse) → un-choose. The un-choose step is what people forget.',
      'Push a copy of the candidate when recording an answer, not the mutable array itself.',
      'Prune early — check constraints while building, not only once a candidate is complete.',
      'Exponential time complexity (O(2ⁿ), O(n!)) is expected and correct for "generate all ..." problems.',
    ],
    problems: [
      { title: 'Subsets', difficulty: 'Medium', url: LC('subsets') },
      { title: 'Permutations', difficulty: 'Medium', url: LC('permutations') },
      { title: 'Combination Sum', difficulty: 'Medium', url: LC('combination-sum') },
      { title: 'Letter Combinations of a Phone Number', difficulty: 'Medium', url: LC('letter-combinations-of-a-phone-number') },
    ],
  },

  'backtracking-2': {
    id: 'backtracking-2',
    title: 'Backtracking: Leveling Up',
    week: 4,
    day: 23,
    category: 'Data Structures',
    summary:
      'Harder backtracking: skipping duplicates cleanly, backtracking over a 2D grid, and constraint-heavy problems like N-Queens.',
    lesson: {
      intro:
        'Today applies yesterday\'s choose/explore/un-choose template to trickier shapes: input that contains duplicate values (where naive backtracking produces duplicate answers), backtracking over a grid instead of a flat array (Word Search), and problems with many simultaneous constraints to check at each choice (N-Queens).',
      steps: [
        'Skipping duplicates: sort the input first so equal values become adjacent. At each recursion level, skip a value if it equals the previous value *at the same recursion depth* (i.e., you already explored "including this value" via an earlier equal element in this position) — the check is typically if i > start and nums[i] == nums[i-1]: continue.',
        'Backtracking on a grid (Word Search): "choose" means moving to an adjacent cell and marking it visited (often by temporarily overwriting it with a sentinel character); "un-choose" means restoring the original character — this is the grid equivalent of push/pop on a candidate array.',
        'Heavy-constraint problems (N-Queens): instead of checking all constraints from scratch at every step, maintain running trackers (e.g., sets of occupied columns and diagonals) so each placement check is O(1) rather than O(n) — this turns an already-exponential search into a *practically* faster one.',
        'When a problem asks to "return one valid answer" rather than "all answers," backtracking can return true/stop immediately on the first success instead of exploring every branch — a meaningful practical speedup even though worst-case complexity is unchanged.',
      ],
      code: `# Word Search: backtracking over a grid
def exist(board, word):
    rows, cols = len(board), len(board[0])

    def backtrack(r, c, i):
        if i == len(word):
            return True
        if r < 0 or r >= rows or c < 0 or c >= cols or board[r][c] != word[i]:
            return False

        temp = board[r][c]
        board[r][c] = '#'  # mark visited (choose)
        found = (
            backtrack(r + 1, c, i + 1) or
            backtrack(r - 1, c, i + 1) or
            backtrack(r, c + 1, i + 1) or
            backtrack(r, c - 1, i + 1)
        )
        board[r][c] = temp  # restore (un-choose)
        return found

    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return True
    return False`,
      pitfalls: [
        'Forgetting to restore the grid cell after exploring — a common source of "works on the first test case, fails on the second" bugs, since the board is left corrupted.',
        'Skipping duplicates with the wrong condition — the check must compare against the *previous sibling at the same recursion level*, not just "did I use this value already anywhere."',
        'Not short-circuiting once a single valid answer is enough — needlessly exploring the full search space when the problem only asked for existence, not all solutions.',
      ],
    },
    keyIdeas: [
      'Sort first, then skip same-depth duplicates to avoid duplicate answers.',
      'Grid backtracking: mark visited on entry, restore on exit — the grid equivalent of push/pop.',
      'Maintain running trackers (sets/counts) so per-choice constraint checks are O(1), not O(n).',
      'Short-circuit ("return true immediately") when only one valid answer is needed, not all of them.',
    ],
    problems: [
      { title: 'Subsets II', difficulty: 'Medium', url: LC('subsets-ii') },
      { title: 'Combination Sum II', difficulty: 'Medium', url: LC('combination-sum-ii') },
      { title: 'Permutations II', difficulty: 'Medium', url: LC('permutations-ii') },
      { title: 'Word Search', difficulty: 'Medium', url: LC('word-search') },
      { title: 'Palindrome Partitioning', difficulty: 'Medium', url: LC('palindrome-partitioning') },
      { title: 'N-Queens', difficulty: 'Hard', url: LC('n-queens') },
    ],
  },

  'graphs-intro': {
    id: 'graphs-intro',
    title: 'Graphs: Terminology & Representation',
    week: 4,
    day: 24,
    category: 'Graphs',
    summary:
      'Before traversing graphs, learn the vocabulary and the two ways to represent one in code — most "graph" interview problems are really grids or relationship lists in disguise.',
    lesson: {
      intro:
        'A graph is a set of nodes (vertices) connected by edges. Unlike a tree, a graph can have cycles, multiple paths between two nodes, and no single "root." Graphs show up far more often than they appear to: a 2D grid is a graph where each cell connects to its neighbors; a list of course prerequisites is a graph where an edge means "must come before."',
      steps: [
        'Directed vs. undirected: a directed edge only goes one way (A → B doesn\'t imply B → A) — think "prerequisite" or "follows." An undirected edge goes both ways — think "friendship" or "road connection."',
        'Weighted vs. unweighted: a weighted edge has a cost/distance associated with it (used by Dijkstra, week 5); an unweighted edge is just "connected or not" (used by plain BFS/DFS).',
        'Adjacency list: a dict where each node stores a list of its directly connected neighbors — e.g., graph["A"] returns ["B", "C"]. This is the most common representation in interviews: O(V + E) space, and iterating a node\'s neighbors is fast. collections.defaultdict(list) removes the need to check "does this key exist yet" on every insert.',
        'Adjacency matrix: a 2D array where matrix[i][j] is 1 (or the weight) if an edge exists between i and j, else 0. O(V²) space regardless of how many edges actually exist — wasteful for sparse graphs, but checking "does this specific edge exist" is O(1) instead of scanning a neighbor list.',
        'A 2D grid is an implicit graph: each cell (r, c) is a node, and its neighbors are the (typically 4) adjacent cells — you don\'t need to build an explicit adjacency list, just compute neighbor coordinates on the fly.',
      ],
      example: {
        setup: 'Representing the directed graph A → B, A → C, B → C as both an adjacency list and matrix.',
        walkthrough: [
          'Adjacency list: {A: [B, C], B: [C], C: []} — reading "who does C point to" is instant (empty list); reading "who points to C" requires scanning every node\'s list (O(V + E) in the worst case) unless you also build a reverse list.',
          'Adjacency matrix (order A, B, C): [[0,1,1], [0,0,1], [0,0,0]] — matrix[0][1]=1 means A → B. Checking "is there an edge A → C" is one lookup: matrix[0][2].',
          'For a sparse graph like this (3 possible edges used out of 6 possible directed pairs), the list uses less memory; for a dense, heavily-interconnected graph, the matrix\'s O(1) edge lookup can be worth the O(V²) space.',
        ],
      },
      code: `from collections import defaultdict

# Adjacency list from a list of edges
def build_graph(edges, directed=False):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
        if not directed:
            graph[v].append(u)
    return graph

# A grid's neighbors are computed, not stored
def grid_neighbors(r, c, rows, cols):
    candidates = [(r+1, c), (r-1, c), (r, c+1), (r, c-1)]
    return [(nr, nc) for nr, nc in candidates if 0 <= nr < rows and 0 <= nc < cols]`,
      pitfalls: [
        'Assuming a graph is undirected when it isn\'t (or vice versa) — always confirm with the interviewer; it changes both the representation and the traversal logic.',
        'Building an O(V²) adjacency matrix for a huge, sparse graph — wastes massive memory when an adjacency list would do.',
        'Forgetting that a grid problem is a graph problem — the "neighbors" are just the up/down/left/right cells, and everything you learn about DFS/BFS on explicit graphs (next two days) applies directly.',
      ],
    },
    keyIdeas: [
      'Directed edges go one way; undirected edges go both ways.',
      'Adjacency list: O(V+E) space, fast neighbor iteration — the default choice in interviews.',
      'Adjacency matrix: O(V²) space, O(1) specific-edge lookup — better for dense graphs.',
      'A 2D grid is an implicit graph — neighbors are computed from coordinates, no explicit list needed.',
    ],
    problems: [
      { title: 'Find the Town Judge', difficulty: 'Easy', url: LC('find-the-town-judge'), note: 'build and reason about a directed graph' },
      { title: 'Find Center of Star Graph', difficulty: 'Easy', url: LC('find-center-of-star-graph') },
    ],
  },

  'graph-dfs': {
    id: 'graph-dfs',
    title: 'Graph DFS',
    week: 4,
    day: 25,
    category: 'Graphs',
    summary:
      'Depth-first search on a graph is tree DFS (week 3) plus one crucial addition: a visited set, since graphs can have cycles.',
    lesson: {
      intro:
        'Graph DFS explores as far as possible down one path before backtracking — the same idea as tree DFS, implemented the same way (recursively, or with an explicit stack). The one addition graphs require that trees didn\'t: because graphs can have cycles (and multiple paths to the same node), you must track visited nodes, or you\'ll loop forever.',
      steps: [
        'Maintain a visited set. Before exploring a node, check if it\'s already in the set — if so, skip it entirely. Otherwise, add it to the set, process it, and recurse into its unvisited neighbors.',
        'DFS is the natural fit for: "does a path exist between A and B," "count connected components / islands," "detect a cycle," and "explore all reachable nodes from a start."',
        'On an adjacency-list graph with V nodes and E edges, DFS visits every node once and scans every edge once → O(V + E) time. Space is O(V) for the visited set plus O(V) worst-case recursion depth.',
        'Cycle detection in a directed graph needs two sets, not one: "fully finished" nodes and "currently in the recursion stack" (in-progress). If you reach a node that\'s in the current recursion stack, you\'ve found a cycle — reaching an already-*finished* node is fine, it just means multiple paths converge, not a cycle.',
      ],
      example: {
        setup: 'Counting connected components in an undirected graph with edges: {1-2, 2-3, 4-5}. Nodes: 1,2,3,4,5.',
        walkthrough: [
          'visited = {}. Start at node 1 (unvisited) → components count = 1. DFS from 1: mark 1 visited, visit neighbor 2 (mark visited), visit neighbor 3 (mark visited). Node 2 and 3 have no other unvisited neighbors — this DFS call tree is done.',
          'Next unvisited node in the overall node list: node 4 → components count = 2. DFS from 4: mark 4 visited, visit neighbor 5 (mark visited).',
          'Node 3 was already visited when we get to it in the outer loop, so we skip it; same for 2 and 5. Final answer: 2 connected components ({1,2,3} and {4,5}).',
        ],
      },
      code: `def count_components(n, edges):
    graph = {i: [] for i in range(n)}
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)

    visited = set()
    def dfs(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)

    components = 0
    for node in range(n):
        if node not in visited:
            components += 1
            dfs(node)
    return components`,
      pitfalls: [
        'Forgetting the visited set entirely — on a graph with a cycle, this causes infinite recursion (unlike trees, where "no cycles" made this unnecessary).',
        'Marking a node visited *after* recursing into it instead of before — can cause the same node to be processed multiple times or, worse, infinite loops in cyclic graphs.',
        'Conflating "visited" with "currently being processed" in directed-cycle detection — you need both concepts (finished vs. in-progress) to correctly distinguish a real cycle from two paths simply converging on the same node.',
        'Recursive DFS on a graph with a long path can hit Python\'s ~1000-frame recursion limit (see day 11) — for graphs that could be large and chain-like, an iterative DFS with an explicit stack sidesteps this entirely.',
      ],
    },
    keyIdeas: [
      'Same recursive shape as tree DFS, plus a visited set — required because graphs can have cycles.',
      'Mark a node visited when you first reach it, before recursing into neighbors.',
      'O(V + E) time: every node visited once, every edge scanned once.',
      'Directed-cycle detection needs two sets: finished nodes vs. nodes currently in the recursion stack.',
    ],
    problems: [
      { title: 'Number of Provinces', difficulty: 'Medium', url: LC('number-of-provinces') },
      { title: 'Find if Path Exists in Graph', difficulty: 'Easy', url: LC('find-if-path-exists-in-graph') },
      { title: 'Number of Islands', difficulty: 'Medium', url: LC('number-of-islands') },
      { title: 'Clone Graph', difficulty: 'Medium', url: LC('clone-graph') },
      { title: 'Course Schedule', difficulty: 'Medium', url: LC('course-schedule'), note: 'directed-cycle detection' },
    ],
  },

  'graph-bfs': {
    id: 'graph-bfs',
    title: 'Graph BFS',
    week: 4,
    day: 26,
    category: 'Graphs',
    summary:
      'Breadth-first search visits nodes level by level using a queue — the tool for shortest paths in unweighted graphs.',
    lesson: {
      intro:
        'BFS explores a graph outward in rings: first the start node, then everything one edge away, then everything two edges away, and so on. Because it expands uniformly by distance, the first time BFS reaches a node is guaranteed to be via the shortest possible path (in terms of number of edges) — which is exactly why it\'s the standard tool for shortest-path questions on unweighted graphs.',
      steps: [
        'Use a collections.deque (day 10), not a stack. Push the start node and mark it visited immediately (not when it\'s popped) — marking on push, rather than on pop, avoids adding the same node to the queue multiple times before it\'s processed.',
        'Repeatedly pop the front of the queue, process it, and push all of its unvisited neighbors (marking each visited as you push it).',
        'To track shortest distance, either store (node, distance) pairs in the queue, or process the queue one full level at a time: capture the queue\'s current length at the start of a level, pop exactly that many nodes, and increment distance once you\'ve processed the whole batch.',
        'Multi-source BFS: if a problem starts from several nodes simultaneously (e.g., "time for rot to spread from multiple initially-rotten cells"), push all starting nodes into the queue before the first pop, all marked visited at distance 0 — the rest of the algorithm is unchanged.',
        'Same O(V + E) complexity as DFS — the difference is purely the *order* nodes are visited in (by distance from start, vs. by depth down one path), which is what makes BFS correct for shortest-path and DFS not.',
      ],
      example: {
        setup: 'Shortest path (in edges) from node 1 to node 5, graph: 1-2, 1-3, 2-4, 3-4, 4-5.',
        walkthrough: [
          'Queue: [1], visited={1}, distances={1:0}.',
          'Pop 1. Neighbors 2, 3 unvisited → mark visited, distance 1, push. Queue: [2, 3].',
          'Pop 2. Neighbor 4 unvisited → mark visited, distance 2, push. Queue: [3, 4]. (Neighbor 1 already visited, skip.)',
          'Pop 3. Neighbor 4 already visited (just handled via 2) — skip. Queue: [4].',
          'Pop 4. Neighbor 5 unvisited → mark visited, distance 3, push. Queue: [5]. (Neighbors 2, 3 already visited.)',
          'Pop 5 — this is the target, distance 3. Because BFS expands by distance, this is guaranteed to be the shortest possible path length.',
        ],
      },
      code: `from collections import deque

def shortest_path(graph, start, target):
    visited = {start}
    queue = deque([(start, 0)])  # (node, distance)

    while queue:
        node, dist = queue.popleft()
        if node == target:
            return dist
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    return -1  # unreachable`,
      pitfalls: [
        'Marking nodes visited when popped instead of when pushed — allows the same node to be queued multiple times, wasting work (and in some problems, producing wrong distances).',
        'Using DFS when the problem needs a *shortest* path in an unweighted graph — DFS finds *a* path, not necessarily the shortest one; BFS is required for that guarantee.',
        'Using a plain list with .pop(0) for the queue on very large inputs — remember from day 10 that it\'s O(n) per call; use collections.deque if performance matters.',
      ],
    },
    keyIdeas: [
      'Queue-based; expands outward in rings of increasing distance from the start.',
      'Mark visited on push, not on pop, to avoid duplicate queueing.',
      'First time BFS reaches a node = shortest path (in edges) to it, in an unweighted graph.',
      'Multi-source BFS: seed the queue with all starting nodes at distance 0 before the first pop.',
    ],
    problems: [
      { title: 'Rotting Oranges', difficulty: 'Medium', url: LC('rotting-oranges'), note: 'multi-source BFS' },
      { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', url: LC('binary-tree-level-order-traversal'), note: 'revisit — BFS on a tree' },
      { title: '01 Matrix', difficulty: 'Medium', url: LC('01-matrix') },
      { title: 'Word Ladder', difficulty: 'Hard', url: LC('word-ladder') },
    ],
  },

  'graph-practice': {
    id: 'graph-practice',
    title: 'Graph Problems: Islands & Components',
    week: 4,
    day: 27,
    category: 'Graphs',
    summary:
      'Apply DFS/BFS to the most common interview shape — grid-as-graph problems — plus a first look at topological ordering.',
    lesson: {
      intro:
        'Today is deliberately light on new theory: it\'s about recognizing that a large share of "graph" interview problems are really 2D grids, and applying yesterday\'s and the day before\'s DFS/BFS directly, using the grid_neighbors helper pattern from Monday\'s lesson instead of an explicit adjacency list.',
      steps: [
        'The "flood fill" shape (Number of Islands, Max Area of Island): for each unvisited land cell, DFS or BFS outward marking every connected land cell visited, counting or measuring as you go — each cell visited once → O(rows × cols) time.',
        'The "trapped region" shape (Surrounded Regions, Pacific Atlantic Water Flow): instead of checking every cell against every condition (which invites O(n²)-ish thinking), start DFS/BFS from the *boundary* cells that are guaranteed safe/reachable, mark everything reachable from there, and everything unmarked is your answer — flipping the search direction is the key insight.',
        'Course Schedule and its relatives are a preview of topological sort (week 5): a directed graph where an edge A → B means "A must happen before B." Detecting whether all courses can be finished is exactly the directed-cycle detection from Tuesday\'s lesson — if there\'s a cycle, it\'s impossible.',
        'Marking cells visited directly on the input grid (e.g., changing \'1\' to \'0\', or a letter to \'#\') avoids allocating a separate visited set — a common space optimization once you\'re allowed to mutate the input.',
      ],
      code: `def num_islands(grid):
    rows, cols = len(grid), len(grid[0])
    count = 0

    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != '1':
            return
        grid[r][c] = '0'  # mark visited by sinking the island cell
        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)

    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    return count`,
      pitfalls: [
        'Forgetting the boundary checks (r < 0, r >= rows, etc.) before indexing into the grid — this is the grid-DFS equivalent of a None check in tree/graph DFS.',
        '"Trapped region" problems: searching from every interior cell instead of starting from the boundary — technically works but is far more complex to get right; searching from the boundary inward is the standard trick.',
        'Deep recursion on a very large grid can hit Python\'s recursion limit — know that an explicit stack (iterative DFS) or BFS with a deque is a safe fallback if recursion depth becomes a concern.',
      ],
    },
    keyIdeas: [
      'Flood fill: DFS/BFS from each unvisited "land" cell, marking everything connected.',
      '"Trapped region" problems: search from the boundary inward, not from every interior cell outward.',
      'Course scheduling = directed-cycle detection on a prerequisite graph.',
      'Mutating the grid in place ("sinking" visited cells) avoids a separate visited set.',
    ],
    problems: [
      { title: 'Number of Islands', difficulty: 'Medium', url: LC('number-of-islands') },
      { title: 'Max Area of Island', difficulty: 'Medium', url: LC('max-area-of-island') },
      { title: 'Pacific Atlantic Water Flow', difficulty: 'Medium', url: LC('pacific-atlantic-water-flow') },
      { title: 'Surrounded Regions', difficulty: 'Medium', url: LC('surrounded-regions') },
      { title: 'Course Schedule', difficulty: 'Medium', url: LC('course-schedule') },
      { title: 'Course Schedule II', difficulty: 'Medium', url: LC('course-schedule-ii') },
      { title: 'Redundant Connection', difficulty: 'Medium', url: LC('redundant-connection') },
    ],
  },

  'week4-review': {
    id: 'week4-review',
    title: 'Review & Spaced Practice',
    week: 4,
    day: 28,
    category: 'Review',
    isReview: true,
    summary:
      'Consolidate backtracking and graph fundamentals — you\'re now a third of the way through the plan and have every core traversal tool.',
    keyIdeas: [
      'Re-derive the backtracking template (choose/explore/un-choose) from a blank file, on Subsets or Permutations.',
      'Re-implement graph DFS and BFS from scratch, including the visited-set handling, without looking at notes.',
      'Re-solve Number of Islands cold — it\'s the single most representative "grid as graph" problem.',
      'Spaced repetition: re-solve one tree problem from week 3 and one sliding-window problem from week 1.',
    ],
    problems: [],
  },
}
