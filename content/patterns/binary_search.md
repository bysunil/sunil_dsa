---
title: "Binary Search"
---

## When to use

- You have a sorted array or a monotonic function.
- You need to find a target value, the first/last occurrence of a value, or an optimal solution within a range.
- The algorithm requires `O(log n)` time complexity.

## Edge Cases

- The array is empty.
- The target is smaller than the first element or larger than the last element.
- There are duplicate elements in the array.

## Common Mistakes

- Incorrectly updating `left` or `right` (e.g., `left = mid` instead of `left = mid + 1`), leading to infinite loops.
- Overflows when calculating `mid`. Use `left + (right - left) // 2` in languages like Java/C++, though Python handles arbitrarily large integers.

## Sub Patterns

### Lower Bound (`bisect_left` / Half-Open Interval `[0, n)`)

```python
from typing import List

class Solution:
    def searchInsert(self, nums: List[int], target: int) -> int:
        left, right = 0, len(nums)
        while left < right:
            mid = left + (right - left) // 2
            if nums[mid] >= target:
                right = mid
            else:
                left = mid + 1
        return left
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Binary Search](https://leetcode.com/problems/binary-search/) | The fundamental binary search algorithm on a sorted array. |
| [Search Insert Position](https://leetcode.com/problems/search-insert-position/) | Find the first element greater than or equal to the target using `bisect_left`. |
| [First Bad Version](https://leetcode.com/problems/first-bad-version/) | Find the first `True` in a monotonic sequence of boolean values `(False -> True)`. |
| [Find First and Last Position of Element in Sorted Array](https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/) | Use lower bound to find the start and upper bound to find the end. |

### Binary Search on Answer

Used when you need to find the minimum or maximum valid integer that satisfies a certain condition. The answer range is monotonic (e.g., `False, False, True, True...`).

```python
def solve(arr: list[int]) -> int:
    def condition(mid: int) -> bool:
        # Check if mid satisfies the condition
        pass

    left, right = min_possible, max_possible
    while left < right:
        mid = left + (right - left) // 2
        if condition(mid):
            right = mid  # Try to find a smaller valid answer
        else:
            left = mid + 1  # Mid is invalid, answer must be larger
    return left
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Koko Eating Bananas](https://leetcode.com/problems/koko-eating-bananas/) | Binary search the eating speed `k`. |
| [Capacity To Ship Packages Within D Days](https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/) | Binary search the weight capacity of the ship. |
| [Split Array Largest Sum](https://leetcode.com/problems/split-array-largest-sum/) | Binary search the maximum subarray sum. |
| [Aggressive Cows](https://www.spoj.com/problems/AGGRCOW/) | Binary search the minimum distance between cows. |
