# Design Decisions

Decision first, then why — answers to the assignment's open questions, plus
the assumptions made along the way.

## Rule representation

**Decision:** plain JS modules, one per rule
(`{ id, description, appliesTo(app), validate(app, { now }) }`), explicitly
registered in `src/rules/index.js`.

**Why:** these rules branch on conditions ("if married...", "if
dependent..."); a JSON/YAML config would need its own mini-language for that.
Plain code is simpler, unit-testable, and needs no DSL to read.

## Rule priority, order & conflicts

**Decision:** rules run in the spec's order, but order is cosmetic — and
conflicts can't happen by construction.

**Why:** every rule is a pure function over one normalized snapshot; none
reads another's result or shares state. Reordering the registry only changes
display order. (If a future rule set ever needed a tie-break, registry order
is the fallback — unused today.)

## Error handling

**Decision:** collect every violation in one pass; never stop at the first
failure.

**Why:** a caller correcting an application needs the full list in one round
trip, not one error per request.

## Severity levels

**Decision:** severity is looked up per **issue code**, not fixed per rule —
one rule can fail for reasons of different severity (e.g. missing DOB vs. one
in the future).

| Field category                                                                                   | Missing          | Present but invalid |
| ------------------------------------------------------------------------------------------------ | ---------------- | ------------------- |
| Required on every application (SSN, DOB, state)                                                  | WARNING          | ERROR               |
| Required by a condition that holds (parent income if dependent; spouse info if married)          | WARNING          | ERROR               |
| Comparison-only, not independently mandated (household counts; whichever income field is absent) | `NOT_APPLICABLE` | ERROR               |

Missing data is incomplete and correctable; present-but-wrong data is a real
violation. Overall status is `REJECTED` (any error) / `NEEDS_CORRECTION`
(warnings only) / `VALID` (neither).

## Performance

**Decision:** stateless, synchronous, in-memory — no database, no I/O.

**Why:** each request is independent and O(rule count), so scaling is just
adding replicas; the assignment never asks for persistence.

## Extensibility

**Decision:** a new rule = one file + one line in `src/rules/index.js`. No
auto-discovery.

**Why:** explicit registration keeps the rule set readable top-to-bottom and
safe to reason about live.

## Assumptions and edge cases

- `dependencyStatus`/`maritalStatus`: not rules themselves, only branched on.
  An invalid enum value is a 400 (breaks the rules that depend on it);
  outright absence isn't invented as an 8th rule.
- SSN: literal "9 digits" (`^\d{9}$`) — dashes rejected, JSON numbers rejected
  (would lose a leading zero).
- State codes: 50 states + DC; territories excluded per the literal spec,
  kept in an isolated constant.
- Household counts: missing either → `NOT_APPLICABLE` (nothing to compare),
  not a warning — no rule requires these independently. No scope creep to
  reject zero/negative counts.
- Income: only checks whichever field is present; `0` always counts as
  present, never "missing."
- Age: computed against an injectable clock, never a hardcoded date, so
  boundary tests are deterministic.

## Time spent

I spent the first 30 minutes going over exactly how I wanted the project to look. I broke down what language I wanted to use, testing method, ensuring I had a dockerfile and was able to test / run the service locally. I went over the requirements, listing what I thought was most important to focus on. Then I built an advanced prompt with Claude and started a planning session. Inside the planning session I made sure everything looked architecturally correct and lined up with the requirements I was given. Then I fanned out specialized agents for testing, platform design, and security to check the work my main agent did during planning. Then I let Claude build out the actual source code, which took about 45 minutes between the coding and reviews. Then I spent the rest of the time reviewing manually what was built and making sure it lived up to what I had in mind. I made many small tweaks along the way. In total it took just under 2 hours. 
