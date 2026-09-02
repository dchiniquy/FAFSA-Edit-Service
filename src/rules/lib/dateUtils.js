function parseDate(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function calculateAge(dob, now) {
  let age = now.getUTCFullYear() - dob.getUTCFullYear();
  const birthdayNotYetReachedThisYear =
    now.getUTCMonth() < dob.getUTCMonth() ||
    (now.getUTCMonth() === dob.getUTCMonth() && now.getUTCDate() < dob.getUTCDate());
  if (birthdayNotYetReachedThisYear) {
    age -= 1;
  }
  return age;
}

module.exports = { parseDate, calculateAge };
