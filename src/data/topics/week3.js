import { LC } from '../lc'

export const WEEK3_META = {
  id: 3,
  title: 'Linked Lists & Trees',
  goal: 'Level up pointer manipulation with fast/slow techniques, then build trees from the ground up — traversal orders, BSTs, tries, and heaps.',
  dayIds: ['linked-lists-2', 'trees-intro', 'bst', 'trees-practice', 'tries', 'heaps', 'week3-review-mock'],
}

export const WEEK3_TOPICS = {
  'linked-lists-2': {
    id: 'linked-lists-2',
    title: 'Linked Lists, Part 2: Fast & Slow Pointers',
    week: 3,
    day: 15,
    category: 'Data Structures',
    summary:
      'Building on Part 1: two pointers moving at different speeds through a list unlock cycle detection, finding the middle, and in-place reversal.',
    lesson: {
      intro:
        'The fast/slow pointer technique (also called "Floyd\'s tortoise and hare") runs two pointers through a linked list at different speeds — typically slow moves one node at a time, fast moves two. This simple trick answers several classic questions in O(n) time and O(1) space, without needing to know the list\'s length in advance.',
      steps: [
        'Finding the middle: advance slow by 1 and fast by 2 each step. When fast reaches the end, slow is exactly at the middle — because fast covers twice the distance in the same number of steps.',
        'Cycle detection: if a list has a cycle, fast will eventually lap slow and they\'ll land on the same node; if there\'s no cycle, fast simply reaches None first. If they ever meet, there\'s a cycle.',
        'Finding the cycle\'s starting node (once you know a cycle exists): reset one pointer to head, keep the other at the meeting point, then advance both one step at a time — they meet exactly at the cycle\'s start. (This works due to the math of how far each pointer traveled — worth memorizing as a recipe rather than re-deriving under pressure.)',
        'Reversing a list in place: walk through with prev = None and current = head; at each node, save next_node = current.next before overwriting current.next = prev, then advance prev = current, current = next_node. When current is None, prev is the new head.',
        'These techniques combine: e.g., "find the middle, reverse the second half, then compare/merge with the first half" solves palindrome-checking and list-reordering problems without extra memory.',
      ],
      example: {
        setup: 'Detecting a cycle in a linked list where node 4 points back to node 2 (1 → 2 → 3 → 4 → back to 2).',
        walkthrough: [
          'slow and fast both start at node 1.',
          'Step 1: slow → 2, fast → 3.',
          'Step 2: slow → 3, fast → back to 2 (fast went 4 → 2, the cycle link).',
          'Step 3: slow → 4, fast → 3.',
          'Step 4: slow → 2 (via the cycle), fast → 4.',
          'Step 5: slow → 3, fast → 2.',
          'Step 6: slow → 4, fast → 3... eventually slow and fast land on the same node — confirming a cycle without ever using extra memory to track visited nodes.',
        ],
      },
      code: `def has_cycle(head):
    slow = fast = head
    while fast is not None and fast.next is not None:
        slow = slow.next
        fast = fast.next.next
        if slow is fast:
            return True
    return False

def reverse_list(head):
    prev, current = None, head
    while current is not None:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev  # new head`,
      pitfalls: [
        'Checking fast is not None but forgetting fast.next is not None — fast.next.next will raise an AttributeError if fast.next is None.',
        'In reversal, overwriting current.next before saving it into a temp variable — you\'ll lose the rest of the list permanently.',
        'Assuming a hash set to track visited nodes is required for cycle detection — it works (O(n) space) but fast/slow does it in O(1) space, which is the point of this technique.',
      ],
    },
    keyIdeas: [
      'Fast/slow pointers find the middle of a list in one pass, no length pre-count needed.',
      'If fast ever equals slow, the list has a cycle (Floyd\'s algorithm).',
      'Reversal: track prev/current/next, re-point one node at a time, O(1) space.',
      'These combine: "find middle → reverse second half → compare" is a common O(1)-space recipe.',
    ],
    problems: [
      { title: 'Linked List Cycle', difficulty: 'Easy', url: LC('linked-list-cycle') },
      { title: 'Middle of the Linked List', difficulty: 'Easy', url: LC('middle-of-the-linked-list') },
      { title: 'Reorder List', difficulty: 'Medium', url: LC('reorder-list') },
      { title: 'Palindrome Linked List', difficulty: 'Easy', url: LC('palindrome-linked-list') },
      { title: 'Copy List with Random Pointer', difficulty: 'Medium', url: LC('copy-list-with-random-pointer') },
      { title: 'Find the Duplicate Number', difficulty: 'Medium', url: LC('find-the-duplicate-number'), note: 'cycle detection on values, not nodes' },
      { title: 'LRU Cache', difficulty: 'Medium', url: LC('lru-cache'), note: 'hash map + doubly linked list' },
      { title: 'Merge k Sorted Lists', difficulty: 'Hard', url: LC('merge-k-sorted-lists') },
    ],
  },

  'trees-intro': {
    id: 'trees-intro',
    title: 'Trees: Terminology & Traversal',
    week: 3,
    day: 16,
    category: 'Data Structures',
    summary:
      'One of the most-tested topics at Google. Learn the vocabulary and the two fundamental ways to visit every node — DFS and BFS — from scratch.',
    lesson: {
      intro:
        'A tree is a set of nodes connected by edges, with no cycles, starting from one root node. Each node has zero or more children; a node with no children is a leaf. A binary tree restricts each node to at most two children, conventionally called left and right. Trees are really just a special case of graphs (week 4-5) — but because they have no cycles and a clear "top," they get their own simpler traversal rules first.',
      steps: [
        'Depth-first search (DFS): go as deep as possible down one path before backtracking, typically implemented recursively (or with an explicit stack). Three common orders on binary trees: preorder (visit node, then left, then right), inorder (left, node, right), postorder (left, right, node).',
        'Breadth-first search (BFS) / level order: visit all nodes at depth 0, then all at depth 1, then depth 2, and so on — implemented with a queue (day 10), not recursion. Push the root; repeatedly pop the front, process it, and push its children.',
        'Recursive DFS naturally computes a value "from the bottom up": a function like height(node) calls height(node.left) and height(node.right), trusts both are correct, and combines them (1 + max(leftHeight, rightHeight)) — this bottom-up combining pattern answers most "compute X about this tree" questions.',
        'Inorder traversal of a Binary Search Tree (tomorrow\'s topic) visits nodes in sorted order — a fact worth memorizing, it unlocks several BST problems instantly.',
        'A recursive DFS on a tree with n nodes visits each node once → O(n) time; space is O(h) for the call stack, where h is the tree\'s height (O(log n) for a balanced tree, O(n) for a completely skewed one).',
      ],
      example: {
        setup: 'Traversing this small tree in preorder, inorder, postorder, and level order:\n      1\n     / \\\n    2   3\n   /\n  4',
        walkthrough: [
          'Preorder (node, left, right): 1, 2, 4, 3.',
          'Inorder (left, node, right): 4, 2, 1, 3.',
          'Postorder (left, right, node): 4, 2, 3, 1.',
          'Level order / BFS (queue-based, level by level): 1, then 2 and 3, then 4 → 1, 2, 3, 4.',
        ],
      },
      code: `class TreeNode:
    def __init__(self, val, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder(node, result=None):
    if result is None:
        result = []
    if node is None:
        return result   # base case
    result.append(node.val)
    preorder(node.left, result)
    preorder(node.right, result)
    return result

from collections import deque

def level_order(root):
    if root is None:
        return []
    result = []
    queue = deque([root])
    while queue:
        node = queue.popleft()  # O(1) with deque
        result.append(node.val)
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    return result`,
      pitfalls: [
        'Forgetting the base case node is None in recursive DFS — every recursive tree function needs it, since it\'s how recursion "ends" at a leaf\'s missing children.',
        'Confusing DFS order names — preorder/inorder/postorder refers to *when* you process the current node relative to its children, not the direction you traverse.',
        'Using recursion (DFS) when the problem explicitly wants level-by-level results — that\'s a BFS/queue signal, not a DFS one.',
      ],
    },
    keyIdeas: [
      'DFS (recursive): preorder / inorder / postorder — differ in when you visit the current node.',
      'BFS (queue-based): visits level by level — the tool for "level order" or "shortest path in unweighted structure" questions.',
      'Bottom-up recursive pattern: trust the recursive calls on children, then combine their results.',
      'Time O(n), space O(h) where h is tree height — O(log n) balanced, O(n) worst case (skewed).',
    ],
    problems: [
      { title: 'Binary Tree Preorder Traversal', difficulty: 'Easy', url: LC('binary-tree-preorder-traversal') },
      { title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', url: LC('binary-tree-inorder-traversal') },
      { title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', url: LC('maximum-depth-of-binary-tree') },
      { title: 'Invert Binary Tree', difficulty: 'Easy', url: LC('invert-binary-tree') },
      { title: 'Binary Tree Level Order Traversal', difficulty: 'Medium', url: LC('binary-tree-level-order-traversal') },
      { title: 'Same Tree', difficulty: 'Easy', url: LC('same-tree') },
    ],
  },

  bst: {
    id: 'bst',
    title: 'Binary Search Trees',
    week: 3,
    day: 17,
    category: 'Data Structures',
    summary:
      'A binary tree with one extra rule — left < node < right — that turns search, insert, and delete into O(log n) operations, just like binary search on an array.',
    lesson: {
      intro:
        'A binary search tree (BST) is a binary tree where, for every node, everything in its left subtree is smaller and everything in its right subtree is larger. This ordering means you can search the same way you binary-search a sorted array: compare against the current node and go left or right, discarding the other half of the tree each step.',
      steps: [
        'Search: starting at the root, compare the target to the current node. Equal → found. Smaller → go left. Larger → go right. Repeat until found or you fall off the tree (None) → not present. O(h) time, where h is the tree\'s height.',
        'Insert: search for where the value *would* be (following the same left/right logic) until you reach a None spot, then attach a new node there. Also O(h).',
        'Delete is the trickiest: a leaf node is just removed; a node with one child is replaced by that child; a node with two children is replaced by its inorder successor (the smallest value in its right subtree) or inorder predecessor, and that successor is then deleted from its original spot.',
        'Validating a BST: it\'s not enough to check left.val < node.val < right.val locally — every node in the left subtree must be less than node, and every node in the right subtree must be greater. Pass down a valid (min, max) range as you recurse, tightening it at each step.',
        'Because a BST\'s height depends on insertion order, a poorly-built BST (e.g., inserting already-sorted data) degrades to a straight line — O(n) height, O(n) operations. Self-balancing variants (AVL, red-black trees) guarantee O(log n) height, but you\'re not expected to implement one in a typical interview — just know they exist and why.',
      ],
      example: {
        setup: 'Searching for 7 in this BST:\n       5\n      / \\\n     3   8\n    / \\   \\\n   1   4   9',
        walkthrough: [
          'Start at root (5). 7 > 5, go right → node 8.',
          '7 < 8, go left → 8 has no left child (None).',
          'Fell off the tree → 7 is not in this BST. Total comparisons: 2, vs. checking all 5 nodes in a plain tree/array.',
        ],
      },
      code: `def search_bst(root, target):
    node = root
    while node is not None:
        if node.val == target:
            return node
        node = node.left if target < node.val else node.right
    return None

def is_valid_bst(node, low=float('-inf'), high=float('inf')):
    if node is None:
        return True
    if node.val <= low or node.val >= high:
        return False
    return is_valid_bst(node.left, low, node.val) and is_valid_bst(node.right, node.val, high)`,
      pitfalls: [
        'Validating a BST by only checking immediate children, not the full min/max range inherited from ancestors — a common bug that passes small test cases but fails on deeper trees.',
        'Assuming BST operations are always O(log n) — that only holds if the tree is reasonably balanced; a degenerate (linear-chain) BST is O(n).',
        'Forgetting that inorder traversal of a BST yields sorted order — this fact is the key that unlocks several BST problems (e.g., kth smallest element) without extra sorting.',
      ],
    },
    keyIdeas: [
      'Left subtree < node < right subtree, for every node — not just immediate children.',
      'Search/insert are O(h); validate with an inherited (min, max) range, not a local check.',
      'Inorder traversal of a BST always yields values in sorted order.',
      'An unbalanced BST degrades to O(n) — self-balancing trees exist to prevent this, though you won\'t implement one in a typical interview.',
    ],
    problems: [
      { title: 'Search in a Binary Search Tree', difficulty: 'Easy', url: LC('search-in-a-binary-search-tree') },
      { title: 'Insert into a Binary Search Tree', difficulty: 'Medium', url: LC('insert-into-a-binary-search-tree') },
      { title: 'Validate Binary Search Tree', difficulty: 'Medium', url: LC('validate-binary-search-tree') },
      { title: 'Lowest Common Ancestor of a BST', difficulty: 'Medium', url: LC('lowest-common-ancestor-of-a-binary-search-tree') },
      { title: 'Kth Smallest Element in a BST', difficulty: 'Medium', url: LC('kth-smallest-element-in-a-bst') },
      { title: 'Delete Node in a BST', difficulty: 'Medium', url: LC('delete-node-in-a-bst') },
    ],
  },

  'trees-practice': {
    id: 'trees-practice',
    title: 'Tree Problems: Leveling Up',
    week: 3,
    day: 18,
    category: 'Data Structures',
    summary:
      'Harder tree problems that combine yesterday\'s traversal + BST ideas: reconstructing trees from traversals, path sums, and serialization.',
    lesson: {
      intro:
        'Today has no new fundamentals — it\'s about combining DFS, the bottom-up "trust the recursive call" pattern, and BST properties into trickier shapes: building a tree back from its traversals, tracking a running path, and finding the diameter or max path sum, where the answer isn\'t simply what a function returns to its parent.',
      steps: [
        'A common trap: a function that returns "the best path through this node\'s subtree, extending upward to its parent" is not the same as "the best path anywhere in this subtree" — the latter might dip down through both children at once and can never be extended upward. Track the "anywhere" answer in an outer variable (or a second return value) while the recursive function returns only the "extendable upward" value.',
        'Reconstructing a tree from preorder + inorder: preorder\'s first element is always the root. Find that value\'s position in inorder — everything to its left in inorder is the left subtree, everything to its right is the right subtree. Recurse on each side with the corresponding slices of both traversals.',
        'Serialization (tree ↔ string): preorder DFS naturally serializes a tree (record None markers so you know where each subtree ends); deserializing replays the same preorder logic, consuming tokens in the same order they were written.',
        'Level order problems (right side view, zigzag, connect next pointers) are BFS with extra per-level bookkeeping — track level boundaries by recording the queue\'s length at the start of each level\'s processing.',
      ],
      code: `# Binary Tree Maximum Path Sum -- the "extendable vs anywhere" trap
def max_path_sum(root):
    best = float('-inf')

    def extendable(node):
        nonlocal best
        if node is None:
            return 0
        left = max(extendable(node.left), 0)    # ignore negative branches
        right = max(extendable(node.right), 0)
        best = max(best, node.val + left + right)   # "anywhere" -- both sides allowed
        return node.val + max(left, right)           # "extendable upward" -- only one side

    extendable(root)
    return best`,
      pitfalls: [
        'Returning the "anywhere" value from the recursive function instead of tracking it separately — this silently produces wrong answers for paths that don\'t pass through the root.',
        'Forgetting nonlocal best inside a nested helper function — Python closures can *read* an enclosing variable freely, but assigning to it (best = ...) without declaring nonlocal creates a new local variable instead, silently breaking the running-best tracking.',
        'Off-by-one slicing when reconstructing a tree from preorder/inorder arrays — double-check the split index math on a 3-node example before trusting it on the full input.',
        'Forgetting None markers when serializing — without them, you can\'t unambiguously tell where one subtree ends and the next begins during deserialization.',
      ],
    },
    keyIdeas: [
      '"Best path through this node, extendable to its parent" ≠ "best path anywhere in this subtree" — track both when needed.',
      'Preorder\'s first element is always the root; use it to split inorder into left/right subtree ranges.',
      'Serialize with preorder + explicit None markers so deserialization is unambiguous.',
      'Level-order variants: record the queue\'s length at the start of each level to know where one level ends.',
    ],
    problems: [
      { title: 'Diameter of Binary Tree', difficulty: 'Easy', url: LC('diameter-of-binary-tree') },
      { title: 'Balanced Binary Tree', difficulty: 'Easy', url: LC('balanced-binary-tree') },
      { title: 'Subtree of Another Tree', difficulty: 'Easy', url: LC('subtree-of-another-tree') },
      { title: 'Binary Tree Right Side View', difficulty: 'Medium', url: LC('binary-tree-right-side-view') },
      { title: 'Construct Binary Tree from Preorder and Inorder Traversal', difficulty: 'Medium', url: LC('construct-binary-tree-from-preorder-and-inorder-traversal') },
      { title: 'Path Sum II', difficulty: 'Medium', url: LC('path-sum-ii') },
      { title: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', url: LC('binary-tree-maximum-path-sum') },
      { title: 'Serialize and Deserialize Binary Tree', difficulty: 'Hard', url: LC('serialize-and-deserialize-binary-tree') },
    ],
  },

  tries: {
    id: 'tries',
    title: 'Tries (Prefix Trees)',
    week: 3,
    day: 19,
    category: 'Data Structures',
    summary:
      'A tree specialized for strings, where every node represents a shared prefix — turns "does this prefix exist" into O(word length) instead of O(n · word length).',
    lesson: {
      intro:
        'A trie stores a set of strings by sharing common prefixes: each node represents one character position, and has up to 26 (or however many possible characters) children — one per next possible letter. Walking from the root by following a word\'s letters, one child per letter, either lands you on a marked "end of word" node (the word exists) or runs out of matching children (it doesn\'t).',
      steps: [
        'Each node holds: a map or fixed-size array of children (one slot per possible character), and a boolean flag marking "a word ends here."',
        'Insert a word: starting at the root, for each character, follow the existing child if present, or create a new node if not. After the last character, mark that node as end-of-word.',
        'Search for an exact word: follow children letter by letter; if you run out of matching children, it\'s not present. If you reach the end, check the end-of-word flag (a word being a *prefix* of another stored word shouldn\'t count as a match).',
        'Prefix search (autocomplete-style "does anything start with this prefix?"): same walk, but you don\'t need the end-of-word flag — reaching the end of the prefix with all characters matched is enough.',
        'Both insert and search cost O(L) where L is the word/prefix length — completely independent of how many words are stored, which is the trie\'s whole advantage over scanning a list of strings (O(n · L)) or even a hash set (O(L) per exact match, but no way to answer prefix queries at all).',
      ],
      example: {
        setup: 'Inserting "cat" and "car", then searching for prefix "ca" and word "cap".',
        walkthrough: [
          'Insert "cat": root → c (new) → a (new) → t (new, marked end-of-word).',
          'Insert "car": root → c (exists, reuse) → a (exists, reuse) → r (new, marked end-of-word). Note "ca" is now shared by both words — that\'s the space-saving part of a trie.',
          'Prefix search "ca": root → c → a. Both steps found existing children, so "ca" is a valid prefix → true, regardless of the end-of-word flag.',
          'Word search "cap": root → c → a → p. "a" has children t and r, but no p → search fails immediately, false.',
        ],
      },
      code: `class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word):
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = TrieNode()
            node = node.children[ch]
        node.is_end = True

    def search(self, word):
        node = self._walk(word)
        return node is not None and node.is_end

    def starts_with(self, prefix):
        return self._walk(prefix) is not None

    def _walk(self, s):
        node = self.root
        for ch in s:
            if ch not in node.children:
                return None
            node = node.children[ch]
        return node`,
      pitfalls: [
        'Forgetting the is_end flag and treating "reached the end of the characters" as equivalent to "this exact word was inserted" — that conflates search() with starts_with().',
        'Reach for a trie specifically when a problem needs repeated prefix queries; for a single "does this exact string exist" check, a plain hash set is simpler and just as fast.',
        'Combining a trie with DFS/backtracking (e.g., word search on a board) — the trie lets you abandon a search path the instant no stored word can possibly match the prefix built so far, which is the real efficiency win.',
      ],
    },
    keyIdeas: [
      'Each node = one character position; a path from root spells out a prefix.',
      'isEnd flag distinguishes "valid prefix" from "complete word."',
      'Insert/search cost O(word length), independent of how many words are stored.',
      'Reach for a trie when a problem needs repeated prefix queries, not just exact-match lookups.',
    ],
    problems: [
      { title: 'Implement Trie (Prefix Tree)', difficulty: 'Medium', url: LC('implement-trie-prefix-tree') },
      { title: 'Design Add and Search Words Data Structure', difficulty: 'Medium', url: LC('design-add-and-search-words-data-structure') },
      { title: 'Word Search II', difficulty: 'Hard', url: LC('word-search-ii') },
    ],
  },

  heaps: {
    id: 'heaps',
    title: 'Heaps / Priority Queues',
    week: 3,
    day: 20,
    category: 'Data Structures',
    summary:
      'The go-to structure whenever a problem needs repeated access to the min or max element — "top k," scheduling, and streaming-median problems.',
    lesson: {
      intro:
        'A heap is a tree-shaped structure (usually stored in a plain array) that keeps one guarantee: every parent is smaller than its children (a min-heap) or larger than its children (a max-heap) — but siblings and cousins can be in any order. That partial ordering is enough to make "find the min/max" O(1) (it\'s always the root) while insert and remove are cheap, O(log n).',
      steps: [
        'Python\'s standard library ships a min-heap directly: the heapq module operates on a plain list, so there\'s no separate heap class to instantiate. heapq.heappush(heap, val) pushes, heapq.heappop(heap) pops the minimum, and heap[0] peeks at it — you should default to using this in interviews rather than hand-rolling a heap class.',
        'Under the hood (worth understanding for complexity questions and the rare "implement a heap" follow-up): a min-heap stored as an array uses index math instead of pointers — for a node at index i, its children live at 2i+1 and 2i+2, and its parent lives at (i-1)//2.',
        'Insert (push): add the new element at the end of the array, then "bubble up" — repeatedly swap it with its parent as long as it\'s smaller than the parent. This restores the heap property in O(log n), the height of the tree. heapq.heappush does exactly this internally.',
        'Remove the min (pop): the root (index 0) is always the minimum. Move the last element into the root position, shrink the array, then "bubble down" — repeatedly swap it with its smaller child until the heap property holds again. Also O(log n) — this is what heapq.heappop does internally.',
        '"Top k" pattern: maintain a heap of size k as you scan n elements (push each, and pop the worst if size exceeds k). Total cost is O(n log k) — much better than sorting everything (O(n log n)) when k is small. heapq.nlargest(k, iterable) and heapq.nsmallest(k, iterable) do this directly when you just need the final top-k, not a live structure.',
        'heapq is min-heap only. For a max-heap, negate values on the way in and out (heappush(heap, -x), then negate on pop) — or, for tuples like (priority, item), negate just the priority field.',
      ],
      example: {
        setup: 'Inserting 5 into a min-heap array currently [2, 4, 3] (which represents the tree: 2 with children 4 and 3).',
        walkthrough: [
          'Append 5 to the end: [2, 4, 3, 5]. Its index is 3, so its parent is at (3-1)//2 = 1, which holds value 4.',
          '5 > 4, so the heap property already holds (parent smaller than child) — no swap needed, insertion done.',
          'Now popping the min: take root 2, move the last element (5) into its place: [5, 4, 3]. Shrink the array.',
          'Bubble down: 5\'s children are at indices 1 (value 4) and 2 (value 3). The smaller child is 3. Since 5 > 3, swap: [3, 4, 5].',
          'Check again: 3 is now at index 0 with children at indices 1 and 2, values 4 and 5, both larger than 3 — heap property restored, done. heapq.heappush([2,4,3], 5) and heapq.heappop(...) perform exactly this sequence for you.',
        ],
      },
      code: `import heapq

heap = [2, 4, 3]
heapq.heapify(heap)          # O(n) -- turn a plain list into a valid heap in place
heapq.heappush(heap, 5)      # O(log n)
smallest = heapq.heappop(heap)  # O(log n), returns 2

# Top-k pattern: keep a heap of size k while scanning n items -> O(n log k)
def k_largest(nums, k):
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)   # evict the current smallest of the k kept
    return heap  # contains the k largest values, heap[0] is the smallest of them

# Max-heap via negation
max_heap = []
heapq.heappush(max_heap, -5)   # push -value
largest = -heapq.heappop(max_heap)  # negate back on pop`,
      pitfalls: [
        'A heap is only partially ordered — don\'t assume the underlying list is fully sorted; only index 0 is guaranteed to be the min.',
        'Pushing plain values when you need to track *which* item they came from — push tuples like (priority, item) instead; heapq compares tuples element by element, so make sure the first element is always the thing you want ordered by.',
        'Tuple comparison breaks if the second elements aren\'t comparable and the first elements can tie (e.g., (distance, node) where node is a custom object) — add a tiebreaker (like an insertion counter) as a middle element, or ensure the first element is unique enough in practice.',
        'Reaching for a full sort (O(n log n)) when only the top k elements are needed — a size-k heap (O(n log k)) is the better-scaling answer and signals stronger complexity awareness in an interview.',
      ],
    },
    keyIdeas: [
      'Root is always the min — O(1) peek at heap[0]; heappush/heappop are O(log n).',
      'Use Python\'s built-in heapq module directly — no need to hand-roll a heap class in an interview.',
      '"Top k" pattern: maintain a heap of size k while scanning n items → O(n log k); heapq.nlargest/nsmallest do this in one call.',
      'heapq is min-heap only — negate values (or the priority field of a tuple) for max-heap behavior.',
    ],
    problems: [
      { title: 'Kth Largest Element in a Stream', difficulty: 'Easy', url: LC('kth-largest-element-in-a-stream') },
      { title: 'Last Stone Weight', difficulty: 'Easy', url: LC('last-stone-weight') },
      { title: 'K Closest Points to Origin', difficulty: 'Medium', url: LC('k-closest-points-to-origin') },
      { title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: LC('kth-largest-element-in-an-array') },
      { title: 'Task Scheduler', difficulty: 'Medium', url: LC('task-scheduler') },
      { title: 'Design Twitter', difficulty: 'Medium', url: LC('design-twitter') },
      { title: 'Find Median from Data Stream', difficulty: 'Hard', url: LC('find-median-from-data-stream') },
    ],
  },

  'week3-review-mock': {
    id: 'week3-review-mock',
    title: 'Review & Mock Interview',
    week: 3,
    day: 21,
    category: 'Review',
    isReview: true,
    summary:
      'Consolidate three weeks of structures, then run your first full mock interview — 1 medium problem, 35-40 minutes, out loud.',
    keyIdeas: [
      'Re-derive DFS (all three orders) and BFS for trees from scratch, without notes.',
      'Re-implement a min-heap\'s bubble-up/bubble-down from a blank file (even though you\'d use heapq in practice) — this is the piece people forget fastest.',
      'Book (or simulate with a friend) a mock interview: state assumptions, brute force first, then optimize, then state final complexity.',
      'Mix in one spaced-repetition problem from week 1 (hashing or two pointers) and one from week 2 (recursion or linked lists).',
    ],
    problems: [],
  },
}
