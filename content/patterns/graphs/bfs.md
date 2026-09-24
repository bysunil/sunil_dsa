---
title: "Breadth-First Search (BFS)"
---

## When to Use

- Shortest path on unweighted graphs (Grid or Node-based).
- Level-order traversal.
- Finding connected components.

## Edge Cases

- Disconnected components.
- Matrix is empty or starting position blocked.

## Common Mistakes

- Forgetting to mark a node/cell as visited *before* pushing it to the queue.

## 1. Node-Based Template

```python
from collections import deque

def bfs_node(graph: dict[int, list[int]], start_node: int) -> list[int]:
    visited = {start_node}
    queue = deque([start_node])
    traversal_order = []

    while queue:
        node = queue.popleft()
        traversal_order.append(node)

        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

    return traversal_order
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Word Ladder](https://leetcode.com/problems/word-ladder/) | Find the shortest transformation sequence by running BFS on a graph of words. |

## 2. Grid-Based Template

```python
from collections import deque

def bfs_grid(grid: list[list[int]], start_r: int, start_c: int):
    rows, cols = len(grid), len(grid[0])
    visited = {(start_r, start_c)}
    queue = deque([(start_r, start_c, 0)])  # (row, col, distance)

    while queue:
        r, c, dist = queue.popleft()
        # Process cell

        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 0 and (nr, nc) not in visited:
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) | Multi-source BFS to find the minimum time required for all oranges to rot. |
| [01 Matrix](https://leetcode.com/problems/01-matrix/) | Multi-source BFS from all 0s to find the shortest distance to the nearest 0 for each cell. |
| [Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/) | Shortest path on an unweighted grid using BFS. |
