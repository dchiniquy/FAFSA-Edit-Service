const { severityForCode, SEVERITY } = require('../../../src/rules/severityPolicy');

describe('severityForCode', () => {
  it.each([
    ['MISSING_DOB', 'WARNING'],
    ['INVALID_DOB', 'ERROR'],
    ['DOB_IN_FUTURE', 'ERROR'],
    ['UNDER_MINIMUM_AGE', 'ERROR'],
    ['MISSING_SSN', 'WARNING'],
    ['INVALID_SSN_FORMAT', 'ERROR'],
    ['MISSING_PARENT_INCOME', 'WARNING'],
    ['NEGATIVE_STUDENT_INCOME', 'ERROR'],
    ['NEGATIVE_PARENT_INCOME', 'ERROR'],
    ['COLLEGE_EXCEEDS_HOUSEHOLD', 'ERROR'],
    ['MISSING_STATE', 'WARNING'],
    ['INVALID_STATE_CODE', 'ERROR'],
    ['MISSING_SPOUSE_NAME', 'WARNING'],
    ['MISSING_SPOUSE_SSN', 'WARNING'],
    ['INVALID_SPOUSE_SSN_FORMAT', 'ERROR'],
  ])('maps %s to %s', (code, expected) => {
    expect(severityForCode(code)).toBe(SEVERITY[expected]);
  });

  it('throws on an unregistered code, to catch typos/missing entries early', () => {
    expect(() => severityForCode('NOT_A_REAL_CODE')).toThrow(/Unknown issue code/);
  });
});
