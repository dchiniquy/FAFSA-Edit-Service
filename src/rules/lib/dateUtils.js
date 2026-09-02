const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

// Requires strict ISO YYYY-MM-DD, then re-checks the parsed date's own
// year/month/day against what was requested. JS's Date constructor silently
// rolls over calendar-impossible dates (e.g. "2001-02-29" -> 2001-03-01)
// instead of rejecting them; without this check such a date would be treated
// as valid and age would be computed from the wrong day.
function parseDate(value) {
  if (typeof value !== 'string') {
    return null;
  }
  const match = ISO_DATE_PATTERN.exec(value.trim());
  if (!match) {
    return null;
  }

  const [, yearStr, monthStr, dayStr] = match;
  const year = Number(yearStr);
  const month = Number(monthStr);
  const day = Number(dayStr);

  const date = new Date(value.trim());
  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const isSameCalendarDate =
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;

  return isSameCalendarDate ? date : null;
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
