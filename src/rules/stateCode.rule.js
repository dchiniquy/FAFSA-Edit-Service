const { isValidStateCode } = require('./lib/usStates');

module.exports = {
  id: 'state-code',
  description: 'State code must be a valid US state abbreviation',

  appliesTo() {
    return true;
  },

  validate(app) {
    const state = app.stateOfResidence;

    if (state == null) {
      return [{ code: 'MISSING_STATE', message: 'State of residence is required.' }];
    }

    if (!isValidStateCode(state)) {
      return [
        {
          code: 'INVALID_STATE_CODE',
          message: `"${state}" is not a valid US state abbreviation.`,
        },
      ];
    }

    return [];
  },
};
