const { evaluate } = require('../../../src/rules/ruleEngine');

const passingRule = {
  id: 'fake-pass',
  description: 'always passes',
  appliesTo: () => true,
  validate: () => [],
};

const notApplicableRule = {
  id: 'fake-not-applicable',
  description: 'never applies',
  appliesTo: () => false,
  validate: () => {
    throw new Error('should not be called when not applicable');
  },
};

// Reuses real registered codes so severityPolicy can resolve them; the engine
// doesn't care whether a code is thematically related to the fake rule's id.
const warningRule = {
  id: 'fake-warning',
  description: 'fails with a warning-level code',
  appliesTo: () => true,
  validate: () => [{ code: 'MISSING_SSN', message: 'missing thing' }],
};

const errorRule = {
  id: 'fake-error',
  description: 'fails with an error-level code',
  appliesTo: () => true,
  validate: () => [{ code: 'INVALID_SSN_FORMAT', message: 'bad thing' }],
};

describe('ruleEngine.evaluate aggregation, with injected fake rules', () => {
  it('returns VALID when every rule passes or is not applicable', () => {
    const result = evaluate({}, { rules: [passingRule, notApplicableRule] });
    expect(result.overallStatus).toBe('VALID');
    expect(result.summary).toEqual({ errors: 0, warnings: 0, passed: 1, notApplicable: 1 });
  });

  it('returns NEEDS_CORRECTION when only warnings are present', () => {
    const result = evaluate({}, { rules: [passingRule, warningRule] });
    expect(result.overallStatus).toBe('NEEDS_CORRECTION');
    expect(result.summary.warnings).toBe(1);
    expect(result.summary.errors).toBe(0);
  });

  it('returns REJECTED when any error is present, even alongside warnings', () => {
    const result = evaluate({}, { rules: [warningRule, errorRule] });
    expect(result.overallStatus).toBe('REJECTED');
    expect(result.summary).toEqual({ errors: 1, warnings: 1, passed: 0, notApplicable: 0 });
  });

  it('shapes ruleResults: one entry per rule when passing/not-applicable, one per issue when failing', () => {
    const result = evaluate({}, { rules: [passingRule, notApplicableRule, warningRule] });
    expect(result.ruleResults).toEqual([
      { ruleId: 'fake-pass', description: 'always passes', status: 'PASSED' },
      { ruleId: 'fake-not-applicable', description: 'never applies', status: 'NOT_APPLICABLE' },
      {
        ruleId: 'fake-warning',
        description: 'fails with a warning-level code',
        status: 'FAILED',
        code: 'MISSING_SSN',
        severity: 'WARNING',
        message: 'missing thing',
      },
    ]);
  });

  it('stamps evaluatedAt using the injected now', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    const result = evaluate({}, { rules: [passingRule], now });
    expect(result.evaluatedAt).toBe(now.toISOString());
  });

  it('normalizes the application before running rules', () => {
    const rule = {
      id: 'checks-normalization',
      description: 'checks normalization',
      appliesTo: () => true,
      validate: (app) =>
        app.stateOfResidence === 'CA' ? [] : [{ code: 'MISSING_STATE', message: 'x' }],
    };
    const result = evaluate({ stateOfResidence: '  CA  ' }, { rules: [rule] });
    expect(result.ruleResults[0].status).toBe('PASSED');
  });
});

describe('ruleEngine.evaluate with the real registered rules', () => {
  const now = new Date('2026-09-01T00:00:00Z');

  it('marks the sample valid application as VALID', () => {
    const validApplication = {
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
    };

    const result = evaluate(validApplication, { now });
    expect(result.overallStatus).toBe('VALID');
  });

  it('marks the sample invalid application as REJECTED with all documented violations', () => {
    const invalidApplication = {
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
    };

    const result = evaluate(invalidApplication, { now });

    expect(result.overallStatus).toBe('REJECTED');
    const failedCodes = result.ruleResults
      .filter((r) => r.status === 'FAILED')
      .map((r) => r.code);

    expect(failedCodes).toEqual(
      expect.arrayContaining([
        'UNDER_MINIMUM_AGE',
        'INVALID_SSN_FORMAT',
        'MISSING_PARENT_INCOME',
        'NEGATIVE_STUDENT_INCOME',
        'COLLEGE_EXCEEDS_HOUSEHOLD',
        'INVALID_STATE_CODE',
        'MISSING_SPOUSE_NAME',
        'MISSING_SPOUSE_SSN',
      ]),
    );
  });
});
