---
title: "Monotonic Stack"
---

## When to use

- You need to find the "Next Greater", "Next Smaller", "Previous Greater", or "Previous Smaller" element for every element in an array.
- The problem involves finding the range of elements where a certain element is the minimum or maximum (useful in contribution sum problems).
- You are processing elements in a linear fashion and need to maintain a monotonic sequence (either increasing or decreasing).

## Edge Cases

- The array is empty.
- All elements are the same (flat histogram/array).
- Elements are already strictly increasing or strictly decreasing.

## Common Mistakes

- Using a monotonically increasing stack when a monotonically decreasing stack is required (and vice versa). 
- Storing the actual values in the stack instead of their indices. Storing indices is generally much more versatile.
- Forgetting to process the remaining elements in the stack after the main loop finishes, or forgetting to use sentinel values (like appending `0` in the histogram problem) to flush the stack.

## Sub Patterns

### 1. Next Greater Element (NGE)

```python
def next_greater_element(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []  # Monotonic decreasing stack (stores indices)

    for i in range(n):
        while stack and nums[stack[-1]] < nums[i]:
            prev_idx = stack.pop()
            result[prev_idx] = nums[i]  # or i - prev_idx for distance
        stack.append(i)

    return result
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Next Greater Element I](https://leetcode.com/problems/next-greater-element-i/) | Find the next greater element for elements in a subset of an array using a monotonic decreasing stack. |
| [Daily Temperatures](https://leetcode.com/problems/daily-temperatures/) | Find the number of days to wait for a warmer temperature by finding the distance to the next greater element. |

### 2. Next Smaller Element (NSE)

```python
def next_smaller_element(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []  # Monotonic increasing stack (stores indices)

    for i in range(n):
        while stack and nums[stack[-1]] > nums[i]:
            prev_idx = stack.pop()
            result[prev_idx] = nums[i]  # or i - prev_idx for distance
        stack.append(i)

    return result
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Final Prices With a Special Discount in a Shop](https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/) | Apply a discount equal to the next smaller or equal price by maintaining a monotonic increasing stack. |

### 3. Previous Smaller & Previous Greater Elements

```python
def previous_smaller_and_greater(nums: list[int]):
    n = len(nums)
    prev_smaller = [-1] * n
    prev_greater = [-1] * n

    # Previous Smaller Element (Monotonic Increasing Stack)
    stack = []
    for i in range(n):
        while stack and nums[stack[-1]] >= nums[i]:
            stack.pop()
        if stack:
            prev_smaller[i] = nums[stack[-1]]  # or stack[-1] for index
        stack.append(i)

    # Previous Greater Element (Monotonic Decreasing Stack)
    stack = []
    for i in range(n):
        while stack and nums[stack[-1]] <= nums[i]:
            stack.pop()
        if stack:
            prev_greater[i] = nums[stack[-1]]  # or stack[-1] for index
        stack.append(i)

    return prev_smaller, prev_greater
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Online Stock Span](https://leetcode.com/problems/online-stock-span/) | Count consecutive previous days with stock price less than or equal to today using a monotonic decreasing stack (Previous Greater Element). |

### 4. Circular Array Pattern

```python
def next_greater_circular(nums: list[int]) -> list[int]:
    n = len(nums)
    result = [-1] * n
    stack = []

    for i in range(2 * n):
        curr = nums[i % n]
        while stack and nums[stack[-1]] < curr:
            prev_idx = stack.pop()
            result[prev_idx] = curr
        if i < n:
            stack.append(i)

    return result
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Next Greater Element II](https://leetcode.com/problems/next-greater-element-ii/) | Find the next greater element in a circular array by conceptually doubling the array length. |

### 5. Contribution Technique / Histogram Pattern

```python
def largest_rectangle_area(heights: list[int]) -> int:
    heights.append(0)  # Sentinel to flush the stack
    stack = [-1]       # Dummy index to handle the left boundary
    max_area = 0

    for right in range(len(heights)):
        while stack[-1] != -1 and heights[stack[-1]] >= heights[right]:
            mid = stack.pop()
            height = heights[mid]
            left = stack[-1]
            width = right - left - 1
            max_area = max(max_area, height * width)
        stack.append(right)

    heights.pop()  # Restore list
    return max_area
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Largest Rectangle in Histogram](https://leetcode.com/problems/largest-rectangle-in-histogram/) | Find the largest rectangular area by finding the previous and next smaller elements for each bar. |
| [Maximal Rectangle](https://leetcode.com/problems/maximal-rectangle/) | Apply the histogram algorithm on each row of a 2D binary matrix. |
| [Sum of Subarray Minimums](https://leetcode.com/problems/sum-of-subarray-minimums/) | Find the sum of minimums of all subarrays by finding the span where each element is the minimum (Contribution Technique). |
