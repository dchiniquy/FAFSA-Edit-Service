const SEVERITY = {
  ERROR: 'ERROR',
  WARNING: 'WARNING',
};

// Explicit code -> severity map (not a naming-convention/prefix guess) so every new
// issue code is a deliberate, reviewable addition here. General policy this encodes:
//   - a field required on every application, when missing        -> WARNING (incomplete)
//   - a field required by a condition that holds, when missing    -> WARNING (incomplete)
//   - any field that is present but structurally/logically invalid -> ERROR
const CODE_SEVERITY = {
  MISSING_DOB: SEVERITY.WARNING,
  INVALID_DOB: SEVERITY.ERROR,
  DOB_IN_FUTURE: SEVERITY.ERROR,
  UNDER_MINIMUM_AGE: SEVERITY.ERROR,

  MISSING_SSN: SEVERITY.WARNING,
  INVALID_SSN_FORMAT: SEVERITY.ERROR,

  MISSING_PARENT_INCOME: SEVERITY.WARNING,

  NEGATIVE_STUDENT_INCOME: SEVERITY.ERROR,
  NEGATIVE_PARENT_INCOME: SEVERITY.ERROR,

  COLLEGE_EXCEEDS_HOUSEHOLD: SEVERITY.ERROR,

  MISSING_STATE: SEVERITY.WARNING,
  INVALID_STATE_CODE: SEVERITY.ERROR,

  MISSING_SPOUSE_NAME: SEVERITY.WARNING,
  MISSING_SPOUSE_SSN: SEVERITY.WARNING,
  INVALID_SPOUSE_SSN_FORMAT: SEVERITY.ERROR,
};

function severityForCode(code) {
  const severity = CODE_SEVERITY[code];
  if (!severity) {
    throw new Error(`Unknown issue code: ${code}`);
  }
  return severity;
}

module.exports = { SEVERITY, severityForCode };
