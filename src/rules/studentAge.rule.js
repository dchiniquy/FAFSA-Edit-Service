const { parseDate, calculateAge } = require('./lib/dateUtils');

const MINIMUM_AGE = 14;

module.exports = {
  id: 'student-age',
  description: `Student must be at least ${MINIMUM_AGE} years old`,

  appliesTo() {
    return true;
  },

  validate(app, { now = new Date() } = {}) {
    const dobRaw = app.studentInfo.dateOfBirth;

    if (dobRaw == null) {
      return [{ code: 'MISSING_DOB', message: 'Student date of birth is required.' }];
    }

    const dob = parseDate(dobRaw);
    if (!dob) {
      return [
        { code: 'INVALID_DOB', message: `Student date of birth "${dobRaw}" is not a valid date.` },
      ];
    }

    if (dob.getTime() > now.getTime()) {
      return [{ code: 'DOB_IN_FUTURE', message: 'Student date of birth cannot be in the future.' }];
    }

    const age = calculateAge(dob, now);
    if (age < MINIMUM_AGE) {
      return [
        {
          code: 'UNDER_MINIMUM_AGE',
          message: `Student must be at least ${MINIMUM_AGE} years old (currently ${age}).`,
        },
      ];
    }

    return [];
  },
};
