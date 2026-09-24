---
title: "Standard Backtracking Patterns"
---

## When to use

- You need to find **all** possible solutions or paths.
- The problem asks for combinations, permutations, subsets, or solving constraints (Sudoku, N-Queens).
- The constraints are extremely small (e.g., $N \le 20$).

## Edge Cases

- Duplicate elements in the input array (requires sorting and skipping duplicates to avoid duplicate subsets/permutations).
- Empty input.

## Common Mistakes

- Forgetting to `pop()` / backtrack the state after the recursive call.
- Passing lists by reference instead of making a copy (e.g., `result.append(path[:])` instead of `result.append(path)`).

## 1. Subsets Pattern

Used when you need to generate all possible subsets (the power set).

```python
def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    
    def backtrack(start_index: int, current_path: list[int]):
        # Every path is a valid subset
        result.append(current_path[:])
        
        for i in range(start_index, len(nums)):
            current_path.append(nums[i])
            backtrack(i + 1, current_path)
            current_path.pop()  # Backtrack
            
    backtrack(0, [])
    return result
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Subsets](https://leetcode.com/problems/subsets/) | Standard power set generation using backtracking. |
| [Subsets II](https://leetcode.com/problems/subsets-ii/) | Sort the array first, then skip duplicates (`if i > start_index and nums[i] == nums[i-1]: continue`). |

## 2. Combinations Pattern

Used when order doesn't matter, but you have a specific target size or target sum.

```python
def combinationSum(candidates: list[int], target: int) -> list[list[int]]:
    result = []
    
    def backtrack(start_index: int, current_path: list[int], current_sum: int):
        if current_sum == target:
            result.append(current_path[:])
            return
        if current_sum > target:
            return
            
        for i in range(start_index, len(candidates)):
            current_path.append(candidates[i])
            # Reuse the same element (i) if allowed, otherwise pass i + 1
            backtrack(i, current_path, current_sum + candidates[i])
            current_path.pop()  # Backtrack
            
    backtrack(0, [], 0)
    return result
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Combination Sum](https://leetcode.com/problems/combination-sum/) | Allow reusing elements by passing `i` instead of `i + 1` in the recursive call. |
| [Combinations](https://leetcode.com/problems/combinations/) | Find all combinations of size `k` from `1` to `n`. |

## 3. Permutations Pattern

Used when order **does** matter. Every element must be used exactly once per path.

```python
def permute(nums: list[int]) -> list[list[int]]:
    result = []
    
    def backtrack(current_path: list[int]):
        if len(current_path) == len(nums):
            result.append(current_path[:])
            return
            
        for i in range(len(nums)):
            if nums[i] in current_path:
                continue  # Skip if already used (O(N) check, can optimize with a boolean array)
                
            current_path.append(nums[i])
            backtrack(current_path)
            current_path.pop()  # Backtrack
            
    backtrack([])
    return result
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Permutations](https://leetcode.com/problems/permutations/) | Generate all possible arrangements of distinct integers. |
| [Permutations II](https://leetcode.com/problems/permutations-ii/) | Sort and skip duplicates (`if used[i] or (i > 0 and nums[i] == nums[i-1] and not used[i-1]): continue`). |

## 4. 2D Grid Backtracking

Used for exploring a board (e.g. searching for a word).

```python
def exist(board: list[list[str]], word: str) -> bool:
    rows, cols = len(board), len(board[0])
    
    def backtrack(r: int, c: int, i: int) -> bool:
        if i == len(word):
            return True
            
        if r < 0 or c < 0 or r >= rows or c >= cols or board[r][c] != word[i]:
            return False
            
        temp = board[r][c]
        board[r][c] = '#'  # Mark as visited
        
        # Explore all 4 directions
        res = (backtrack(r + 1, c, i + 1) or
               backtrack(r - 1, c, i + 1) or
               backtrack(r, c + 1, i + 1) or
               backtrack(r, c - 1, i + 1))
               
        board[r][c] = temp  # Backtrack
        return res

    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return True
    return False
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Word Search](https://leetcode.com/problems/word-search/) | Standard 4-directional DFS backtracking with in-place visited marking. |
| [N-Queens](https://leetcode.com/problems/n-queens/) | Backtrack row by row, keeping track of columns and diagonals being attacked. |
