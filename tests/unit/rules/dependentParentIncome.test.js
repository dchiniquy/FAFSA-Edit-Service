const rule = require('../../../src/rules/dependentParentIncome.rule');

describe('dependent-parent-income rule', () => {
  it('applies only when dependency status is "dependent"', () => {
    expect(rule.appliesTo({ dependencyStatus: 'dependent' })).toBe(true);
    expect(rule.appliesTo({ dependencyStatus: 'independent' })).toBe(false);
    expect(rule.appliesTo({ dependencyStatus: undefined })).toBe(false);
  });

  it('passes when parent income is present', () => {
    const app = { dependencyStatus: 'dependent', income: { parentIncome: 65000 } };
    expect(rule.validate(app)).toEqual([]);
  });

  it('passes when parent income is exactly zero', () => {
    const app = { dependencyStatus: 'dependent', income: { parentIncome: 0 } };
    expect(rule.validate(app)).toEqual([]);
  });

  it('fails with MISSING_PARENT_INCOME when parent income is absent', () => {
    const app = { dependencyStatus: 'dependent', income: { parentIncome: undefined } };
    expect(rule.validate(app)).toEqual([
      { code: 'MISSING_PARENT_INCOME', message: expect.any(String) },
    ]);
  });
});
