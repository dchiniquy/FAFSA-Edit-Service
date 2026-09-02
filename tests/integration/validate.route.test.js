const request = require('supertest');
const createApp = require('../../src/app');

const app = createApp();

const VALID_APPLICATION = {
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

const INVALID_APPLICATION = {
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

describe('POST /api/v1/applications/validate', () => {
  it("returns 200 and VALID for the assignment's sample valid application", async () => {
    const response = await request(app)
      .post('/api/v1/applications/validate')
      .send(VALID_APPLICATION);

    expect(response.status).toBe(200);
    expect(response.body.overallStatus).toBe('VALID');
  });

  it('returns 200 and REJECTED with every documented violation for the sample invalid application', async () => {
    const response = await request(app)
      .post('/api/v1/applications/validate')
      .send(INVALID_APPLICATION);

    expect(response.status).toBe(200);
    expect(response.body.overallStatus).toBe('REJECTED');

    const failedCodes = response.body.ruleResults
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

  it('returns 200 and NEEDS_CORRECTION for a completely empty body (every field absent)', async () => {
    const response = await request(app).post('/api/v1/applications/validate').send({});

    expect(response.status).toBe(200);
    expect(response.body.overallStatus).toBe('NEEDS_CORRECTION');
    expect(response.body.summary.errors).toBe(0);
  });

  it('returns 400 with details when the body is structurally malformed', async () => {
    const response = await request(app)
      .post('/api/v1/applications/validate')
      .send({ household: 'four people' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
    expect(response.body.details.some((d) => d.path === 'household')).toBe(true);
  });

  it('returns 400 for a raw malformed JSON body', async () => {
    const response = await request(app)
      .post('/api/v1/applications/validate')
      .set('Content-Type', 'application/json')
      .send('{ this is not json');

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
