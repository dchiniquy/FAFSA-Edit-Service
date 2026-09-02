const { isValidSsnFormat } = require('../../../src/rules/lib/ssnFormat');

describe('isValidSsnFormat', () => {
  it('accepts exactly 9 digits', () => {
    expect(isValidSsnFormat('123456789')).toBe(true);
  });

  it('rejects fewer than 9 digits', () => {
    expect(isValidSsnFormat('12345678')).toBe(false);
  });

  it('rejects more than 9 digits', () => {
    expect(isValidSsnFormat('1234567890')).toBe(false);
  });

  it('rejects dashes even in a valid 9-digit layout', () => {
    expect(isValidSsnFormat('123-45-6789')).toBe(false);
  });

  it('rejects non-numeric characters', () => {
    expect(isValidSsnFormat('12345abcd')).toBe(false);
  });

  it('rejects non-string input', () => {
    expect(isValidSsnFormat(123456789)).toBe(false);
  });

  it('rejects null and undefined', () => {
    expect(isValidSsnFormat(null)).toBe(false);
    expect(isValidSsnFormat(undefined)).toBe(false);
  });
});
