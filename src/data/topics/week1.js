import { LC } from '../lc'

export const WEEK1_META = {
  id: 1,
  title: 'Programming & Complexity Foundations',
  goal: 'Build the vocabulary every later topic assumes: how to measure "fast" and "small," how arrays/strings actually work in memory, and the single highest-leverage trick in interviews — hashing.',
  dayIds: ['big-o', 'arrays-strings', 'hashing', 'two-pointers', 'sliding-window', 'sorting', 'week1-review'],
}

export const WEEK1_TOPICS = {
  'big-o': {
    id: 'big-o',
    title: 'What Is Big-O? (Time & Space Complexity)',
    week: 1,
    day: 1,
    category: 'Foundations',
    summary:
      'Big-O is the language interviewers use to ask "how does your solution scale?" Before you learn any pattern, you need to be able to read and write it.',
    lesson: {
      intro:
        "Big-O notation describes how the running time (or memory use) of an algorithm grows as the input gets larger — not how fast it runs on your laptop today, but how it scales as n goes from 10 to 10,000 to 10,000,000. Interviewers use it as a shared vocabulary to compare solutions without arguing about hardware.",
      steps: [
        'To find time complexity, count how the number of basic operations (comparisons, additions, array accesses) scales with input size n. A single loop over n items is O(n). A loop inside a loop, each running roughly n times, is O(n²).',
        'Halving the problem at each step — like binary search — gives O(log n): the number of times you can cut n in half before reaching 1.',
        'We drop constants and lower-order terms: O(2n + 100) simplifies to O(n), because as n → ∞, the n term dominates everything else.',
        'When two steps happen one after another, you add their complexities: O(n) then O(n) is O(n), not O(n²). When one is nested inside the other, you multiply: an O(n) loop containing an O(n) loop is O(n²).',
        'Space complexity works the same way, but counts extra memory your algorithm uses beyond the input itself — a handful of variables is O(1) ("constant space"); an array that grows with n is O(n).',
      ],
      example: {
        setup: 'Checking whether an array of n numbers contains any duplicate value.',
        walkthrough: [
          'Brute force: for every element, scan every other element looking for a match. Outer loop runs n times; inner loop runs up to n times each. Total work ≈ n × n = n² comparisons → O(n²) time, O(1) extra space.',
          'Better approach: walk through the array once, and for each number, check a hash set of numbers you\'ve already seen. Set lookup is O(1) on average, so one pass of n numbers is O(n) time — but now you\'re storing up to n numbers in the set, so O(n) space.',
          'This trade-off — spend O(n) extra memory to save time — is the single most common move in interview problems, and it\'s the whole subject of tomorrow\'s lesson (hashing).',
        ],
      },
      code: `# O(n^2) time, O(1) space
def has_duplicate_slow(arr):
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                return True
    return False

# O(n) time, O(n) space
def has_duplicate_fast(arr):
    seen = set()
    for x in arr:
        if x in seen:
            return True
        seen.add(x)
    return False`,
      pitfalls: [
        'Big-O describes scaling, not raw speed — an O(n²) algorithm can outrun an O(n log n) one on tiny inputs. Don\'t over-optimize prematurely; state the trade-off instead.',
        'Recursive functions use space too: each active call sits on the call stack, so a recursive function with depth n uses at least O(n) space even if it allocates no arrays.',
        '"Average case" and "worst case" can differ — hash map lookups are O(1) on average but O(n) worst case (many collisions). In interviews, assume worst case unless told otherwise.',
      ],
    },
    keyIdeas: [
      'Know the common growth curves by name: O(1), O(log n), O(n), O(n log n), O(n²), O(2ⁿ).',
      'Always state your brute-force complexity out loud before optimizing — it shows your reasoning and gives you a baseline to improve on.',
      'Sequential steps add complexities; nested steps multiply them.',
      'Space complexity counts extra memory only, not the input itself (unless told to count it).',
    ],
    complexity: [
      { op: 'Array access / hash lookup', time: 'O(1)', space: '—' },
      { op: 'Binary search', time: 'O(log n)', space: 'O(1)' },
      { op: 'Single pass / two pointers', time: 'O(n)', space: 'O(1)' },
      { op: 'Sorting', time: 'O(n log n)', space: 'O(n) or O(log n)' },
      { op: 'Nested loop over pairs', time: 'O(n²)', space: 'varies' },
      { op: 'Subsets / backtracking', time: 'O(2ⁿ)', space: 'O(n) recursion' },
    ],
    problems: [
      { title: 'Two Sum', difficulty: 'Easy', url: LC('two-sum'), note: 'brute force O(n²) → hash map O(n)' },
      { title: 'Contains Duplicate', difficulty: 'Easy', url: LC('contains-duplicate'), note: 'the example above, for real' },
      { title: 'Valid Anagram', difficulty: 'Easy', url: LC('valid-anagram'), note: 'counting vs. sorting trade-off' },
    ],
  },

  'arrays-strings': {
    id: 'arrays-strings',
    title: 'Arrays & Strings Basics',
    week: 1,
    day: 2,
    category: 'Foundations',
    summary:
      'Arrays and strings are the raw material of almost every interview problem. Understanding how they\'re actually stored explains why some operations are cheap and others are expensive.',
    lesson: {
      intro:
        'An array is a block of memory holding elements of the same type, laid out one after another, each reachable by an index. Because the elements sit at predictable, evenly-spaced memory addresses, the computer can jump straight to any index without scanning — that\'s why arr[i] is O(1). A string is, under the hood, just an array of characters (in Python, strings are immutable, which has real consequences below).',
      steps: [
        'Reading or writing arr[i] is O(1) because the address is computed directly: base_address + i × element_size.',
        'Inserting or removing at the end of a Python list is O(1) amortized (append()/pop()). Inserting or removing at the beginning or middle is O(n) — insert(0, x) or pop(0) — because every following element has to shift over by one slot.',
        'Searching for a value you don\'t have the index for is O(n) — you must check elements one by one (unless the array is sorted, which unlocks binary search, day 8).',
        'Strings in Python are immutable: s + "x" or s[a:b] doesn\'t modify s in place, it allocates a new string. Building a string with += inside a loop is O(n²) in the worst case, because each concatenation can copy the whole string so far. Prefer a list of pieces joined once at the end: parts.append(x); ... ; "".join(parts).',
        '2D arrays (grids/matrices) are just lists of lists. grid[row][col] is still O(1) access, but iterating the whole grid is O(rows × cols). Watch out when initializing one: [[0] * cols] * rows creates rows references to the *same* inner list — use [[0] * cols for _ in range(rows)] instead.',
      ],
      example: {
        setup: 'Building the string "abc...z" (26 letters) two different ways.',
        walkthrough: [
          'Naive: result = ""; for each letter, result += letter. Each += can allocate a new string and copy everything built so far — for 26 letters this is small, but for n letters it becomes O(n) copies of growing size, summing to O(n²) total work.',
          'Better: parts = []; for each letter, parts.append(letter); then "".join(parts). Appending is O(1) amortized per letter, and one final join is O(n) — total O(n).',
          'The same idea applies in Java (StringBuilder) and JavaScript (push then join) — it\'s a language-agnostic pattern, not a Python quirk.',
        ],
      },
      code: `# O(n^2) worst case -- repeated string concatenation
def build_slow(n):
    result = ""
    for _ in range(n):
        result += "a"
    return result

# O(n) -- collect pieces, join once
def build_fast(n):
    parts = []
    for _ in range(n):
        parts.append("a")
    return "".join(parts)`,
      pitfalls: [
        'Off-by-one errors are the #1 bug source: double-check whether range(...) should stop at len(arr) or len(arr) - 1, and whether an index is 0-based.',
        'len(arr) is O(1) in Python (it\'s tracked, not recomputed) — calling it inside a loop condition is fine every iteration; don\'t "optimize" by caching it unless profiling says to.',
        'Mutating a list while iterating over it (e.g., calling .remove() inside a for loop over that same list) silently skips elements — iterate over a copy (for x in arr[:]) or build a new list instead.',
      ],
    },
    keyIdeas: [
      'Index access is O(1); search without an index is O(n); insert/delete in the middle is O(n) due to shifting.',
      'Python strings are immutable — avoid += in a loop over many iterations; collect into a list and join.',
      'A 2D array is a list of lists — full traversal is O(rows × cols); build each row separately to avoid shared-reference bugs.',
      'Get comfortable with common built-ins: slicing, .index(), in, .split(), .join(), .reverse() — know their rough complexity.',
    ],
    problems: [
      { title: 'Remove Duplicates from Sorted Array', difficulty: 'Easy', url: LC('remove-duplicates-from-sorted-array') },
      { title: 'Merge Sorted Array', difficulty: 'Easy', url: LC('merge-sorted-array') },
      { title: 'Reverse String', difficulty: 'Easy', url: LC('reverse-string') },
      { title: 'Valid Palindrome', difficulty: 'Easy', url: LC('valid-palindrome') },
      { title: 'Rotate Array', difficulty: 'Medium', url: LC('rotate-array') },
      { title: 'Longest Common Prefix', difficulty: 'Easy', url: LC('longest-common-prefix') },
    ],
  },

  hashing: {
    id: 'hashing',
    title: 'Hashing: Hash Maps & Sets',
    week: 1,
    day: 3,
    category: 'Foundations',
    summary:
      'The single highest-leverage pattern in interviews: trading a bit of memory for a hash map/set to turn an O(n²) brute force into O(n).',
    lesson: {
      intro:
        'A hash map stores key-value pairs and gives near-instant lookup: instead of scanning every entry to find a key (O(n)), a hash function converts the key into a number, which points almost directly to where the value lives — O(1) on average. A hash set is the same idea with no values, just "is this key present or not."',
      steps: [
        'A hash function takes a key (a number, string, etc.) and deterministically converts it into an array index — the same key always maps to the same index.',
        'To insert, the map computes the key\'s index and stores the entry there. To look up, it recomputes the same index and checks that slot — no scanning required, which is why average-case get/set/has are all O(1).',
        'Collisions happen when two different keys hash to the same index; the map handles this internally (usually by chaining a small list at that slot), which is why worst case is technically O(n) — but you can treat it as O(1) average case in interviews unless told otherwise.',
        'Whenever you catch yourself writing a nested loop to answer "have I seen this before," "does this pair/complement exist," or "how many times does X occur" — that\'s the signal to reach for a hash map or set first.',
        'In Python, use a dict for key-value pairs and a set for uniqueness checks — both are hash-table-backed and built into the language. Dict keys must be hashable (numbers, strings, tuples — not lists or other dicts). collections.Counter (a dict subclass built for frequency counting) and collections.defaultdict (auto-initializes missing keys) are worth knowing — they remove a lot of boilerplate from the pattern below.',
      ],
      example: {
        setup: 'Two Sum: given an array of numbers and a target, find two numbers that add up to the target.',
        walkthrough: [
          'Brute force: for each number, scan every other number checking if they sum to target — O(n²).',
          'Hash map approach: walk through the array once. For each number x, compute its complement = target - x, and check if complement is already a key in the map.',
          'If it is, you\'ve found your pair (the complement\'s stored index, and the current index). If not, store x → its index in the map and keep going.',
          'One pass, O(1) work per element (map lookup + insert) → O(n) time total, O(n) space for the map.',
        ],
      },
      code: `def two_sum(nums, target):
    seen = {}  # value -> index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
      pitfalls: [
        'Check if complement in seen before you insert the current number — otherwise a number can (incorrectly) pair with itself.',
        'When counting frequencies, initialize missing keys carefully: counts[k] = counts.get(k, 0) + 1, or use collections.Counter(arr) / collections.defaultdict(int) instead of assuming the key exists.',
        'If input values are tightly bounded (e.g., only lowercase letters), a fixed-size array (26 slots) is simpler and faster than a full hash map — recognize when you can downgrade from a dict to an array.',
      ],
    },
    keyIdeas: [
      'Hash map/set give O(1) average lookup, insert, and delete — the default fix for nested "have I seen this" loops.',
      'Frequency counting and prefix-sum-with-a-map turn many "subarray/substring" questions into a single O(n) pass.',
      'Bounded-value inputs (e.g. lowercase letters only) can use a fixed-size array instead of a map.',
      'Worst case is O(n) due to collisions, but treat it as O(1) average in interview complexity analysis unless asked to go deeper.',
    ],
    problems: [
      { title: 'Contains Duplicate', difficulty: 'Easy', url: LC('contains-duplicate') },
      { title: 'Valid Anagram', difficulty: 'Easy', url: LC('valid-anagram') },
      { title: 'Two Sum', difficulty: 'Easy', url: LC('two-sum') },
      { title: 'Group Anagrams', difficulty: 'Medium', url: LC('group-anagrams') },
      { title: 'Top K Frequent Elements', difficulty: 'Medium', url: LC('top-k-frequent-elements') },
      { title: 'Product of Array Except Self', difficulty: 'Medium', url: LC('product-of-array-except-self') },
      { title: 'Valid Sudoku', difficulty: 'Medium', url: LC('valid-sudoku') },
      { title: 'Longest Consecutive Sequence', difficulty: 'Medium', url: LC('longest-consecutive-sequence') },
    ],
  },

  'two-pointers': {
    id: 'two-pointers',
    title: 'Two Pointers',
    week: 1,
    day: 4,
    category: 'Foundations',
    summary:
      'For sorted arrays or palindrome-style checks, two indices moving toward or away from each other replace an O(n²) search with O(n).',
    lesson: {
      intro:
        'The two-pointer technique uses two index variables that move through a structure — usually a sorted array or a string — instead of using nested loops. Because each pointer only moves forward (never backward), the total work is bounded by O(n) even though it looks like you\'re "searching."',
      steps: [
        'Opposite-direction pattern: put one pointer at the start (left) and one at the end (right). Look at what arr[left] and arr[right] tell you, then move whichever pointer can\'t possibly improve the answer — this is the key insight that makes it O(n) instead of O(n²).',
        'Same-direction pattern (slow/fast): both pointers start at the beginning; the fast one scans ahead while the slow one marks where the next "good" element should go — used for in-place deduplication/filtering.',
        'This pattern almost always requires sorted input (or you sort first) — sorting costs O(n log n) but then unlocks an O(n) scan, which is often still a net win over O(n²).',
        'Because you\'re only using two extra index variables, space is O(1) — call that out explicitly, it\'s a point in your solution\'s favor.',
      ],
      example: {
        setup: 'Given a sorted array, find two numbers that add up to a target (Two Sum II — different from yesterday\'s hash-map version because this array is sorted).',
        walkthrough: [
          'left = 0, right = length - 1.',
          'If arr[left] + arr[right] == target, you\'re done.',
          'If the sum is too small, the only way to increase it is to move left forward (right is already the largest available value).',
          'If the sum is too large, move right backward.',
          'Each step moves one pointer closer to the other, so the loop runs at most n times — O(n) time, O(1) space, no extra map needed because sorted order does the work.',
        ],
      },
      code: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        total = arr[left] + arr[right]
        if total == target:
            return [left, right]
        if total < target:
            left += 1
        else:
            right -= 1
    return []`,
      pitfalls: [
        'Forgetting to sort first when order doesn\'t matter for the final answer — this is what unlocks the technique in problems like 3Sum.',
        'Off-by-one on the loop condition: use left < right (not <=) when the two pointers must refer to two distinct elements.',
        'When a problem asks for all pairs/triplets (not just one), you must skip over duplicate values after finding a match, or you\'ll return duplicate answers.',
      ],
    },
    keyIdeas: [
      'Opposite-direction pointers: move whichever side can\'t improve the answer.',
      'Same-direction (slow/fast) pointers: filter or deduplicate in place.',
      'Almost always O(n) time, O(1) extra space once the array is sorted.',
      'Sort first if the problem doesn\'t care about original order — it\'s what makes two pointers valid.',
    ],
    problems: [
      { title: 'Valid Palindrome', difficulty: 'Easy', url: LC('valid-palindrome') },
      { title: 'Two Sum II - Input Array Is Sorted', difficulty: 'Medium', url: LC('two-sum-ii-input-array-is-sorted') },
      { title: '3Sum', difficulty: 'Medium', url: LC('3sum') },
      { title: 'Container With Most Water', difficulty: 'Medium', url: LC('container-with-most-water') },
      { title: 'Trapping Rain Water', difficulty: 'Hard', url: LC('trapping-rain-water') },
    ],
  },

  'sliding-window': {
    id: 'sliding-window',
    title: 'Sliding Window',
    week: 1,
    day: 5,
    category: 'Foundations',
    summary:
      'A window of a variable substring/subarray expands and contracts over one pass — turns many "longest/shortest with property X" questions into O(n).',
    lesson: {
      intro:
        'Sliding window is two-pointers\' close cousin, specialized for contiguous substrings/subarrays. Instead of recomputing a property (sum, character counts, etc.) from scratch for every possible window — which is O(n²) or worse — you maintain a running window and update it incrementally as its edges move.',
      steps: [
        'Keep two pointers, left and right, marking the current window [left, right]. Grow the window by moving right forward and including the new element in your running state (sum, count map, etc.).',
        'Whenever the window violates a constraint (e.g., too many distinct characters, sum too large), shrink it by moving left forward and removing that element from your running state — repeat until the constraint is satisfied again.',
        'Because left and right each only move forward and never backward, the total number of moves across the whole algorithm is at most 2n — O(n) overall, even though it looks like nested motion.',
        'Fixed-size window problems (e.g., "max sum of any k consecutive elements") are the simplest case: slide the window by exactly one each step, subtracting the outgoing element and adding the incoming one.',
        'Signal words to watch for: "longest/shortest substring or subarray," "at most/exactly k distinct," "contains all characters of," "maximum sum of a window of size k."',
      ],
      example: {
        setup: 'Find the length of the longest substring without repeating characters, e.g. "abcabcbb".',
        walkthrough: [
          'left = 0, a Set (or map of last-seen index) tracks characters currently in the window, best = 0.',
          'right scans forward: a, b, c — all new, window grows to "abc", best = 3.',
          'right hits the second "a" — it\'s already in the window. Shrink from the left, removing characters, until "a" is no longer in the window (left moves past the first "a").',
          'Now re-add the new "a"; window is "bca", continue scanning.',
          'Track the max window size seen at every step; that\'s the answer — O(n) because left and right together sweep the string once.',
        ],
      },
      code: `def length_of_longest_substring(s):
    last_seen = {}
    left = best = 0
    for right, ch in enumerate(s):
        if ch in last_seen and last_seen[ch] >= left:
            left = last_seen[ch] + 1  # jump left past the repeat
        last_seen[ch] = right
        best = max(best, right - left + 1)
    return best`,
      pitfalls: [
        'Shrinking the window with a while loop (not if) — sometimes you need to remove more than one element to restore the constraint.',
        'For fixed-size windows, remember to subtract the element leaving the window, not just add the one entering.',
        'Recomputing the window\'s state from scratch on every move defeats the purpose — always update incrementally (add/remove one element), or you\'re back to O(n²).',
      ],
    },
    keyIdeas: [
      'Grow the right edge to include new elements; shrink the left edge while a constraint is violated.',
      'Maintain running state (count map, sum) incrementally — never recompute the whole window from scratch.',
      'Fixed-size windows slide by exactly one element per step.',
      'Signal words: "longest/shortest substring," "at most k distinct," "window of size k."',
    ],
    problems: [
      { title: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', url: LC('best-time-to-buy-and-sell-stock') },
      { title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', url: LC('longest-substring-without-repeating-characters') },
      { title: 'Longest Repeating Character Replacement', difficulty: 'Medium', url: LC('longest-repeating-character-replacement') },
      { title: 'Permutation in String', difficulty: 'Medium', url: LC('permutation-in-string') },
      { title: 'Minimum Window Substring', difficulty: 'Hard', url: LC('minimum-window-substring') },
      { title: 'Sliding Window Maximum', difficulty: 'Hard', url: LC('sliding-window-maximum') },
    ],
  },

  sorting: {
    id: 'sorting',
    title: 'Sorting Algorithms',
    week: 1,
    day: 6,
    category: 'Foundations',
    summary:
      'You rarely hand-implement sort in an interview, but understanding merge sort/quicksort explains a huge share of "why is this O(n log n)" answers — and sometimes you do need to write one.',
    lesson: {
      intro:
        'Sorting rearranges elements into order. Simple sorts (bubble, insertion, selection) are O(n²) and mostly a teaching tool; the ones worth knowing cold are merge sort and quicksort, both O(n log n) on average, because their divide-and-conquer structure shows up constantly elsewhere (trees, recursion, D&C problems).',
      steps: [
        'Merge sort: split the array in half recursively until pieces have 1 element (already "sorted"), then merge pairs of sorted halves back together by repeatedly taking the smaller front element. Splitting is O(log n) levels deep; merging all pairs at each level costs O(n) total — so O(n log n) overall. Uses O(n) extra space for the merge step, and is stable (equal elements keep their relative order).',
        'Quicksort: pick a pivot element, partition the array so everything smaller than the pivot ends up left of it and everything larger ends up right, then recursively sort each side. Average case O(n log n); worst case O(n²) if the pivot is consistently the smallest/largest element (e.g., already-sorted input with a naive pivot choice) — random or median-of-three pivot selection avoids this in practice.',
        'Python\'s built-in sorted(arr) / arr.sort() use Timsort, O(n log n) and stable — for interview purposes, use them freely unless the question specifically asks you to implement a sort. sorted() returns a new list; arr.sort() sorts in place and returns None.',
        'For custom ordering, pass key=: sorted(words, key=len) sorts by length; sorted(people, key=lambda p: (p.age, p.name)) sorts by age then name using tuple comparison. For a true pairwise comparator (e.g., "does a+b or b+a come first" for Largest Number), use functools.cmp_to_key(compare_fn).',
        'Many "harder" problems are secretly "sort first, then do something simple" — recognizing when sorting unlocks a two-pointer or greedy solution is a skill in itself (see Intervals and Greedy, week 5).',
      ],
      example: {
        setup: 'Merge-sorting [5, 2, 4, 1] by hand.',
        walkthrough: [
          'Split into [5, 2] and [4, 1].',
          'Split again: [5], [2], [4], [1] — all single elements, trivially sorted.',
          'Merge [5] and [2] → compare 5 vs 2, take 2 first → [2, 5]. Merge [4] and [1] → [1, 4].',
          'Merge [2, 5] and [1, 4]: compare fronts 2 vs 1 → take 1; compare 2 vs 4 → take 2; compare 5 vs 4 → take 4; only 5 left → take 5. Result: [1, 2, 4, 5].',
        ],
      },
      code: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    merged = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i]); i += 1
        else:
            merged.append(right[j]); j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    return merged`,
      pitfalls: [
        'Writing arr = arr.sort() — .sort() returns None (it sorts in place), so this silently throws away your list. Use sorted(arr) if you need an assignable result.',
        'Confusing average-case and worst-case for quicksort — know that naive pivot choice on sorted input degrades to O(n²).',
        'Stability matters when you sort by one key but need ties broken by original order (e.g., sort intervals by start time, but equal starts should stay in input order) — Timsort (Python\'s sort) is stable, a naive quicksort typically isn\'t.',
      ],
    },
    keyIdeas: [
      'Merge sort: split, recursively sort, merge — O(n log n) time, O(n) space, stable.',
      'Quicksort: partition around a pivot, recurse — O(n log n) average, O(n²) worst case, O(1)-ish extra space.',
      'Use the built-in sort() in interviews unless asked to implement one — but always pass a numeric comparator.',
      'Recognizing "sort first" as a setup step is its own pattern-matching skill.',
    ],
    complexity: [
      { op: 'Merge sort', time: 'O(n log n)', space: 'O(n)' },
      { op: 'Quicksort (average)', time: 'O(n log n)', space: 'O(log n)' },
      { op: 'Quicksort (worst case)', time: 'O(n²)', space: 'O(n)' },
      { op: 'Insertion sort', time: 'O(n²)', space: 'O(1)' },
    ],
    problems: [
      { title: 'Sort an Array', difficulty: 'Medium', url: LC('sort-an-array'), note: 'implement merge sort or quicksort by hand' },
      { title: 'Merge Sorted Array', difficulty: 'Easy', url: LC('merge-sorted-array') },
      { title: 'Largest Number', difficulty: 'Medium', url: LC('largest-number'), note: 'custom comparator' },
      { title: 'Sort Colors', difficulty: 'Medium', url: LC('sort-colors'), note: 'one-pass partitioning (Dutch national flag)' },
    ],
  },

  'week1-review': {
    id: 'week1-review',
    title: 'Review & Spaced Practice',
    week: 1,
    day: 7,
    category: 'Review',
    isReview: true,
    summary:
      'Consolidate week 1 with active recall, not re-reading. Re-solve problems from memory, and mix in a couple you haven\'t seen.',
    keyIdeas: [
      'Re-attempt one problem from each of this week\'s topics without looking at your old solution or notes — recall beats re-reading.',
      'Write, in your own words, a one-line "when to use this" note for: Big-O reasoning, hashing, two pointers, sliding window, and sorting.',
      'Do one cold, timed 30-minute problem (any Medium you haven\'t seen from this week\'s topics) to simulate light interview pressure.',
      'Log anything that still feels shaky — you\'ll revisit weak topics again in week 4 and week 6\'s spaced-review days.',
    ],
    problems: [],
  },
}
