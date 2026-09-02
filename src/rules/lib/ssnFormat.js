const SSN_PATTERN = /^\d{9}$/;

function isValidSsnFormat(value) {
  return typeof value === 'string' && SSN_PATTERN.test(value);
}

module.exports = { isValidSsnFormat };
