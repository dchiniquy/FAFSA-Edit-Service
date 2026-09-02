const rules = require('../../../src/rules/index');

describe('rules registry', () => {
  it('registers exactly the 7 required rules, in spec order', () => {
    expect(rules.map((rule) => rule.id)).toEqual([
      'student-age',
      'ssn-format',
      'dependent-parent-income',
      'income-validation',
      'household-logic',
      'state-code',
      'marital-status',
    ]);
  });

  it('every registered rule conforms to the rule interface', () => {
    for (const rule of rules) {
      expect(typeof rule.id).toBe('string');
      expect(typeof rule.description).toBe('string');
      expect(typeof rule.appliesTo).toBe('function');
      expect(typeof rule.validate).toBe('function');
    }
  });

  it('has unique rule ids', () => {
    const ids = rules.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
