const rule = require('../../../src/rules/ssnFormat.rule');

function appWithSsn(ssn) {
  return { studentInfo: { ssn } };
}

describe('ssn-format rule', () => {
  it('always applies', () => {
    expect(rule.appliesTo({})).toBe(true);
  });

  it('passes with a valid 9-digit SSN', () => {
    expect(rule.validate(appWithSsn('123456789'))).toEqual([]);
  });

  it('fails with MISSING_SSN when absent', () => {
    expect(rule.validate(appWithSsn(undefined))).toEqual([
      { code: 'MISSING_SSN', message: expect.any(String) },
    ]);
  });

  it('fails with INVALID_SSN_FORMAT when malformed', () => {
    expect(rule.validate(appWithSsn('invalid'))).toEqual([
      { code: 'INVALID_SSN_FORMAT', message: expect.any(String) },
    ]);
  });

  it('fails with INVALID_SSN_FORMAT for a dashed SSN, even though it is 9 digits', () => {
    expect(rule.validate(appWithSsn('123-45-6789'))).toEqual([
      { code: 'INVALID_SSN_FORMAT', message: expect.any(String) },
    ]);
  });
});
