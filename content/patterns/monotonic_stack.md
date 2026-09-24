---
title: "Monotonic Stack"
related_problems:
  - name: "Next Greater Element I"
    url: "https://leetcode.com/problems/next-greater-element-i/"
  - name: "Daily Temperatures"
    url: "https://leetcode.com/problems/daily-temperatures/"
  - name: "Largest Rectangle in Histogram"
    url: "https://leetcode.com/problems/largest-rectangle-in-histogram/"
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
