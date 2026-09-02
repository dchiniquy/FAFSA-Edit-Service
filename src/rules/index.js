const studentAge = require('./studentAge.rule');
const ssnFormat = require('./ssnFormat.rule');
const dependentParentIncome = require('./dependentParentIncome.rule');
const incomeValidation = require('./incomeValidation.rule');
const householdLogic = require('./householdLogic.rule');
const stateCode = require('./stateCode.rule');
const maritalStatus = require('./maritalStatus.rule');

// Explicit registration (no fs auto-discovery): adding a rule means adding one file
// and one line here. Order only affects display order in results, never correctness -
// rules are independent, pure functions over one normalized application snapshot.
module.exports = [
  studentAge,
  ssnFormat,
  dependentParentIncome,
  incomeValidation,
  householdLogic,
  stateCode,
  maritalStatus,
];
