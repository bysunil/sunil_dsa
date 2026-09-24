---
title: "Greedy Algorithms"
---

## Core Idea

To write greedy algorithms effectively, it helps to recognize that most problems fall into a few predictable structural blueprints or **design patterns**.

Rather than starting from scratch, you usually:

1. Classify the problem.
2. Sort or organize the input when needed.
3. Identify the locally optimal greedy choice.
4. Apply a standard iterative loop.

## Sub Patterns

### 1. Interval / Scheduling Pattern

This is the most common pattern in competitive programming and interviews. You are given a set of intervals with `start` and `end` times and need to maximize or minimize a specific metric.

#### Sub-Types

- **Activity Selection:** Maximize the number of tasks you can complete.
  - Greedy choice: **Sort by earliest end time**.
- **Interval Merging / Insertion:** Combine overlapping events.
  - Greedy choice: **Sort by start time**.
- **Minimum Meeting Rooms:** Find the minimum resources needed to host all events.
  - Greedy choice: **Sort by start time and track end times with a Min-Heap**.

#### Common Problems

| Problem | Core Greedy Idea |
|---|---|
| [Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/) | Sort by end time and keep the maximum number of non-overlapping intervals. |
| [Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) | Sort by end coordinate and shoot an arrow at the earliest possible end. |
| [Merge Intervals](https://leetcode.com/problems/merge-intervals/) | Sort by start time and merge overlapping intervals. |
| [Insert Interval](https://leetcode.com/problems/insert-interval/) | Merge the new interval with all overlapping intervals. |
| [Meeting Rooms](https://leetcode.com/problems/meeting-rooms/) | Sort intervals by start time and check for overlaps. |
| [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) | Sort by start time and use a Min-Heap of ending times. |
| [Partition Labels](https://leetcode.com/problems/partition-labels/) | Track the last occurrence of each character to form maximal partitions. |

#### Standard Python Template — Activity Selection

```python
def max_activities(intervals):
    # Step 1: Sort intervals by their END times
    intervals.sort(key=lambda x: x[1])

    count = 0
    last_end_time = float("-inf")
    result = []

    # Step 2: Iterate and greedily pick the next compatible interval
    for start, end in intervals:
        if start >= last_end_time:
            result.append((start, end))
            last_end_time = end
            count += 1

    return count, result
```

---

### 2. Two-Pointer / Two-End Pattern

This pattern applies when your input array is sorted, and you can achieve a goal by comparing elements from opposite ends (or staggered positions) of the array to make a locally optimal choice.

#### Sub-Types

- **Boat / Container Packing (e.g., LeetCode 881):** Minimize the number of boats to carry people under a weight limit.
  - Greedy choice: **Pair the heaviest person with the lightest person**.
- **Container With Most Water:** Move pointers inward based on whichever boundary is shorter.
- **Pairing / Matching:** Sort both sides and greedily match the smallest compatible elements.

#### Common Problems

| Problem | Core Greedy Idea |
|---|---|
| [Boats to Save People](https://leetcode.com/problems/boats-to-save-people/) | Pair the heaviest person with the lightest person whenever possible. |
| [Container With Most Water](https://leetcode.com/problems/container-with-most-water/) | Move the pointer at the shorter boundary because the shorter side limits the area. |
| [Assign Cookies](https://leetcode.com/problems/assign-cookies/) | Sort children and cookies, then give each child the smallest cookie that satisfies them. |
| [Bag of Tokens](https://leetcode.com/problems/bag-of-tokens/) | Use the smallest token to gain score and the largest token to regain power when needed. |
| [Two City Scheduling](https://leetcode.com/problems/two-city-scheduling/) | Sort people by the difference in cost between the two cities and assign greedily. |

#### Standard Python Template — Boats to Save People

```python
def num_rescue_boats(people, limit):
    # Step 1: Sort the weights
    people.sort()

    left = 0
    right = len(people) - 1
    boats = 0

    # Step 2: Greedily pair opposite extremes
    while left <= right:
        if left == right:
            # Only one person left
            boats += 1
            break

        # If heaviest + lightest fit, they share a boat
        if people[left] + people[right] <= limit:
            left += 1

        # Heaviest always gets a boat
        # (either alone or with the lightest)
        right -= 1
        boats += 1

    return boats
```

---

### 3. Priority Queue / Heap Pattern

When the **locally optimal choice changes dynamically** as the algorithm processes data, a static sort is not enough.

You need a data structure that continuously extracts the global maximum or minimum efficiently.

#### Sub-Types

- **Huffman Coding / Rope Cutting:** Continually merge the two smallest elements to minimize overall cost.
- **Task Scheduler / Cooling Time:** Pick the available task with the highest remaining frequency.
- **Graph Traversal:** Dijkstra's Algorithm and Prim's Algorithm use a Min-Heap to greedily select the closest unvisited node.
- **Resource Allocation:** Continuously choose the resource or task that gives the best current outcome.

#### Common Problems

| Problem | Core Greedy Idea |
|---|---|
| [Last Stone Weight](https://leetcode.com/problems/last-stone-weight/) | Repeatedly process the two largest stones using a Max-Heap. |
| [IPO](https://leetcode.com/problems/ipo/) | Among affordable projects, repeatedly choose the one with maximum profit. |
| [Furthest Building You Can Reach](https://leetcode.com/problems/furthest-building-you-can-reach/) | Use a Min-Heap to reserve ladders for the largest climbs. |
| [Task Scheduler](https://leetcode.com/problems/task-scheduler/) | Schedule the most frequent remaining tasks while respecting cooldown periods. |
| [Minimum Cost to Connect Sticks](https://leetcode.com/problems/minimum-cost-to-connect-sticks/) | Repeatedly combine the two smallest sticks. |
| [Reorganize String](https://leetcode.com/problems/reorganize-string/) | Repeatedly select the most frequent available character while avoiding adjacent duplicates. |

#### Standard Python Template — Connect Ropes with Minimum Cost

```python
import heapq

def min_cost_to_connect_ropes(ropes):
    # Step 1: Transform list into a Min-Heap
    heapq.heapify(ropes)
    total_cost = 0

    # Step 2: Greedily combine the two smallest elements
    while len(ropes) > 1:
        first = heapq.heappop(ropes)
        second = heapq.heappop(ropes)

        current_cost = first + second
        total_cost += current_cost

        # Push the combined result back into the heap
        heapq.heappush(ropes, current_cost)

    return total_cost
```

---

### 4. Value-to-Weight Ratio Pattern

Used when items have multiple dimensions—usually a cost/benefit and a size/weight—and you have a constrained budget or capacity.

#### Sub-Types

- **Fractional Knapsack:** Maximize total value by taking fractions of items.
  - Greedy choice: **Sort by value density, i.e., Value / Weight**.
- **Gas Station Problem:** Calculate if you can complete a circuit based on the net difference of gas vs. distance.
- **Profit / Cost Prioritization:** Select items or opportunities according to the best immediate benefit relative to the available constraint.

#### Common Problems

| Problem | Core Greedy Idea |
|---|---|
| [Fractional Knapsack](https://www.geeksforgeeks.org/problems/fractional-knapsack-1587115620/1) | Sort items by value/weight ratio and take the highest-density items first. |
| [Gas Station](https://leetcode.com/problems/gas-station/) | If the total gas is sufficient, greedily restart the candidate start after a failed segment. |
| [Jump Game](https://leetcode.com/problems/jump-game/) | Maintain the farthest index reachable so far. |
| [Jump Game II](https://leetcode.com/problems/jump-game-ii/) | Expand the current reachable range and greedily jump when the range ends. |
| [Minimum Number of Refueling Stops](https://leetcode.com/problems/minimum-number-of-refueling-stops/) | Use a Max-Heap to choose the largest available fuel amounts when refueling is necessary. |
| [Candy](https://leetcode.com/problems/candy/) | Make locally valid assignments while respecting both left and right neighbor constraints. |

#### Standard Python Template — Fractional Knapsack

```python
def fractional_knapsack(capacity, items):
    # items format: [(value, weight), ...]

    # Step 1: Sort by value/weight ratio in descending order
    items.sort(key=lambda x: x[0] / x[1], reverse=True)

    total_value = 0.0

    # Step 2: Take as much of the densest item as possible
    for value, weight in items:
        if capacity >= weight:
            capacity -= weight
            total_value += value
        else:
            # Take the fractional part of the remaining item
            total_value += value * (capacity / weight)
            break  # Knapsack is completely full

    return total_value
```
