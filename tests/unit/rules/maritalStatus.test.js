const rule = require('../../../src/rules/maritalStatus.rule');

function appWithMarriage(maritalStatus, spouseInfo = {}) {
  return { maritalStatus, spouseInfo };
}

describe('marital-status rule', () => {
  it('applies only when married', () => {
    expect(rule.appliesTo(appWithMarriage('married'))).toBe(true);
    expect(rule.appliesTo(appWithMarriage('single'))).toBe(false);
    expect(rule.appliesTo(appWithMarriage(undefined))).toBe(false);
  });

  it('passes when married with valid spouse name and SSN', () => {
    const app = appWithMarriage('married', { name: 'John Smith', ssn: '987654321' });
    expect(rule.validate(app)).toEqual([]);
  });

  it('fails with MISSING_SPOUSE_NAME when spouse name is absent', () => {
    const app = appWithMarriage('married', { ssn: '987654321' });
    expect(rule.validate(app)).toEqual([
      { code: 'MISSING_SPOUSE_NAME', message: expect.any(String) },
    ]);
  });

  it('fails with MISSING_SPOUSE_SSN when spouse SSN is absent', () => {
    const app = appWithMarriage('married', { name: 'John Smith' });
    expect(rule.validate(app)).toEqual([
      { code: 'MISSING_SPOUSE_SSN', message: expect.any(String) },
    ]);
  });

  it('fails with INVALID_SPOUSE_SSN_FORMAT when spouse SSN is malformed', () => {
    const app = appWithMarriage('married', { name: 'John Smith', ssn: 'invalid' });
    expect(rule.validate(app)).toEqual([
      { code: 'INVALID_SPOUSE_SSN_FORMAT', message: expect.any(String) },
    ]);
  });

  it('reports both missing name and missing SSN together', () => {
    const app = appWithMarriage('married', {});
    expect(rule.validate(app)).toEqual([
      { code: 'MISSING_SPOUSE_NAME', message: expect.any(String) },
      { code: 'MISSING_SPOUSE_SSN', message: expect.any(String) },
    ]);
  });
});
