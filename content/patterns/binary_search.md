---
title: "Binary Search"
related_problems:
  - name: "Binary Search"
    url: "https://leetcode.com/problems/binary-search/"
  - name: "Search Insert Position"
    url: "https://leetcode.com/problems/search-insert-position/"
  - name: "First Bad Version"
    url: "https://leetcode.com/problems/first-bad-version/"
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
