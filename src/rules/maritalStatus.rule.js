const { isValidSsnFormat } = require('./lib/ssnFormat');

module.exports = {
  id: 'marital-status',
  description: 'If marital status is "married", spouse information is required',

  appliesTo(app) {
    return app.maritalStatus === 'married';
  },

  validate(app) {
    const { name, ssn } = app.spouseInfo;
    const issues = [];

    if (name == null) {
      issues.push({ code: 'MISSING_SPOUSE_NAME', message: 'Spouse name is required when married.' });
    }

    if (ssn == null) {
      issues.push({ code: 'MISSING_SPOUSE_SSN', message: 'Spouse SSN is required when married.' });
    } else if (!isValidSsnFormat(ssn)) {
      issues.push({
        code: 'INVALID_SPOUSE_SSN_FORMAT',
        message: 'Spouse SSN must be exactly 9 digits.',
      });
    }

    return issues;
  },
};
