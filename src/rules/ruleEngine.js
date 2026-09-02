const registeredRules = require('./index');
const normalizeApplication = require('./normalizeApplication');
const { severityForCode, SEVERITY } = require('./severityPolicy');

const STATUS = {
  PASSED: 'PASSED',
  FAILED: 'FAILED',
  NOT_APPLICABLE: 'NOT_APPLICABLE',
};

// `rules` and `now` are injectable so aggregation logic can be tested with fake
// rules in isolation, and age-style rules can be tested deterministically.
function evaluate(rawApplication, { now = new Date(), rules = registeredRules } = {}) {
  const app = normalizeApplication(rawApplication);
  const ruleResults = [];

  for (const rule of rules) {
    if (!rule.appliesTo(app)) {
      ruleResults.push({
        ruleId: rule.id,
        description: rule.description,
        status: STATUS.NOT_APPLICABLE,
      });
      continue;
    }

    const issues = rule.validate(app, { now });

    if (issues.length === 0) {
      ruleResults.push({ ruleId: rule.id, description: rule.description, status: STATUS.PASSED });
      continue;
    }

    for (const issue of issues) {
      ruleResults.push({
        ruleId: rule.id,
        description: rule.description,
        status: STATUS.FAILED,
        code: issue.code,
        severity: severityForCode(issue.code),
        message: issue.message,
      });
    }
  }

  const summary = {
    errors: ruleResults.filter((r) => r.severity === SEVERITY.ERROR).length,
    warnings: ruleResults.filter((r) => r.severity === SEVERITY.WARNING).length,
    passed: ruleResults.filter((r) => r.status === STATUS.PASSED).length,
    notApplicable: ruleResults.filter((r) => r.status === STATUS.NOT_APPLICABLE).length,
  };

  const overallStatus =
    summary.errors > 0 ? 'REJECTED' : summary.warnings > 0 ? 'NEEDS_CORRECTION' : 'VALID';

  return {
    overallStatus,
    evaluatedAt: now.toISOString(),
    summary,
    ruleResults,
  };
}

module.exports = { evaluate };
