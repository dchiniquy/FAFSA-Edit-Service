const rule = require('../../../src/rules/householdLogic.rule');

function appWithHousehold(numberInHousehold, numberInCollege) {
  return { household: { numberInHousehold, numberInCollege } };
}

describe('household-logic rule', () => {
  it('applies only when both counts are present', () => {
    expect(rule.appliesTo(appWithHousehold(4, 1))).toBe(true);
    expect(rule.appliesTo(appWithHousehold(undefined, 1))).toBe(false);
    expect(rule.appliesTo(appWithHousehold(4, undefined))).toBe(false);
    expect(rule.appliesTo(appWithHousehold(undefined, undefined))).toBe(false);
  });

  it('passes when number in college is less than number in household', () => {
    expect(rule.validate(appWithHousehold(4, 1))).toEqual([]);
  });

  it('passes when number in college equals number in household', () => {
    expect(rule.validate(appWithHousehold(2, 2))).toEqual([]);
  });

  it('applies and passes when both counts are exactly zero', () => {
    expect(rule.appliesTo(appWithHousehold(0, 0))).toBe(true);
    expect(rule.validate(appWithHousehold(0, 0))).toEqual([]);
  });

  it('fails with COLLEGE_EXCEEDS_HOUSEHOLD when college count exceeds household count', () => {
    expect(rule.validate(appWithHousehold(2, 5))).toEqual([
      { code: 'COLLEGE_EXCEEDS_HOUSEHOLD', message: expect.any(String) },
    ]);
  });
});
