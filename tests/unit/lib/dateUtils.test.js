const { parseDate, calculateAge } = require('../../../src/rules/lib/dateUtils');

describe('parseDate', () => {
  it('parses a valid ISO date string', () => {
    const result = parseDate('2003-05-15');
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCFullYear()).toBe(2003);
    expect(result.getUTCMonth()).toBe(4); // zero-indexed
    expect(result.getUTCDate()).toBe(15);
  });

  it('returns null for an unparseable string', () => {
    expect(parseDate('not-a-date')).toBeNull();
  });

  it('returns null for null input', () => {
    expect(parseDate(null)).toBeNull();
  });

  it('returns null for undefined input', () => {
    expect(parseDate(undefined)).toBeNull();
  });

  it('returns null for a non-string, non-Date value', () => {
    expect(parseDate(12345)).toBeNull();
  });
});

describe('calculateAge', () => {
  it('computes age when the birthday has already passed this year', () => {
    const dob = parseDate('2003-05-15');
    const now = parseDate('2026-09-01');
    expect(calculateAge(dob, now)).toBe(23);
  });

  it('computes age correctly on the exact birthday', () => {
    const dob = parseDate('2012-09-01');
    const now = parseDate('2026-09-01');
    expect(calculateAge(dob, now)).toBe(14);
  });

  it('has not yet incremented age the day before the birthday', () => {
    const dob = parseDate('2012-09-02');
    const now = parseDate('2026-09-01');
    expect(calculateAge(dob, now)).toBe(13);
  });

  it('handles a leap-day date of birth compared against a non-leap year', () => {
    const dob = parseDate('2000-02-29');
    const now = parseDate('2026-02-28');
    expect(calculateAge(dob, now)).toBe(25);
  });
});
