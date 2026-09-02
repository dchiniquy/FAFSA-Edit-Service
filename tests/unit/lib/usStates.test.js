const { isValidStateCode, VALID_STATE_CODES } = require('../../../src/rules/lib/usStates');

describe('VALID_STATE_CODES', () => {
  it('contains exactly the 50 states plus DC', () => {
    expect(VALID_STATE_CODES.size).toBe(51);
  });

  it('does not include US territories', () => {
    expect(VALID_STATE_CODES.has('PR')).toBe(false);
    expect(VALID_STATE_CODES.has('GU')).toBe(false);
    expect(VALID_STATE_CODES.has('VI')).toBe(false);
  });
});

describe('isValidStateCode', () => {
  it('accepts a valid uppercase state code', () => {
    expect(isValidStateCode('CA')).toBe(true);
  });

  it('accepts DC', () => {
    expect(isValidStateCode('DC')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isValidStateCode('ca')).toBe(true);
    expect(isValidStateCode('Ca')).toBe(true);
  });

  it('rejects an invalid two-letter code', () => {
    expect(isValidStateCode('XX')).toBe(false);
  });

  it('rejects a full state name', () => {
    expect(isValidStateCode('California')).toBe(false);
  });

  it('rejects non-string input', () => {
    expect(isValidStateCode(null)).toBe(false);
    expect(isValidStateCode(undefined)).toBe(false);
  });
});
