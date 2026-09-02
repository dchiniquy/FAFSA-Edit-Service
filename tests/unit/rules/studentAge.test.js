const rule = require('../../../src/rules/studentAge.rule');

function appWithDob(dateOfBirth) {
  return { studentInfo: { dateOfBirth } };
}

describe('student-age rule', () => {
  it('always applies', () => {
    expect(rule.appliesTo({})).toBe(true);
  });

  it('passes when the student is well above the minimum age', () => {
    const now = new Date('2026-09-01T00:00:00Z');
    expect(rule.validate(appWithDob('2003-05-15'), { now })).toEqual([]);
  });

  it('passes exactly on the 14th birthday', () => {
    const now = new Date('2026-09-01T00:00:00Z');
    expect(rule.validate(appWithDob('2012-09-01'), { now })).toEqual([]);
  });

  it('fails with UNDER_MINIMUM_AGE the day before the 14th birthday', () => {
    const now = new Date('2026-09-01T00:00:00Z');
    const result = rule.validate(appWithDob('2012-09-02'), { now });
    expect(result).toHaveLength(1);
    expect(result[0].code).toBe('UNDER_MINIMUM_AGE');
  });

  it('fails with MISSING_DOB when date of birth is absent', () => {
    const now = new Date('2026-09-01T00:00:00Z');
    const result = rule.validate(appWithDob(undefined), { now });
    expect(result).toEqual([{ code: 'MISSING_DOB', message: expect.any(String) }]);
  });

  it('fails with INVALID_DOB when date of birth is unparseable', () => {
    const now = new Date('2026-09-01T00:00:00Z');
    const result = rule.validate(appWithDob('not-a-date'), { now });
    expect(result).toEqual([{ code: 'INVALID_DOB', message: expect.any(String) }]);
  });

  it('fails with DOB_IN_FUTURE when date of birth is after now', () => {
    const now = new Date('2026-09-01T00:00:00Z');
    const result = rule.validate(appWithDob('2026-09-02'), { now });
    expect(result).toEqual([{ code: 'DOB_IN_FUTURE', message: expect.any(String) }]);
  });
});
