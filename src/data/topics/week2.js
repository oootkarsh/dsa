import { LC } from '../lc'

export const WEEK2_META = {
  id: 2,
  title: 'Searching, Stacks & Recursion',
  goal: 'Add binary search and LIFO/FIFO structures to your toolkit, then build a real understanding of recursion from the ground up — it underlies trees, backtracking, and DP later on.',
  dayIds: ['binary-search', 'stacks', 'queues', 'recursion-basics', 'recursion-advanced', 'linked-lists-1', 'week2-review'],
}

export const WEEK2_TOPICS = {
  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    week: 2,
    day: 8,
    category: 'Foundations',
    summary:
      'Not just "search a sorted array" — binary search over an answer space is one of the most Google-favorite tricks for turning O(n) scans into O(log n).',
    lesson: {
      intro:
        'Binary search finds a target in a sorted collection by repeatedly checking the middle element and eliminating half of the remaining possibilities — like guessing a number 1-100 and always being told "higher" or "lower." Because you throw away half the search space each step, it takes only O(log n) checks even for huge n.',
      steps: [
        'Maintain lo and hi pointers spanning the current search range. Compute mid = (lo + hi) // 2 and look at arr[mid].',
        'If arr[mid] equals the target, you\'re done. If arr[mid] is too small, the target must be in the right half, so lo = mid + 1. If too large, hi = mid - 1.',
        'Repeat while lo <= hi. Each iteration cuts the remaining range roughly in half, so after k steps only n / 2^k elements remain — solving n / 2^k = 1 gives k = log₂(n) steps.',
        '"Binary search the answer": the technique generalizes beyond arrays. If you can write a fast, monotonic yes/no check — is_feasible(x) — that flips from false to true (or vice versa) exactly once as x increases, you can binary search over x itself, even if x isn\'t an array index (e.g., "minimum eating speed to finish in time").',
        'Rotated sorted arrays: at least one half of the array (split at mid) is always properly sorted — figure out which half that is, check if the target could be in it, and recurse into the correct half.',
      ],
      example: {
        setup: 'Binary searching for 23 in [4, 8, 15, 16, 23, 42, 56].',
        walkthrough: [
          'lo=0, hi=6, mid=3 → arr[3]=16. 16 < 23, so search the right half: lo = 4.',
          'lo=4, hi=6, mid=5 → arr[5]=42. 42 > 23, so search the left half: hi = 4.',
          'lo=4, hi=4, mid=4 → arr[4]=23. Found it — 3 comparisons instead of scanning up to 7 elements.',
        ],
      },
      code: `def binary_search(arr, target):
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1`,
      pitfalls: [
        'Boundary bugs are the #1 source of errors here: be deliberate about lo <= hi vs. lo < hi, and mid + 1 / mid - 1 vs. mid — trace through a 2-element array by hand to sanity-check your choice.',
        '(lo + hi) // 2 can theoretically overflow in languages with fixed-size integers (use lo + (hi - lo) // 2 as a habit) — not a practical issue in Python, since ints are arbitrary precision, but interviewers may ask why the habit exists.',
        'Binary search requires the array (or the answer space) to be monotonic/sorted — using it on unsorted data silently gives wrong answers, not an error. (Python\'s bisect module implements this directly — bisect_left/bisect_right — worth knowing exists, even when you hand-roll the loop for an interview.)',
      ],
    },
    keyIdeas: [
      'Classic form: search a sorted array for a target in O(log n).',
      '"Binary search the answer": if is_feasible(x) is monotonic, binary search the value of x directly.',
      'Rotated arrays: identify which half is properly sorted, then decide which half to recurse into.',
      'Always nail the boundary conditions — trace a tiny example by hand before trusting your loop.',
    ],
    problems: [
      { title: 'Binary Search', difficulty: 'Easy', url: LC('binary-search') },
      { title: 'Search a 2D Matrix', difficulty: 'Medium', url: LC('search-a-2d-matrix') },
      { title: 'Koko Eating Bananas', difficulty: 'Medium', url: LC('koko-eating-bananas'), note: 'binary search the answer' },
      { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', url: LC('find-minimum-in-rotated-sorted-array') },
      { title: 'Search in Rotated Sorted Array', difficulty: 'Medium', url: LC('search-in-rotated-sorted-array') },
      { title: 'Time Based Key-Value Store', difficulty: 'Medium', url: LC('time-based-key-value-store') },
      { title: 'Median of Two Sorted Arrays', difficulty: 'Hard', url: LC('median-of-two-sorted-arrays') },
    ],
  },

  stacks: {
    id: 'stacks',
    title: 'Stacks',
    week: 2,
    day: 9,
    category: 'Data Structures',
    summary:
      'LIFO (last in, first out) order is the natural fit for matching/nesting problems and "next greater element" questions via a monotonic stack.',
    lesson: {
      intro:
        'A stack only allows adding and removing from one end — the "top" — like a stack of plates. The last item pushed is the first popped (LIFO). In Python, a plain list works perfectly as a stack: .append() adds to the top, .pop() removes from the top, both O(1).',
      steps: [
        'Use a stack whenever a problem involves matching or nesting — parentheses, tags, "most recent unmatched thing." Push an opening item; when you see its closing counterpart, pop and check it matches.',
        'Monotonic stack: keep the stack\'s values increasing (or decreasing) from bottom to top by popping off anything that violates the order before pushing the new element. This answers "next greater/smaller element" for every position in one O(n) pass total — each element is pushed and popped at most once.',
        'A stack plus one extra piece of tracking (e.g., a parallel stack of running minimums) gives O(1) retrieval of the min/max seen so far, without rescanning (Min Stack).',
        'Recursion (day 11-12) is secretly implemented using a call stack — anything you can do recursively, you can also do iteratively with an explicit stack, which is sometimes necessary to avoid stack-overflow on deep inputs.',
      ],
      example: {
        setup: 'Finding the next greater element for each number in [2, 1, 2, 4, 3] using a monotonic (decreasing) stack.',
        walkthrough: [
          'Stack holds indices; we keep it so the values at those indices are decreasing from bottom to top.',
          'i=0 (val 2): stack empty, push 0. Stack: [0].',
          'i=1 (val 1): 1 < arr[stack top]=2, so push. Stack: [0,1].',
          'i=2 (val 2): 2 > arr[1]=1 → pop 1, answer[1] = 2 (found its next greater). Now 2 > arr[0]? No, 2 == 2, not greater, so push. Stack: [0,2].',
          'i=3 (val 4): 4 > arr[2]=2 → pop 2, answer[2] = 4. 4 > arr[0]=2 → pop 0, answer[0] = 4. Stack empty, push 3. Stack: [3].',
          'i=4 (val 3): 3 < arr[3]=4, push. Stack: [3,4]. End of array — anything left on the stack has no next greater element.',
          'Total pops + pushes across the whole run is at most 2n → O(n), even though it looks like nested work.',
        ],
      },
      code: `def next_greater_element(arr):
    result = [-1] * len(arr)
    stack = []  # holds indices, values decreasing bottom to top
    for i in range(len(arr)):
        while stack and arr[stack[-1]] < arr[i]:
            idx = stack.pop()
            result[idx] = arr[i]
        stack.append(i)
    return result`,
      pitfalls: [
        'Forgetting to check that stack is non-empty before peeking/popping — an empty-stack check belongs in every while condition.',
        'Pushing values instead of indices when you need to know *where* an element was, not just its value.',
        'Mixing up "increasing" vs "decreasing" monotonic stacks — decide up front which one the problem needs (next greater → decreasing stack; next smaller → increasing stack) and stick to it.',
      ],
    },
    keyIdeas: [
      'LIFO order via list .append()/.pop(), both O(1).',
      'Matching/nesting problems: push on open, pop-and-check on close.',
      'Monotonic stack answers "next greater/smaller element" for every position in one O(n) pass.',
      'A stack plus a tracking structure gives O(1) min/max retrieval (Min Stack).',
    ],
    problems: [
      { title: 'Valid Parentheses', difficulty: 'Easy', url: LC('valid-parentheses') },
      { title: 'Min Stack', difficulty: 'Medium', url: LC('min-stack') },
      { title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', url: LC('evaluate-reverse-polish-notation') },
      { title: 'Generate Parentheses', difficulty: 'Medium', url: LC('generate-parentheses') },
      { title: 'Daily Temperatures', difficulty: 'Medium', url: LC('daily-temperatures') },
      { title: 'Car Fleet', difficulty: 'Medium', url: LC('car-fleet') },
      { title: 'Largest Rectangle in Histogram', difficulty: 'Hard', url: LC('largest-rectangle-in-histogram') },
    ],
  },

  queues: {
    id: 'queues',
    title: 'Queues & Deques',
    week: 2,
    day: 10,
    category: 'Data Structures',
    summary:
      'FIFO (first in, first out) order — the natural structure for "process things in the order they arrived," and the engine behind BFS in week 4.',
    lesson: {
      intro:
        'A queue only adds at one end (the "back") and removes from the other (the "front") — like a checkout line. The first item added is the first removed (FIFO). A deque (double-ended queue) allows O(1) adds and removes at both ends, making it strictly more flexible.',
      steps: [
        'Python lists are a poor queue in practice: .append() (add to back) is O(1), but .pop(0) (remove from front) is O(n) because every remaining element has to shift down one index. Python\'s standard library solves this directly: collections.deque is implemented as a doubly linked list of blocks, giving O(1) appends and pops at *both* ends — append()/pop() on the right, appendleft()/popleft() on the left.',
        'A queue is the right structure whenever "process in arrival order" or "level by level" matters — most importantly, breadth-first search (BFS) on trees and graphs (week 4) uses a queue (deque, using only popleft() and append()) to visit nodes level by level.',
        'A monotonic deque (keeping values increasing or decreasing from front to back, like a monotonic stack but at both ends) solves "maximum of every sliding window of size k" in O(n) total, instead of O(n·k) from recomputing the max each time — this uses deque\'s O(1) operations at both ends.',
        'A circular buffer (fixed-size array with wraparound indices) is how queues are often implemented efficiently in lower-level languages — good to know it exists even though Python\'s deque already handles this for you.',
      ],
      example: {
        setup: 'Sliding window maximum: for [1, 3, -1, -3, 5, 3, 6, 7] with window size 3, find the max of every window using a monotonic deque of indices.',
        walkthrough: [
          'The deque stores indices; we keep the values at those indices decreasing from front to back, so the front is always the current window\'s maximum.',
          'Before adding a new index, pop from the back any indices whose values are smaller than the new value (they can never be the max again).',
          'Before reading the front as "the max," pop it from the front if it has fallen outside the current window (index too old).',
          'Each index is pushed once and popped at most once across the whole run → O(n) total, even though a max is produced for every window.',
        ],
      },
      code: `from collections import deque

def max_sliding_window(nums, k):
    dq = deque()  # indices, values decreasing front to back
    result = []
    for i, num in enumerate(nums):
        while dq and dq[0] <= i - k:
            dq.popleft()  # drop out-of-window front
        while dq and nums[dq[-1]] < num:
            dq.pop()  # drop smaller tail
        dq.append(i)
        if i >= k - 1:
            result.append(nums[dq[0]])
    return result`,
      pitfalls: [
        'Using list.pop(0) in a hot loop for a large queue — it\'s O(n) per call, silently turning an "O(n) algorithm" into O(n²). Import collections.deque and use popleft() instead.',
        'Forgetting to evict indices that have slid outside the window in monotonic-deque problems — always check the front against the window bounds first.',
        'Confusing a queue (FIFO, for BFS) with a stack (LIFO, for DFS) — picking the wrong one silently changes traversal order rather than throwing an error.',
      ],
    },
    keyIdeas: [
      'FIFO order: process/visit things in the order they were added.',
      'Avoid list.pop(0) in performance-sensitive queues — it\'s O(n). Use collections.deque for O(1) operations at both ends.',
      'Queues power BFS (level-by-level traversal) — critical for week 4.',
      'Monotonic deques solve fixed-window max/min problems in O(n) total.',
    ],
    problems: [
      { title: 'Implement Queue using Stacks', difficulty: 'Easy', url: LC('implement-queue-using-stacks') },
      { title: 'Design Circular Queue', difficulty: 'Medium', url: LC('design-circular-queue') },
      { title: 'Sliding Window Maximum', difficulty: 'Hard', url: LC('sliding-window-maximum'), note: 'revisit with the deque approach above' },
    ],
  },

  'recursion-basics': {
    id: 'recursion-basics',
    title: 'Recursion Fundamentals',
    week: 2,
    day: 11,
    category: 'Data Structures',
    summary:
      'The mental model behind trees, backtracking, and half of dynamic programming: define a problem in terms of a smaller version of itself.',
    lesson: {
      intro:
        'A recursive function calls itself on a smaller version of the same problem, until it reaches a base case simple enough to answer directly. Every recursive call is pushed onto the call stack; when a call returns, control (and its result) pops back to whoever called it. The trick to writing recursion confidently is trusting that the recursive call "just works" for the smaller input, without mentally tracing the entire tree of calls.',
      steps: [
        'Every recursive function needs two parts: a base case (the smallest input, answered directly, no further recursion) and a recursive case (breaks the problem into a smaller version of itself, calls itself, and combines the result).',
        'The recursive case must provably shrink toward the base case every call — otherwise you get infinite recursion and a stack overflow.',
        'Write the function by asking: "if I already had the answer for a smaller input, how would I use it to build the answer for this input?" — this is the "trust the recursion" mindset.',
        'Each active call occupies a frame on the call stack holding its local variables; this is why recursion has O(depth) space cost even when it does no explicit array allocation.',
        'Python caps recursion depth at 1000 by default (sys.getrecursionlimit()) — much lower than most languages\' practical stack limits. A recursive solution that\'s correct but recurses on every element of a 5,000-element input will crash with a RecursionError. You can raise the limit with sys.setrecursionlimit(n), but it\'s better to recognize when an iterative rewrite (with an explicit stack) is the safer choice, especially for linked-list and tree problems where depth equals input size.',
        'Trace at least one small example by hand (draw the call tree) until the base-case-then-unwind flow feels concrete — this is the fastest way to build intuition.',
      ],
      example: {
        setup: 'Computing factorial(4) = 4 × 3 × 2 × 1 recursively.',
        walkthrough: [
          'factorial(4) calls factorial(3) and will multiply its result by 4, once it comes back.',
          'factorial(3) calls factorial(2) and will multiply its result by 3.',
          'factorial(2) calls factorial(1) and will multiply its result by 2.',
          'factorial(1) is the base case — it returns 1 directly, no further recursion.',
          'Now the stack unwinds: factorial(2) computes 2 × 1 = 2 and returns it. factorial(3) computes 3 × 2 = 6 and returns it. factorial(4) computes 4 × 6 = 24 and returns it — the final answer.',
          'At the deepest point, 4 calls were simultaneously on the stack (factorial(4,3,2,1)) — that\'s the O(n) space cost of this recursion.',
        ],
      },
      code: `def factorial(n):
    if n <= 1:
        return 1                    # base case
    return n * factorial(n - 1)     # recursive case: trust factorial(n-1) is correct

# Fibonacci: two recursive calls per level -- this is O(2^n) time
# unless memoized (see Dynamic Programming, week 6)
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`,
      pitfalls: [
        'Missing or unreachable base case → infinite recursion → RecursionError: maximum recursion depth exceeded (and it happens sooner in Python than you\'d expect, due to the default 1000-frame limit above).',
        'Trying to mentally trace every branch of a multi-call recursion (like fibonacci) instead of trusting smaller calls are correct — this is the single biggest thing that makes recursion feel confusing. Trust it, and verify with small examples instead.',
        'Naive multi-branch recursion (like plain fib above) can recompute the same subproblem many times — fib(5) calls fib(3) twice, fib(2) three times, etc. This is exactly the inefficiency that memoization (week 6) fixes — Python\'s @functools.lru_cache decorator can memoize a function like this in one line, as you\'ll see then.',
      ],
    },
    keyIdeas: [
      'Base case (stops recursion) + recursive case (shrinks toward it) — both are required.',
      'Trust that the recursive call is correct for smaller input; don\'t trace the whole call tree in your head.',
      'Each call frame costs stack space — recursion depth n means O(n) space, and Python\'s default limit is only ~1000 frames.',
      'Naive recursion can recompute the same subproblem repeatedly — a preview of why memoization matters.',
    ],
    problems: [
      { title: 'Fibonacci Number', difficulty: 'Easy', url: LC('fibonacci-number') },
      { title: 'Climbing Stairs', difficulty: 'Easy', url: LC('climbing-stairs') },
      { title: "Pow(x, n)", difficulty: 'Medium', url: LC('powx-n') },
      { title: 'Reverse Linked List', difficulty: 'Easy', url: LC('reverse-linked-list'), note: 'try the recursive version' },
    ],
  },

  'recursion-advanced': {
    id: 'recursion-advanced',
    title: 'Divide & Conquer',
    week: 2,
    day: 12,
    category: 'Data Structures',
    summary:
      'Building on yesterday\'s basics: split a problem in half, solve each half recursively, and combine the results — the pattern behind merge sort and many tree/array problems.',
    lesson: {
      intro:
        'Divide-and-conquer is recursion with a specific shape: split the input into independent pieces, solve each piece recursively (usually the same subproblem, smaller), then combine the sub-results into the final answer. It\'s worth separating from basic recursion because the complexity analysis is different (and shows up constantly): splitting in half repeatedly gives O(log n) levels, and if combining at each level costs O(n) total, the whole algorithm is O(n log n) — exactly what you saw with merge sort on day 6.',
      steps: [
        'Divide: split the input into smaller, usually equal-sized pieces (commonly in half).',
        'Conquer: recursively solve each piece — trust that the recursive call correctly solves the smaller version.',
        'Combine: merge the sub-results into the answer for the full input — this step is often where the real work/cleverness lives (e.g., the merge step in merge sort).',
        'To analyze the complexity, count the levels of recursion (how many times can you split before hitting the base case?) and the work done per level, then multiply. Splitting in half → log n levels; O(n) combine work per level → O(n log n) total.',
        'Many array and tree problems that don\'t look like "sorting" still fit this shape — e.g., finding the maximum subarray by splitting the array, solving each half, then handling the case where the best subarray crosses the midpoint.',
      ],
      example: {
        setup: 'Finding the maximum element in an array via divide and conquer (a toy example to make the shape concrete).',
        walkthrough: [
          'Divide: split the array into a left half and a right half.',
          'Conquer: recursively find the max of the left half, and the max of the right half.',
          'Combine: the answer for the whole array is the larger of the two half-maxes.',
          'Base case: an array of size 1 has itself as its max.',
          'This does no better than a simple loop for "find the max" (both are O(n)) — the shape is only worth it when the combine step lets you avoid redoing work, as in merge sort or the maximum-subarray problem.',
        ],
      },
      code: `def max_subarray_divide_conquer(arr, lo=0, hi=None):
    if hi is None:
        hi = len(arr) - 1
    if lo == hi:
        return arr[lo]
    mid = (lo + hi) // 2
    left_max = max_subarray_divide_conquer(arr, lo, mid)
    right_max = max_subarray_divide_conquer(arr, mid + 1, hi)

    # combine: handle the case where the best subarray straddles the midpoint
    best_left_cross, total = float('-inf'), 0
    for i in range(mid, lo - 1, -1):
        total += arr[i]
        best_left_cross = max(best_left_cross, total)
    best_right_cross, total = float('-inf'), 0
    for i in range(mid + 1, hi + 1):
        total += arr[i]
        best_right_cross = max(best_right_cross, total)

    return max(left_max, right_max, best_left_cross + best_right_cross)`,
      pitfalls: [
        'Forgetting the "combine" step can handle cross-boundary cases — the maximum-subarray example above is a classic case where the interesting answer straddles the split point.',
        'Re-slicing lists with arr[lo:mid] on every recursive call (as in a naive merge sort) adds hidden O(n) copy cost per call — passing lo/hi index bounds instead avoids this in performance-sensitive code.',
        'Assuming divide-and-conquer is always O(n log n) — it depends entirely on the combine cost; if combining is O(n²), the whole thing can be much worse.',
      ],
    },
    keyIdeas: [
      'Shape: divide into pieces → conquer each recursively → combine sub-results.',
      'Complexity = (number of recursion levels) × (work done per level).',
      'Splitting in half gives O(log n) levels — the source of the "log n" in O(n log n) algorithms.',
      'The combine step is usually where the cleverness (and the bugs) live.',
    ],
    problems: [
      { title: 'Maximum Subarray', difficulty: 'Medium', url: LC('maximum-subarray'), note: 'try the divide & conquer version above' },
      { title: 'Sort an Array', difficulty: 'Medium', url: LC('sort-an-array') },
      { title: 'Merge k Sorted Lists', difficulty: 'Hard', url: LC('merge-k-sorted-lists'), note: 'divide and conquer the list of lists' },
      { title: 'Kth Largest Element in an Array', difficulty: 'Medium', url: LC('kth-largest-element-in-an-array'), note: 'quickselect — a D&C cousin' },
    ],
  },

  'linked-lists-1': {
    id: 'linked-lists-1',
    title: 'Linked Lists, Part 1',
    week: 2,
    day: 13,
    category: 'Data Structures',
    summary:
      'A chain of nodes, each pointing to the next — no indices, just pointers. Master traversal and basic insert/delete before tomorrow\'s trickier pointer problems.',
    lesson: {
      intro:
        'Unlike an array, a linked list doesn\'t store elements contiguously in memory. Instead, each node holds a value and a pointer (reference) to the next node. You reach any element by following pointers from the head, one step at a time — there\'s no arr[i] shortcut, so access is O(n). What you gain: inserting or removing a node (once you\'re there) is O(1), since it\'s just re-pointing a couple of references, no shifting required.',
      steps: [
        'A node is typically a small class with a val and a next attribute. The list itself is just a reference to its first node, head. The last node\'s next is None.',
        'Traversal: start at head, and loop while the current node isn\'t None, moving current = current.next each step — this is the building block for almost every linked-list problem.',
        'Insertion/deletion requires you to have a reference to the node just before the point of change (so you can re-point its next) — this is why many problems track a prev pointer alongside current.',
        'A dummy/sentinel head node — a fake node placed before the real head — removes the need to special-case "inserting/deleting at the very front" of the list. Point dummy.next at the real head, do all your logic uniformly, then return dummy.next at the end.',
        'Doubly linked lists add a prev pointer to each node too, allowing O(1) traversal in both directions — the structure behind LRU Cache (week 3).',
      ],
      example: {
        setup: 'Deleting the node with value 3 from the list 1 → 2 → 3 → 4.',
        walkthrough: [
          'Traverse with a prev pointer starting one step behind current: prev = None, current = head (node 1).',
          'current.val (1) != 3, so advance: prev = node 1, current = node 2.',
          'current.val (2) != 3, advance: prev = node 2, current = node 3.',
          'current.val (3) == 3 — found it. Re-point prev.next = current.next, i.e., node 2\'s next now points directly to node 4, skipping node 3 entirely.',
          'Node 3 is now unreachable from the list (and garbage collected in Python) — deletion done in O(1) once found, O(n) total to find it.',
        ],
      },
      code: `class ListNode:
    def __init__(self, val, next=None):
        self.val = val
        self.next = next

def delete_value(head, target):
    dummy = ListNode(0, head)  # sentinel avoids special-casing head removal
    prev, current = dummy, head
    while current is not None:
        if current.val == target:
            prev.next = current.next
            break
        prev, current = current, current.next
    return dummy.next`,
      pitfalls: [
        'Losing the reference to the rest of the list by overwriting a .next pointer before saving the node it pointed to — always save current.next in a temp variable before reassigning it, if you still need it.',
        'Forgetting to handle an empty list (head is None) or a single-node list as edge cases.',
        'Not using a dummy head when the node to remove/insert might be the very first one — it turns an annoying special case into the same code path as everything else.',
      ],
    },
    keyIdeas: [
      'No random access — traversal is O(n), but insert/delete at a known position is O(1).',
      'A dummy/sentinel head node removes special-casing for changes at the front of the list.',
      'Always save current.next before overwriting it, if you still need to move forward.',
      'Doubly linked lists trade extra memory (a prev pointer) for O(1) backward traversal.',
    ],
    problems: [
      { title: 'Reverse Linked List', difficulty: 'Easy', url: LC('reverse-linked-list') },
      { title: 'Merge Two Sorted Lists', difficulty: 'Easy', url: LC('merge-two-sorted-lists') },
      { title: 'Remove Linked List Elements', difficulty: 'Easy', url: LC('remove-linked-list-elements') },
      { title: 'Remove Nth Node From End of List', difficulty: 'Medium', url: LC('remove-nth-node-from-end-of-list') },
      { title: 'Add Two Numbers', difficulty: 'Medium', url: LC('add-two-numbers') },
    ],
  },

  'week2-review': {
    id: 'week2-review',
    title: 'Review & Spaced Practice',
    week: 2,
    day: 14,
    category: 'Review',
    isReview: true,
    summary:
      'Consolidate week 2\'s mix of structures — and specifically re-derive the recursion mental model, since everything from week 3 onward builds on it.',
    keyIdeas: [
      'Re-derive binary search\'s loop and boundary conditions from scratch, without looking at your notes.',
      'Write factorial and fibonacci recursively from a blank file — say the base case and recursive case out loud as you write them.',
      'Re-solve one stack problem and one linked-list problem cold.',
      'Mix in one problem from week 1 (hashing or sliding window) for spaced repetition — retention needs revisiting, not just moving forward.',
    ],
    problems: [],
  },
}
