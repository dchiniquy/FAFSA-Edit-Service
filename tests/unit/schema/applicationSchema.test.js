const { applicationSchema } = require('../../../src/schema/applicationSchema');

describe('applicationSchema', () => {
  it("accepts the assignment's sample valid application", () => {
    const result = applicationSchema.safeParse({
      studentInfo: {
        firstName: 'Jane',
        lastName: 'Smith',
        ssn: '123456789',
        dateOfBirth: '2003-05-15',
      },
      dependencyStatus: 'dependent',
      maritalStatus: 'single',
      household: { numberInHousehold: 4, numberInCollege: 1 },
      income: { studentIncome: 5000, parentIncome: 65000 },
      stateOfResidence: 'CA',
    });
    expect(result.success).toBe(true);
  });

  it("accepts the assignment's sample invalid application structurally (business rules, not schema, judge it)", () => {
    const result = applicationSchema.safeParse({
      studentInfo: {
        firstName: 'John',
        lastName: 'Doe',
        ssn: 'invalid',
        dateOfBirth: '2015-01-01',
      },
      dependencyStatus: 'dependent',
      maritalStatus: 'married',
      household: { numberInHousehold: 2, numberInCollege: 5 },
      income: { studentIncome: -1000 },
      stateOfResidence: 'XX',
    });
    expect(result.success).toBe(true);
  });

  it('accepts a completely empty application (every field optional at the schema layer)', () => {
    expect(applicationSchema.safeParse({}).success).toBe(true);
  });

  it('rejects an SSN provided as a JSON number rather than a string', () => {
    const result = applicationSchema.safeParse({ studentInfo: { ssn: 123456789 } });
    expect(result.success).toBe(false);
  });

  it('rejects income provided as a numeric string rather than a JSON number', () => {
    const result = applicationSchema.safeParse({ income: { studentIncome: '5000' } });
    expect(result.success).toBe(false);
  });

  it('rejects household when it is not an object', () => {
    const result = applicationSchema.safeParse({ household: 'four people' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid dependencyStatus enum value', () => {
    const result = applicationSchema.safeParse({ dependencyStatus: 'not-a-real-status' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid maritalStatus enum value', () => {
    const result = applicationSchema.safeParse({ maritalStatus: 'divorced' });
    expect(result.success).toBe(false);
  });
});
