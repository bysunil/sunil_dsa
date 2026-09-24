---
title: "Sliding Window"
---

## When to use

- The problem involves an array or string.
- You need to find a contiguous subarray or substring that satisfies a certain condition.
- It often asks for the maximum, minimum, longest, shortest, or number of valid subarrays.

## Edge Cases

- Array length is smaller than the required window size `k`.
- The input array is empty.
- Valid window might not exist.

## Common Mistakes

- Forgetting to shrink the window (moving the `left` pointer) when the condition is violated in variable-size windows.
- Off-by-one errors when calculating the window size. Remember: `size = right - left + 1`.
- Not initializing the tracking variables correctly (e.g., using `0` instead of `float('-inf')` for maximum values).

## Sub Patterns

### 1. Fixed Size Window (Size `k`)

```python
def fixed_sliding_window(nums: list[int], k: int) -> int:
    left = 0
    curr_state = 0
    max_ans = float("-inf")

    for right in range(len(nums)):
        curr_state += nums[right]

        if right - left + 1 == k:
            max_ans = max(max_ans, curr_state)
            curr_state -= nums[left]
            left += 1

    return max_ans
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Maximum Average Subarray I](https://leetcode.com/problems/maximum-average-subarray-i/) | Maintain the sum of a window of size `k` and find the maximum average. |
| [Find All Anagrams in a String](https://leetcode.com/problems/find-all-anagrams-in-a-string/) | Check if the frequency map of a fixed size window matches the target string's frequency map. |

### 2. Variable Size — Longest Valid Window

```python
def longest_valid_window(nums: list[int], k: int) -> int:
    left = 0
    max_len = 0
    window_state = 0

    for right in range(len(nums)):
        window_state += nums[right]

        while left <= right and window_is_invalid(window_state, k):
            window_state -= nums[left]
            left += 1

        max_len = max(max_len, right - left + 1)

    return max_len
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Longest Substring Without Repeating Characters](https://leetcode.com/problems/longest-substring-without-repeating-characters/) | Expand the window until a duplicate character is found, then shrink from the left until the duplicate is removed. |
| [Max Consecutive Ones III](https://leetcode.com/problems/max-consecutive-ones-iii/) | Keep expanding the window as long as the number of flipped 0s does not exceed `k`. |

### 3. Variable Size — Shortest / Minimum Valid Window

```python
def shortest_valid_window(nums: list[int], target: int) -> int:
    left = 0
    min_len = float("inf")
    window_state = 0

    for right in range(len(nums)):
        window_state += nums[right]

        while window_is_valid(window_state, target):
            min_len = min(min_len, right - left + 1)
            window_state -= nums[left]
            left += 1

    return min_len if min_len != float("inf") else 0
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Minimum Window Substring](https://leetcode.com/problems/minimum-window-substring/) | Expand until the window contains all characters of `t`, then shrink from the left to find the minimum length. |
| [Minimum Size Subarray Sum](https://leetcode.com/problems/minimum-size-subarray-sum/) | Expand until the sum is `>= target`, then shrink to find the shortest subarray. |

### 4. Counting Subarrays: At Most `K`

```python
def count_at_most_k(nums: list[int], k: int) -> int:
    left = 0
    ans = 0
    state = 0

    for right in range(len(nums)):
        state += nums[right]

        while state > k:
            state -= nums[left]
            left += 1

        ans += right - left + 1

    return ans
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Subarray Product Less Than K](https://leetcode.com/problems/subarray-product-less-than-k/) | Count the number of valid subarrays ending at `right` by adding `right - left + 1` to the answer. |

### 5. "Exactly `K`" Technique

```python
def count_exactly_k(nums: list[int], k: int) -> int:
    def at_most(limit: int) -> int:
        if limit < 0:
            return 0
        left = 0
        count = 0
        state = 0
        for right in range(len(nums)):
            state += nums[right]
            while state > limit:
                state -= nums[left]
                left += 1
            count += right - left + 1
        return count

    return at_most(k) - at_most(k - 1)
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Subarrays with K Different Integers](https://leetcode.com/problems/subarrays-with-k-different-integers/) | Find the number of subarrays with exactly `k` distinct integers by calculating `atMost(k) - atMost(k - 1)`. |
| [Count Number of Nice Subarrays](https://leetcode.com/problems/count-number-of-nice-subarrays/) | Count subarrays with exactly `k` odd numbers using the `atMost(k) - atMost(k - 1)` trick. |

### 6. Frequency Map / Character Replacement Window

```python
from collections import defaultdict

def frequency_window(s: str, k: int) -> int:
    freq = defaultdict(int)
    left = 0
    max_freq = 0
    ans = 0

    for right, char in enumerate(s):
        freq[char] += 1
        max_freq = max(max_freq, freq[char])

        while (right - left + 1) - max_freq > k:
            freq[s[left]] -= 1
            left += 1

        ans = max(ans, right - left + 1)

    return ans
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Longest Repeating Character Replacement](https://leetcode.com/problems/longest-repeating-character-replacement/) | Keep track of the maximum frequency of a single character in the current window to determine how many replacements are needed. |
