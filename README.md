# FAFSA-Edit-Service

FAFSA Edit Rule Processor — validates FAFSA application data against 7 required
edit rules and returns a structured, per-rule validation result.

## Requirements

- Node.js 20.x (see `.nvmrc`), **or**
- Docker + Docker Compose

## Quick start (Docker — recommended)

```bash
docker compose up --build
```

The service listens on `http://localhost:3000`. Override the host port with
`PORT=4000 docker compose up --build`. Stop it with `docker compose down`.

## Quick start (local Node)

```bash
npm install
npm run dev     # nodemon, live reload, http://localhost:3000
```

Or without live reload: `npm start`. Override the port with `PORT=4000 npm start`.

## Testing

```bash
npm test               # run the full suite once
npm run test:watch     # watch mode
npm run test:coverage  # coverage report (thresholds: 95% on src/rules, 85% overall)
npm run lint           # ESLint
npm run format         # Prettier --write
```

The suite includes unit tests for every rule and shared helper, plus integration
tests that drive the real HTTP app (via Supertest) with both sample applications
from the assignment.

## API

### `POST /api/v1/applications/validate`

Accepts a FAFSA application and returns a result for all 7 edit rules — an
invalid application is a normal `200` response, not an HTTP error. A `400` is
reserved for a structurally malformed request body (wrong types, bad JSON,
invalid enum values).

**Request** (the assignment's sample valid application):

```json
{
  "studentInfo": {
    "firstName": "Jane",
    "lastName": "Smith",
    "ssn": "123456789",
    "dateOfBirth": "2003-05-15"
  },
  "dependencyStatus": "dependent",
  "maritalStatus": "single",
  "household": { "numberInHousehold": 4, "numberInCollege": 1 },
  "income": { "studentIncome": 5000, "parentIncome": 65000 },
  "stateOfResidence": "CA"
}
```

**Response** `200`:

```json
{
  "overallStatus": "VALID",
  "evaluatedAt": "2026-09-02T05:27:31.461Z",
  "summary": { "errors": 0, "warnings": 0, "passed": 6, "notApplicable": 1 },
  "ruleResults": [
    {
      "ruleId": "student-age",
      "description": "Student must be at least 14 years old",
      "status": "PASSED"
    },
    {
      "ruleId": "ssn-format",
      "description": "SSN must be in valid format (9 digits)",
      "status": "PASSED"
    },
    {
      "ruleId": "dependent-parent-income",
      "description": "If dependency status is \"dependent\", parent income is required",
      "status": "PASSED"
    },
    {
      "ruleId": "income-validation",
      "description": "Income values cannot be negative",
      "status": "PASSED"
    },
    {
      "ruleId": "household-logic",
      "description": "Number in college cannot exceed number in household",
      "status": "PASSED"
    },
    {
      "ruleId": "state-code",
      "description": "State code must be a valid US state abbreviation",
      "status": "PASSED"
    },
    {
      "ruleId": "marital-status",
      "description": "If marital status is \"married\", spouse information is required",
      "status": "NOT_APPLICABLE"
    }
  ]
}
```

**Request** (the assignment's sample invalid application) → **Response** `200`:

```json
{
  "overallStatus": "REJECTED",
  "evaluatedAt": "2026-09-02T05:27:45.374Z",
  "summary": { "errors": 5, "warnings": 3, "passed": 0, "notApplicable": 0 },
  "ruleResults": [
    {
      "ruleId": "student-age",
      "status": "FAILED",
      "code": "UNDER_MINIMUM_AGE",
      "severity": "ERROR",
      "message": "Student must be at least 14 years old (currently 11)."
    },
    {
      "ruleId": "ssn-format",
      "status": "FAILED",
      "code": "INVALID_SSN_FORMAT",
      "severity": "ERROR",
      "message": "Student SSN must be exactly 9 digits."
    },
    {
      "ruleId": "dependent-parent-income",
      "status": "FAILED",
      "code": "MISSING_PARENT_INCOME",
      "severity": "WARNING",
      "message": "Parent income is required when dependency status is \"dependent\"."
    },
    {
      "ruleId": "income-validation",
      "status": "FAILED",
      "code": "NEGATIVE_STUDENT_INCOME",
      "severity": "ERROR",
      "message": "Student income cannot be negative (received -1000)."
    },
    {
      "ruleId": "household-logic",
      "status": "FAILED",
      "code": "COLLEGE_EXCEEDS_HOUSEHOLD",
      "severity": "ERROR",
      "message": "Number in college (5) cannot exceed number in household (2)."
    },
    {
      "ruleId": "state-code",
      "status": "FAILED",
      "code": "INVALID_STATE_CODE",
      "severity": "ERROR",
      "message": "\"XX\" is not a valid US state abbreviation."
    },
    {
      "ruleId": "marital-status",
      "status": "FAILED",
      "code": "MISSING_SPOUSE_NAME",
      "severity": "WARNING",
      "message": "Spouse name is required when married."
    },
    {
      "ruleId": "marital-status",
      "status": "FAILED",
      "code": "MISSING_SPOUSE_SSN",
      "severity": "WARNING",
      "message": "Spouse SSN is required when married."
    }
  ]
}
```

(`descriptions` omitted above for brevity — every entry in the real response
includes one. `overallStatus` is `VALID` / `NEEDS_CORRECTION` (warnings only,
no errors) / `REJECTED` (any error) — see [DECISIONS.md](./DECISIONS.md) for why.
`summary` tallies result entries, not rules — one rule can produce more than one,
e.g. `marital-status` above, so counts can exceed the 7 registered rules.)

**Response `400`** (structurally malformed body, e.g. `household` sent as a string):

```json
{
  "error": "Invalid request body",
  "details": [{ "path": "household", "message": "Expected object, received string" }]
}
```

(Unparseable JSON, e.g. a trailing comma, fails before schema validation and returns
`{ "error": "Malformed JSON body", "details": [] }` instead.)

### `GET /health`

Returns `200 { "status": "ok" }`. Used by the Docker `HEALTHCHECK`.

### Try it

```bash
curl -X POST http://localhost:3000/api/v1/applications/validate \
  -H "Content-Type: application/json" \
  -d '{
    "studentInfo": {"firstName": "Jane", "lastName": "Smith", "ssn": "123456789", "dateOfBirth": "2003-05-15"},
    "dependencyStatus": "dependent",
    "maritalStatus": "single",
    "household": {"numberInHousehold": 4, "numberInCollege": 1},
    "income": {"studentIncome": 5000, "parentIncome": 65000},
    "stateOfResidence": "CA"
  }'
```

## Project structure

```
src/
  app.js, server.js         Express app factory + bootstrap
  middleware/errorHandler.js
  schema/applicationSchema.js  Zod structural validation
  routes/                       validate.route.js, health.route.js
  rules/
    ruleEngine.js               aggregation: collect-all, compute overall status
    normalizeApplication.js
    severityPolicy.js           issue code -> ERROR/WARNING
    index.js                    the 7 rules, registered explicitly
    *.rule.js                   one file per rule
    lib/                        shared helpers (dateUtils, ssnFormat, usStates)
tests/
  unit/                        one spec per rule/helper/module
  integration/                 full HTTP stack via Supertest
```

## Design decisions

See [DECISIONS.md](./DECISIONS.md) for the reasoning behind rule representation,
severity levels, error-handling strategy, and the assignment's other
intentionally open questions.

## Time spent

See the note at the end of [DECISIONS.md](./DECISIONS.md).
