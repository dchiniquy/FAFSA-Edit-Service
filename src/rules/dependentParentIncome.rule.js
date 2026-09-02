module.exports = {
  id: 'dependent-parent-income',
  description: 'If dependency status is "dependent", parent income is required',

  appliesTo(app) {
    return app.dependencyStatus === 'dependent';
  },

  validate(app) {
    if (app.income.parentIncome == null) {
      return [
        {
          code: 'MISSING_PARENT_INCOME',
          message: 'Parent income is required when dependency status is "dependent".',
        },
      ];
    }
    return [];
  },
};
