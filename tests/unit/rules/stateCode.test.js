const rule = require('../../../src/rules/stateCode.rule');

function appWithState(stateOfResidence) {
  return { stateOfResidence };
}

describe('state-code rule', () => {
  it('always applies', () => {
    expect(rule.appliesTo({})).toBe(true);
  });

  it('passes with a valid state code', () => {
    expect(rule.validate(appWithState('CA'))).toEqual([]);
  });

  it('passes case-insensitively', () => {
    expect(rule.validate(appWithState('ca'))).toEqual([]);
  });

  it('fails with MISSING_STATE when absent', () => {
    expect(rule.validate(appWithState(undefined))).toEqual([
      { code: 'MISSING_STATE', message: expect.any(String) },
    ]);
  });

  it('fails with INVALID_STATE_CODE when not a real state abbreviation', () => {
    expect(rule.validate(appWithState('XX'))).toEqual([
      { code: 'INVALID_STATE_CODE', message: expect.any(String) },
    ]);
  });
});
