const rule = require('../../../src/rules/incomeValidation.rule');

function appWithIncome(studentIncome, parentIncome) {
  return { income: { studentIncome, parentIncome } };
}

describe('income-validation rule', () => {
  it('always applies', () => {
    expect(rule.appliesTo({})).toBe(true);
  });

  it('passes when both incomes are non-negative', () => {
    expect(rule.validate(appWithIncome(5000, 65000))).toEqual([]);
  });

  it('passes when both incomes are exactly zero', () => {
    expect(rule.validate(appWithIncome(0, 0))).toEqual([]);
  });

  it('passes when both incomes are absent (nothing to compare)', () => {
    expect(rule.validate(appWithIncome(undefined, undefined))).toEqual([]);
  });

  it('fails with NEGATIVE_STUDENT_INCOME only, when just student income is negative', () => {
    expect(rule.validate(appWithIncome(-1000, 65000))).toEqual([
      { code: 'NEGATIVE_STUDENT_INCOME', message: expect.any(String) },
    ]);
  });

  it('fails with NEGATIVE_PARENT_INCOME only, when just parent income is negative', () => {
    expect(rule.validate(appWithIncome(5000, -1))).toEqual([
      { code: 'NEGATIVE_PARENT_INCOME', message: expect.any(String) },
    ]);
  });

  it('reports both violations when both incomes are negative', () => {
    const result = rule.validate(appWithIncome(-1000, -1));
    expect(result).toEqual([
      { code: 'NEGATIVE_STUDENT_INCOME', message: expect.any(String) },
      { code: 'NEGATIVE_PARENT_INCOME', message: expect.any(String) },
    ]);
  });
});
