const normalizeApplication = require('../../../src/rules/normalizeApplication');

describe('normalizeApplication', () => {
  it('trims whitespace from string fields', () => {
    const result = normalizeApplication({
      studentInfo: { firstName: '  Jane  ', ssn: ' 123456789 ', dateOfBirth: ' 2003-05-15 ' },
      dependencyStatus: ' dependent ',
      maritalStatus: ' single ',
      stateOfResidence: ' CA ',
    });

    expect(result.studentInfo.firstName).toBe('Jane');
    expect(result.studentInfo.ssn).toBe('123456789');
    expect(result.studentInfo.dateOfBirth).toBe('2003-05-15');
    expect(result.dependencyStatus).toBe('dependent');
    expect(result.maritalStatus).toBe('single');
    expect(result.stateOfResidence).toBe('CA');
  });

  it('converts blank/whitespace-only strings to undefined', () => {
    const result = normalizeApplication({
      studentInfo: { firstName: '   ', ssn: '' },
      stateOfResidence: '   ',
    });

    expect(result.studentInfo.firstName).toBeUndefined();
    expect(result.studentInfo.ssn).toBeUndefined();
    expect(result.stateOfResidence).toBeUndefined();
  });

  it('trims whitespace from spouse info fields when present', () => {
    const result = normalizeApplication({
      spouseInfo: { name: '  John Smith  ', ssn: ' 987654321 ' },
    });

    expect(result.spouseInfo.name).toBe('John Smith');
    expect(result.spouseInfo.ssn).toBe('987654321');
  });

  it('leaves numeric fields untouched, including zero', () => {
    const result = normalizeApplication({
      household: { numberInHousehold: 4, numberInCollege: 0 },
      income: { studentIncome: 0, parentIncome: 65000 },
    });

    expect(result.household.numberInHousehold).toBe(4);
    expect(result.household.numberInCollege).toBe(0);
    expect(result.income.studentIncome).toBe(0);
    expect(result.income.parentIncome).toBe(65000);
  });

  it('produces a safe-to-destructure shape when nested objects are entirely absent', () => {
    const result = normalizeApplication({});

    expect(result.studentInfo).toEqual({
      firstName: undefined,
      lastName: undefined,
      ssn: undefined,
      dateOfBirth: undefined,
    });
    expect(result.spouseInfo).toEqual({ name: undefined, ssn: undefined });
    expect(result.household).toEqual({ numberInHousehold: undefined, numberInCollege: undefined });
    expect(result.income).toEqual({ studentIncome: undefined, parentIncome: undefined });
  });

  it('defaults to an empty application when given no input', () => {
    expect(() => normalizeApplication()).not.toThrow();
  });
});
