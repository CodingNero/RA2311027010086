# Stage 1

## Notification System Design

### Priority Inbox Approach

The goal of the Priority Inbox is to display the top 'n' most important, unread notifications to the user based on a specific weighting system combined with recency.

**Criteria for Priority Calculation:**
1. **Weight**: 
   - Placements: High priority (Weight: 3)
   - Results: Medium priority (Weight: 2)
   - Events: Low priority (Weight: 1)
2. **Recency**:
   - For notifications with the same weight, the one with the more recent timestamp takes precedence.

**Implementation Logic:**
The backend or fetching logic parses the `Type` field to assign a numeric weight. When an array of notifications is retrieved, it is sorted first in descending order of weight. If weights are identical, a secondary sort is applied in descending order of timestamps. Finally, the list is sliced to return only the top 'n' records as requested by the user's selected limit (e.g., 10, 15, or 20).

### Maintaining the Top 10 Efficiently

Since the system continuously receives new notifications, sorting the entire dataset on every new notification would be inefficient ($O(N \log N)$).

To efficiently maintain the top 10 (or top 'n') notifications in real-time, the ideal data structure to use is a **Priority Queue** implemented via a **Min-Heap**:

1. **Initialization:**
   - Maintain a min-heap of size $n$. The heap property will be defined such that the "smallest" element (the notification with the lowest priority among the top $n$) is at the root.
   
2. **Processing New Notifications:**
   - When a new notification arrives, compare it against the root of the min-heap (the least important of the current top $n$).
   - If the new notification has a higher priority (higher weight, or same weight but more recent) than the root, remove the root and insert the new notification.
   - If the new notification has a lower priority than the root, it can be safely discarded from the priority inbox without entering the heap.

**Time Complexity:**
- Inserting into a heap of size $n$ takes $O(\log n)$ time.
- Processing $M$ incoming streaming notifications takes $O(M \log n)$. 
- Since $n$ is very small (e.g., 10), $\log n$ is a tiny constant, making the operation effectively $O(1)$ per new notification. This makes it highly scalable and optimal for high-volume streams.

### Distinguishing Unread State
The frontend handles distinguishing unread from read state by maintaining a `Set` of viewed notification IDs in the browser's `localStorage`. This prevents database writes for purely client-side read states. The Priority Inbox automatically filters out any ID present in the "viewed" set before passing it through the Priority algorithm.