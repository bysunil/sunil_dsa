---
title: "Grid-Based Graph Algorithms (2D Matrices)"
related_problems:
  - name: "Number of Islands"
    url: "https://leetcode.com/problems/number-of-islands/"
  - name: "Rotting Oranges"
    url: "https://leetcode.com/problems/rotting-oranges/"
---

## When to use

- You are given a 2D grid/matrix.
- You need to find the shortest path from start to end (Grid BFS).
- You need to explore connected components like islands (Grid DFS/BFS).

## Edge Cases

- Matrix is empty `len(grid) == 0`.
- Starting position is blocked.
- Reaching out of bounds (always check `0 <= r < rows` and `0 <= c < cols`).

## Common Mistakes

- Forgetting to mark a cell as visited *before* pushing it to the queue in BFS (leads to huge queues and Memory Limit Exceeded).
- Mixing up rows and columns indices.

## Sub Patterns

### 1. Grid BFS

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

### 2. Grid DFS

```python
def dfs_grid(grid: list[list[int]], r: int, c: int, visited: set):
    rows, cols = len(grid), len(grid[0])
    visited.add((r, c))

    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        nr, nc = r + dr, c + dc
        if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] != 0 and (nr, nc) not in visited:
            dfs_grid(grid, nr, nc, visited)
```

### 3. Grid Dijkstra

```python
import heapq

def dijkstra_grid(grid: list[list[int]], start_r: int, start_c: int):
    rows, cols = len(grid), len(grid[0])
    distances = [[float('inf')] * cols for _ in range(rows)]
    distances[start_r][start_c] = grid[start_r][start_c]

    pq = [(grid[start_r][start_c], start_r, start_c)]  # (cost, row, col)

    while pq:
        current_cost, r, c = heapq.heappop(pq)

        if current_cost > distances[r][c]:
            continue

        for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                next_cost = current_cost + grid[nr][nc]
                if next_cost < distances[nr][nc]:
                    distances[nr][nc] = next_cost
                    heapq.heappush(pq, (next_cost, nr, nc))
    return distances
```
