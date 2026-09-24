---
title: "Disjoint Set Union (DSU / Union-Find)"
---

## When to use

- You need to group elements into connected components.
- You need to efficiently determine if two elements belong to the same group/component.
- You are dealing with dynamic connectivity, where edges (connections) are added iteratively.
- Useful for Kruskal's Minimum Spanning Tree algorithm.

## Edge Cases

- 1-based indexing vs 0-based indexing for nodes.
- Disconnected graph initially.

## Common Mistakes

- Forgetting Path Compression in the `find` function, leading to `O(N)` time instead of near `O(1)`.
- Forgetting Union by Rank (or Size) in the `union` function, which can also lead to unbalanced trees.
- Mixing up 0-indexed nodes with 1-indexed problem statements.

## Sub Patterns

### Standard DSU with Path Compression and Union by Rank

```python
class DSU:
    def __init__(self, size: int):
        self.parent = list(range(size))
        self.rank = [1] * size
        self.components = size

    def find(self, i: int) -> int:
        if self.parent[i] != i:
            self.parent[i] = self.find(self.parent[i])  # Path compression
        return self.parent[i]

    def union(self, i: int, j: int) -> bool:
        root_i = self.find(i)
        root_j = self.find(j)

        if root_i != root_j:
            # Union by rank
            if self.rank[root_i] > self.rank[root_j]:
                self.parent[root_j] = root_i
            elif self.rank[root_i] < self.rank[root_j]:
                self.parent[root_i] = root_j
            else:
                self.parent[root_j] = root_i
                self.rank[root_i] += 1
            self.components -= 1
            return True
        return False
```

#### Common Problems

| Problem | Core Idea |
|---|---|
| [Number of Provinces](https://leetcode.com/problems/number-of-provinces/) | Find the number of connected components in an undirected graph. |
| [Redundant Connection](https://leetcode.com/problems/redundant-connection/) | Detect a cycle in an undirected graph by checking if two nodes being connected are already in the same set. |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge/) | Group accounts that share common emails using DSU. |
| [Most Stones Removed with Same Row or Column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/) | Group stones sharing a row or column, then the max removed is total stones - components. |
