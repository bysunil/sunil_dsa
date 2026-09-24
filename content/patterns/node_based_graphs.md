---
title: "Node-Based Graph Algorithms"
related_problems:
  - name: "Course Schedule"
    url: "https://leetcode.com/problems/course-schedule/"
  - name: "Network Delay Time"
    url: "https://leetcode.com/problems/network-delay-time/"
  - name: "Cheapest Flights Within K Stops"
    url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/"
  - name: "Critical Connections in a Network"
    url: "https://leetcode.com/problems/critical-connections-in-a-network/"
---

## When to Use

- Problems explicitly giving nodes and edges, typically represented as an adjacency list or edge list.
- Shortest path problems (Dijkstra, Bellman-Ford, Floyd-Warshall).
- Connectivity and traversal (BFS, DFS).
- Finding Strongly Connected Components (SCCs) in directed graphs (Kosaraju, Tarjan).
- Dependency resolution or cycle detection in Directed Acyclic Graphs (Topological Sort).
- Minimum Spanning Trees (Kruskal, Prim).

## Edge Cases

- **Disconnected graphs:** Multiple components requiring outer loops over all vertices.
- **Cycles:** Both directed cycles (causing infinite loops or topo sort failure) and undirected cycles.
- **Negative weight edges:** Standard Dijkstra produces incorrect results; use Bellman-Ford or SPFA instead.
- **Negative weight cycles:** Causes infinite relaxation paths; Bellman-Ford can detect them.
- **Parallel/multiple edges:** Taking only the minimum edge weight between pairs when constructing matrices or adjacency lists.
- **Self-loops:** Edges connecting `u -> u`; must be handled correctly in cycle detection and degree counts.

## Common Mistakes

- Forgetting to track `visited` nodes in BFS/DFS, resulting in recursion depth errors or infinite loops.
- Using Dijkstra on graphs with negative edge weights.
- Misinterpreting undirected edges as directed (forgetting to register the reverse edge `v -> u`).
- Forgetting the staleness check (`current_dist > distances[current_node]`) after popping from Dijkstra's priority queue.
- Missing the $N$-th relaxation pass in Bellman-Ford to catch negative-weight cycles.
- Overlooking Floyd-Warshall for dense, small graphs ($V \le 400$) where all-pairs shortest paths are required.
- Forgetting to transpose/reverse edges in Kosaraju's second DFS pass.
- In Tarjan's SCC algorithm, updating `low[u]` using `low[v]` instead of `discovery_time[v]` when node `v` is already on the stack.

## Sub Patterns

### 1. Breadth-First Search (BFS)

Used for level-order traversal, unweighted shortest paths, and connectivity checks.

- **Time Complexity:** $O(V + E)$
- **Space Complexity:** $O(V)$

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

### 2. Depth-First Search (DFS)

Used for reachability, cycle detection, path finding, and component counting.

- **Time Complexity:** $O(V + E)$
- **Space Complexity:** $O(V)$

#### Recursive Implementation

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

#### Iterative Implementation

```python
def dfs_iterative(graph: dict[int, list[int]], start_node: int) -> list[int]:
    visited = set()
    stack = [start_node]
    result = []

    while stack:
        node = stack.pop()

        if node not in visited:
            visited.add(node)
            result.append(node)

            # Push in reverse to match recursive exploration order
            for neighbor in reversed(graph.get(node, [])):
                if neighbor not in visited:
                    stack.append(neighbor)

    return result
```

### 3. Dijkstra's Algorithm

Finds single-source shortest paths on non-negative weighted graphs.

- **Time Complexity:** $O((V + E) \log V)$
- **Space Complexity:** $O(V)$

```python
import heapq

def dijkstra(
    graph: dict[int, list[tuple[int, float]]],
    start: int,
    num_nodes: int
) -> dict[int, float]:
    """
    graph: {u: [(v, weight), ...]}
    """
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

### 4. Kahn's Algorithm (Topological Sort / DAGs)

Finds topological ordering and detects directed cycles via in-degrees.

- **Time Complexity:** $O(V + E)$
- **Space Complexity:** $O(V + E)$

```python
from collections import deque

def topological_sort_kahn(
    num_nodes: int,
    edges: list[tuple[int, int]]
) -> list[int]:
    """
    edges: list of pairs (u, v) representing directed edge u -> v
    """
    graph = {i: [] for i in range(num_nodes)}
    in_degree = [0] * num_nodes

    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1

    queue = deque(
        i for i in range(num_nodes)
        if in_degree[i] == 0
    )
    topo_order = []

    while queue:
        node = queue.popleft()
        topo_order.append(node)

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1

            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If all nodes are processed, no directed cycle exists.
    return topo_order if len(topo_order) == num_nodes else []
```

### 5. Bellman-Ford Algorithm

Finds single-source shortest paths on graphs that may contain negative weights and detects negative cycles.

- **Time Complexity:** $O(V \cdot E)$
- **Space Complexity:** $O(V)$

```python
def bellman_ford(
    num_nodes: int,
    edges: list[tuple[int, int, float]],
    start: int
) -> list[float] | None:
    """
    edges: list of (u, v, weight) representing directed edge u -> v
    Returns None if a negative-weight cycle reachable from start is detected.
    """
    distances = [float("inf")] * num_nodes
    distances[start] = 0

    # Relax all edges |V| - 1 times
    for _ in range(num_nodes - 1):
        updated = False

        for u, v, weight in edges:
            if (
                distances[u] != float("inf")
                and distances[u] + weight < distances[v]
            ):
                distances[v] = distances[u] + weight
                updated = True

        if not updated:
            break

    # |V|-th pass: Check for negative-weight cycles
    for u, v, weight in edges:
        if (
            distances[u] != float("inf")
            and distances[u] + weight < distances[v]
        ):
            return None  # Negative-weight cycle detected

    return distances
```

### 6. Floyd-Warshall Algorithm

Computes all-pairs shortest paths using dynamic programming.

- **Time Complexity:** $O(V^3)$
- **Space Complexity:** $O(V^2)$

```python
def floyd_warshall(
    num_nodes: int,
    edges: list[tuple[int, int, float]]
) -> list[list[float]] | None:
    """
    edges: list of (u, v, weight) representing directed edge u -> v
    Returns None if a negative cycle is detected.
    """
    dist = [[float("inf")] * num_nodes for _ in range(num_nodes)]

    for i in range(num_nodes):
        dist[i][i] = 0

    for u, v, weight in edges:
        dist[u][v] = min(dist[u][v], weight)

    for k in range(num_nodes):
        for i in range(num_nodes):
            for j in range(num_nodes):
                if (
                    dist[i][k] != float("inf")
                    and dist[k][j] != float("inf")
                ):
                    dist[i][j] = min(
                        dist[i][j],
                        dist[i][k] + dist[k][j]
                    )

    # Check for negative-weight cycles
    for i in range(num_nodes):
        if dist[i][i] < 0:
            return None

    return dist
```

### 7. Kosaraju's Algorithm (SCCs)

Finds all Strongly Connected Components in a directed graph using two passes of DFS.

- **Time Complexity:** $O(V + E)$
- **Space Complexity:** $O(V + E)$

```python
from collections import defaultdict

def kosaraju_scc(
    num_nodes: int,
    edges: list[tuple[int, int]]
) -> list[list[int]]:
    """
    edges: list of pairs (u, v) representing directed edge u -> v
    """
    graph = defaultdict(list)
    rev_graph = defaultdict(list)

    for u, v in edges:
        graph[u].append(v)
        rev_graph[v].append(u)

    visited = set()
    order = []

    def dfs1(node: int) -> None:
        visited.add(node)

        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs1(neighbor)

        order.append(node)

    for node in range(num_nodes):
        if node not in visited:
            dfs1(node)

    visited.clear()
    sccs = []

    def dfs2(node: int, component: list[int]) -> None:
        visited.add(node)
        component.append(node)

        for neighbor in rev_graph[node]:
            if neighbor not in visited:
                dfs2(neighbor, component)

    for node in reversed(order):
        if node not in visited:
            component = []
            dfs2(node, component)
            sccs.append(component)

    return sccs
```

### 8. Tarjan's Algorithm (SCCs)

Finds all Strongly Connected Components in a directed graph in a single DFS pass using discovery times and low-link values.

- **Time Complexity:** $O(V + E)$
- **Space Complexity:** $O(V)$

```python
from collections import defaultdict

def tarjan_scc(
    num_nodes: int,
    edges: list[tuple[int, int]]
) -> list[list[int]]:
    """
    edges: list of pairs (u, v) representing directed edge u -> v
    """
    graph = defaultdict(list)

    for u, v in edges:
        graph[u].append(v)

    discovery_time = [-1] * num_nodes
    low = [-1] * num_nodes
    on_stack = [False] * num_nodes
    stack = []
    sccs = []
    timer = 0

    def dfs(u: int) -> None:
        nonlocal timer

        discovery_time[u] = low[u] = timer
        timer += 1

        stack.append(u)
        on_stack[u] = True

        for v in graph[u]:
            if discovery_time[v] == -1:
                dfs(v)
                low[u] = min(low[u], low[v])

            elif on_stack[v]:
                # Back-edge to an ancestor on the stack
                low[u] = min(low[u], discovery_time[v])

        # If u is the root of an SCC
        if low[u] == discovery_time[u]:
            component = []

            while True:
                w = stack.pop()
                on_stack[w] = False
                component.append(w)

                if w == u:
                    break

            sccs.append(component)

    for i in range(num_nodes):
        if discovery_time[i] == -1:
            dfs(i)

    return sccs
```
