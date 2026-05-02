# Stage 1

## Priority Inbox Design

### Approach
Notifications are ranked using a combination of weight and recency.

### Weight System
- Placement = 3 (highest)
- Result = 2
- Event = 1 (lowest)

### Algorithm
1. Fetch all notifications from the API
2. Sort by weight (descending), then by timestamp (most recent first) as tiebreaker
3. Return top N notifications

### Maintaining Top N Efficiently
To handle continuous incoming notifications efficiently, a **min-heap of size N** can be used:
- Push each notification into the heap
- If heap size exceeds N, remove the lowest priority item
- This gives O(log N) insertion and O(1) access to top N

This ensures we never need to re-sort the entire list as new notifications arrive.