---
title: "Node-Based Graph Algorithms"
related_problems:
  - name: "Course Schedule"
    url: "https://leetcode.com/problems/course-schedule/"
  - name: "Network Delay Time"
    url: "https://leetcode.com/problems/network-delay-time/"
---

## When to use

- Problems explicitly giving nodes and edges, typically represented as an adjacency list.
- Shortest path problems (Dijkstra, Bellman-Ford, Floyd-Warshall).
- Connectivity and traversal (BFS, DFS).
- Dependency resolution or cycle detection (Topological Sort).
- Minimum Spanning Trees (Kruskal, Prim).

## Edge Cases

- Disconnected graphs (multiple components).
- Graphs with cycles (directed or undirected).
- Negative weight edges (Dijkstra fails here, use Bellman-Ford).
- Multiple edges between the same pair of nodes.
- Self-loops.

## Common Mistakes

- Forgetting to track `visited` nodes in BFS/DFS, resulting in infinite loops.
- Using Dijkstra on a graph with negative edge weights.
- Misinterpreting undirected edges as directed (forgetting to add the reverse edge `v -> u`).
- Popping from a PQ in Dijkstra and forgetting to check if `current_dist > distances[current_node]` to avoid processing stale nodes.

## Sub Patterns

### 1. Breadth-First Search (BFS)

```python
from collections import deque

def bfs_node(graph: dict, start_node):
    visited = {start_node}
    queue = deque([start_node])

    while queue:
        node = queue.popleft()
        # Process node
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
```

### 2. Depth-First Search (DFS - Recursive & Iterative)

```python
def dfs_node_recursive(graph: dict, node, visited=None):
    if visited is None:
        visited = set()
    visited.add(node)
    # Process node
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_node_recursive(graph, neighbor, visited)

def dfs_node_iterative(graph: dict, start_node):
    visited = set()
    stack = [start_node]

    while stack:
        node = stack.pop()
        if node not in visited:
            visited.add(node)
            # Process node
            for neighbor in reversed(graph[node]):
                if neighbor not in visited:
                    stack.append(neighbor)
```

### 3. Dijkstra's Algorithm

```python
import heapq

def dijkstra_node(graph: dict, start, num_nodes: int):
    """graph: {node: [(neighbor, weight), ...]}"""
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]  # (distance, node)

    while pq:
        current_dist, current_node = heapq.heappop(pq)

        if current_dist > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node]:
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(pq, (distance, neighbor))
    return distances
```

### 4. Kahn's Topological Sort (DAGs)

```python
from collections import deque

def topological_sort_kahn(num_nodes: int, edges: list[tuple]):
    """edges: list of pairs (u, v) representing directed edge u -> v"""
    graph = {i: [] for i in range(num_nodes)}
    in_degree = [0] * num_nodes

    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1

    queue = deque([i for i in range(num_nodes) if in_degree[i] == 0])
    topo_order = []

    while queue:
        node = queue.popleft()
        topo_order.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return topo_order if len(topo_order) == num_nodes else []
```
