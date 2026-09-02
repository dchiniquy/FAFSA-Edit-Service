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

  it('rejects a calendar-impossible date instead of silently rolling it over', () => {
    // JS's Date constructor normalizes Feb 30 -> Mar 2 rather than rejecting it.
    expect(parseDate('2003-02-30')).toBeNull();
  });

  it('rejects Feb 29 in a non-leap year instead of silently rolling it over to Mar 1', () => {
    expect(parseDate('2001-02-29')).toBeNull();
  });

  it('accepts Feb 29 in an actual leap year', () => {
    const result = parseDate('2000-02-29');
    expect(result).toBeInstanceOf(Date);
    expect(result.getUTCMonth()).toBe(1);
    expect(result.getUTCDate()).toBe(29);
  });

  it('rejects a non-ISO-format date string, even one Date can otherwise parse', () => {
    expect(parseDate('05/15/2003')).toBeNull();
  });

  it('rejects an out-of-range month/day that Date itself refuses to parse', () => {
    expect(parseDate('2003-13-45')).toBeNull();
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
