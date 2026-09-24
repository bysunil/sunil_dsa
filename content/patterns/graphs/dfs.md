---
title: "Depth-First Search (DFS)"
---

## When to Use

- Cycle detection.
- Path finding (e.g. back-tracking).
- Exploring connected components (like islands in a grid).

## 1. Node-Based Template

```python
def dfs_recursive(
    graph: dict[int, list[int]],
    node: int,
    visited: set[int] | None = None
) -> list[int]:
    if visited is None:
        visited = set()

    visited.add(node)
    result = [node]

    for neighbor in graph.get(node, []):
        if neighbor not in visited:
            result.extend(dfs_recursive(graph, neighbor, visited))

    return result
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Clone Graph](https://leetcode.com/problems/clone-graph/) | Use DFS to recursively deep clone all nodes in a connected undirected graph. |
| [All Paths From Source to Target](https://leetcode.com/problems/all-paths-from-source-to-target/) | Find all possible paths using a backtracking DFS. |

## 2. Grid-Based Template

```python
def dfs_grid(grid: list[list[int]], r: int, c: int, visited: set):
    rows, cols = len(grid), len(grid[0])
    visited.add((r, c))

    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 0 and (nr, nc) not in visited:
            dfs_grid(grid, nr, nc, visited)
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Number of Islands](https://leetcode.com/problems/number-of-islands/) | Count the number of connected components of 1s using DFS. |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island/) | Traverse all components and find the one with the maximum area. |
| [Surrounded Regions](https://leetcode.com/problems/surrounded-regions/) | Start DFS from 'O's on the border to mark them as safe, then capture the rest. |
