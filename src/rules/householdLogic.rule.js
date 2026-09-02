module.exports = {
  id: 'household-logic',
  description: 'Number in college cannot exceed number in household',

  appliesTo(app) {
    const { numberInHousehold, numberInCollege } = app.household;
    return numberInHousehold != null && numberInCollege != null;
  },

  validate(app) {
    const { numberInHousehold, numberInCollege } = app.household;
    if (numberInCollege > numberInHousehold) {
      return [
        {
          code: 'COLLEGE_EXCEEDS_HOUSEHOLD',
          message: `Number in college (${numberInCollege}) cannot exceed number in household (${numberInHousehold}).`,
        },
      ];
    }
    return [];
  },
};
