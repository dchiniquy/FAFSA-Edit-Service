module.exports = {
  id: 'income-validation',
  description: 'Income values cannot be negative',

  appliesTo() {
    return true;
  },

  validate(app) {
    const { studentIncome, parentIncome } = app.income;
    const issues = [];

    if (studentIncome != null && studentIncome < 0) {
      issues.push({
        code: 'NEGATIVE_STUDENT_INCOME',
        message: `Student income cannot be negative (received ${studentIncome}).`,
      });
    }

    if (parentIncome != null && parentIncome < 0) {
      issues.push({
        code: 'NEGATIVE_PARENT_INCOME',
        message: `Parent income cannot be negative (received ${parentIncome}).`,
      });
    }

    return issues;
  },
};
