const { isValidSsnFormat } = require('./lib/ssnFormat');

module.exports = {
  id: 'ssn-format',
  description: 'SSN must be in valid format (9 digits)',

  appliesTo() {
    return true;
  },

  validate(app) {
    const ssn = app.studentInfo.ssn;

    if (ssn == null) {
      return [{ code: 'MISSING_SSN', message: 'Student SSN is required.' }];
    }

    if (!isValidSsnFormat(ssn)) {
      return [{ code: 'INVALID_SSN_FORMAT', message: 'Student SSN must be exactly 9 digits.' }];
    }

    return [];
  },
};
