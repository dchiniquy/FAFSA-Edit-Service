function normalizeString(value) {
  if (typeof value !== 'string') {
    return value;
  }
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

// Runs once, before any rule sees the application, so no individual rule has to
// re-decide what "missing" means (empty string vs. whitespace vs. undefined).
// Always returns a full, safe-to-destructure shape, even when whole sections
// (studentInfo, household, income, spouseInfo) are absent from the input.
function normalizeApplication(app = {}) {
  return {
    studentInfo: {
      firstName: normalizeString(app.studentInfo?.firstName),
      lastName: normalizeString(app.studentInfo?.lastName),
      ssn: normalizeString(app.studentInfo?.ssn),
      dateOfBirth: normalizeString(app.studentInfo?.dateOfBirth),
    },
    dependencyStatus: normalizeString(app.dependencyStatus),
    maritalStatus: normalizeString(app.maritalStatus),
    spouseInfo: {
      name: normalizeString(app.spouseInfo?.name),
      ssn: normalizeString(app.spouseInfo?.ssn),
    },
    household: {
      numberInHousehold: app.household?.numberInHousehold,
      numberInCollege: app.household?.numberInCollege,
    },
    income: {
      studentIncome: app.income?.studentIncome,
      parentIncome: app.income?.parentIncome,
    },
    stateOfResidence: normalizeString(app.stateOfResidence),
  };
}

module.exports = normalizeApplication;
