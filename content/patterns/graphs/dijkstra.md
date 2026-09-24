---
title: "Dijkstra's Algorithm"
---

## When to Use

- Finding single-source shortest paths on non-negative weighted graphs.
- Works on both node-based graphs (adjacency lists) and grid-based graphs.

## Edge Cases

- Negative weight edges (Standard Dijkstra will fail, use Bellman-Ford).
- Unreachable nodes (distance remains infinity).

## 1. Node-Based Template

```python
import heapq

def dijkstra(
    graph: dict[int, list[tuple[int, float]]],
    start: int,
    num_nodes: int
) -> dict[int, float]:
    distances = {i: float("inf") for i in range(num_nodes)}
    distances[start] = 0
    pq = [(0, start)]  # (distance, node)

    while pq:
        current_dist, current_node = heapq.heappop(pq)

        # Skip stale entries
        if current_dist > distances[current_node]:
            continue

        for neighbor, weight in graph.get(current_node, []):
            new_dist = current_dist + weight

            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))

    return distances
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Network Delay Time](https://leetcode.com/problems/network-delay-time/) | Find the longest of all shortest paths from the source using Dijkstra's algorithm. |
| [Path with Maximum Probability](https://leetcode.com/problems/path-with-maximum-probability/) | Use Dijkstra but with a max-heap and multiply probabilities instead of adding weights. |

## 2. Grid-Based Template

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

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/) | Use Dijkstra's algorithm to find a path that minimizes the maximum absolute difference in heights. |
| [Swim in Rising Water](https://leetcode.com/problems/swim-in-rising-water/) | Find the path that minimizes the maximum elevation along the way using Dijkstra with a priority queue. |
