# Redis Caching Benchmark Results

This document shows the performance improvements after integrating Redis caching for Spotify API requests in TuneVote.


| Metric                  | **Before Cache**          | **After Cache** | **Expected Outcome**      | **Actual Outcome**                       |
| ----------------------- | ------------------------- | --------------- | ------------------------- | ---------------------------------------- |
| **Mean Response Time**  | ~46ms early, avg ~10–12ms | ~7ms            | Should decrease           | Reduced to ~7ms, significant improvement |
| **Max Response Time**   | 548ms → 103ms → 85ms      | 72ms            | Should reduce big spikes  | Max spikes reduced to 72ms               |
| **P95**                 | 399ms → 27ms → 22ms       | 19–20ms         | Should drop significantly | Dropped to ~19–20ms                      |
| **P99**                 | 528ms → 62ms              | 39ms            | Should drop significantly | Dropped to 39ms                          |
| **Median**              | 7–12ms                    | 3–7ms           | Should reduce             | Median reduced to 3–7ms                  |
| **Request Rate**        | 10/sec                    | 10/sec          | Should remain stable      | Remained stable at 10/sec                |
| **Session Length Mean** | 15–18s                    | 12–14s          | Should reduce             | Reduced slightly to 12–14s               |
| **Failed Requests**     | 0                         | 0               | Should be 0               | No failed requests                       |
