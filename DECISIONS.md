# Design Decisions

Answers to the assignment's open questions, plus the assumptions made along the
way. Each section leads with the decision, then why.

## Rule representation

**Decision:** plain JS modules, one file per rule, each exporting
`{ id, description, appliesTo(app), validate(app, { now }) }`, explicitly
registered in `src/rules/index.js`.

**Why:** these rules have real conditional logic ("if married...", "if
dependent..."), not just static thresholds. A JSON/YAML config would need its
own mini-language for that logic, adding complexity a 7-rule set doesn't
justify. Plain code stays simple, is trivially unit-testable, and is what a
Java/Python-fluent reviewer can read without learning a DSL.

## Rule priority / order

**Decision:** rules run in the order listed in the assignment; order is
cosmetic, not functional.

**Why:** every rule is a pure function over one normalized application
snapshot — none reads another rule's result, and none shares mutable state.
Reordering `src/rules/index.js` only changes display order in the response,
never the outcome.

## Error handling

**Decision:** collect every violation in one pass; never stop at the first
failure.

**Why:** a caller correcting a FAFSA application needs the complete list of
what's wrong in one round trip, not one error per HTTP request.

## Rule conflicts

**Decision:** not possible by construction, given the independence described
above (no shared state, no rule reads another's result). If a future rule
set ever needed a tie-break, registry order is the documented fallback — unused today.

## Severity levels

**Decision:** severity is looked up per **issue code**, not fixed per rule —
a single rule can fail for reasons of different severity (e.g. a missing
date of birth vs. one that's in the future). The policy, applied uniformly:

| Field category                                                                                   | Missing                               | Present but invalid |
| ------------------------------------------------------------------------------------------------ | ------------------------------------- | ------------------- |
| Required on every application (SSN, DOB, state)                                                  | WARNING                               | ERROR               |
| Required by a condition that holds (parent income if dependent; spouse info if married)          | WARNING                               | ERROR               |
| Comparison-only, not independently mandated (household counts; whichever income field is absent) | `NOT_APPLICABLE` (nothing to compare) | ERROR               |

The intuition: **missing data is incomplete and correctable**, so it's a
warning. **Present-but-wrong data is a real violation**, so it's an error.
Overall status is `REJECTED` (any error) / `NEEDS_CORRECTION` (warnings only)
/ `VALID` (neither) — more useful to a caller than a plain valid/invalid flag.

## Performance / throughput

**Decision:** stateless, synchronous, in-memory — no database, no I/O during
evaluation.

**Why:** each request is O(number of rules), independent of every other
request. That makes horizontal scaling trivial (add replicas behind a load
balancer, no shared state to coordinate) and makes a database unnecessary —
the assignment only asks the service to accept data and return a result, not
to persist anything.

## Extensibility

**Decision:** adding a rule means adding one file (`src/rules/<name>.rule.js`)
and one line in `src/rules/index.js`. No auto-discovery magic.

**Why:** explicit registration is one extra line of "cost" per rule, in
exchange for a registry that's readable top-to-bottom and safe to reason
about live (e.g. in an interview) — no surprises from files being picked up
implicitly.

## Assumptions and edge cases

- **`dependencyStatus` / `maritalStatus` validity**: neither is one of the 7
  named rules — they're only branched on. Zod rejects an invalid _enum value_
  for either (400, since it breaks the premise of the rules that branch on
  them), but their outright _absence_ isn't invented as an 8th rule.
- **SSN format**: taken literally as "9 digits" — `^\d{9}$`, dashes rejected
  rather than stripped. A JSON number is rejected at the schema layer (would
  silently lose a leading zero).
- **State codes**: the 50 states + DC. US territories (PR, GU, VI, etc.) are
  excluded per the literal spec wording; kept as an isolated, easily-extended
  constant (`src/rules/lib/usStates.js`) since that's the most likely thing
  to change first.
- **Household counts**: if either count is missing, `household-logic` is
  `NOT_APPLICABLE` (nothing to compare) rather than a warning — unlike SSN/DOB
  /state, no rule in the spec independently requires these counts to be
  present. No scope expansion to also reject zero/negative counts; the spec
  only bounds college count by household count.
- **Income fields**: `income-validation` checks whichever of
  `studentIncome`/`parentIncome` is present; a missing field is not a
  violation of that rule (only `dependent-parent-income` mandates
  `parentIncome`'s presence, and only when dependent). `0` is always treated
  as present, never as "missing" (a truthiness check would wrongly treat a
  $0 income as absent).
- **Age**: computed against an injectable clock (defaults to `new Date()`),
  never a hardcoded date, so boundary tests (exact birthday, leap-day DOB) are
  deterministic rather than wall-clock-dependent.

## Time spent

Documented honestly in the PR/submission notes.
