# Fix #1: Chart recomputes fertility status for every column

Goal: the chart computes the fertility status (sympto) at most once per cycle,
looked up by date, independent of render order — with identical line output.

- [x] Baseline: run existing test suite (green)
- [x] Characterization tests for `nfpLines` (current output for fhm/ltl lines per date)
- [x] Regression test: rendering the chart calls sympto at most once per cycle (red on current code)
- [x] Test: results are independent of call order (red on current code if instance is shared)
- [x] Implement: cache status by cycle start date in `nfpLines`; create one instance per chart and pass to `DayColumn`
- [x] All tests + lint green
- [ ] Manual check with 10y mock CSV (chart opens fast, lines unchanged)

# Fix #2/#3 (option D): let Realm do the searching

Goal: `lib/cycle.js` no longer scans Realm results in JS; it asks a repository
(Realm queries in prod, in-memory in tests). No behaviour change.

- [x] Verify Realm supports string `<`/`>` (realm-core 13.27+ changelog)
- [x] Route existing cycle specs through one helper (setup only, assertions untouched)
- [x] Close coverage gaps on current code: getStats, cycle-start write path, sympto-adapter earlier cycles
- [x] All 127 tests green on current code
- [x] `lib/cycle-day-repository.ts` interface + test-only in-memory implementation
- [x] `lib/cycle.js`: `createCycleModule(repository, options)`; drop `opts` + hidden `require('../db')`
- [x] `db/realm-cycle-day-repository.ts`; one module instance per opened db (`getCycleModule()`)
- [x] Switch call sites to `getCycleModule()`; update test mocks (setup only)
- [x] All tests + lint green
- [ ] Device check with 10y mock CSV: Home, Stats, saving bleeding (cycle start moves)

# Fix A: Home's fertility status

A1 — give sympto only the fields it needs (no deep JSON clone of whole Realm objects)
A2 — cache cycle statuses; invalidate on every db write, on date change, on secondary-symptom change

- [x] Characterization tests for what sympto receives (excluded / incomplete values dropped, values flattened) — green on current code
- [x] Cache tests (repeat call doesn't recompute; write / new day / setting change does) — red on current code
- [x] A1: pick fields instead of `JSON.parse(JSON.stringify(day))`
- [x] A2: `getDataVersion()` bumped by every db write + openDb; status cache in sympto-adapter
- [x] All tests + tsc green (lint: only the known navigation.tsx error)
- [ ] Device check: back to Home; edit a day then Home shows updated status; toggle cervix/mucus setting
