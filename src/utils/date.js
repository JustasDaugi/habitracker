export function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function formatDateString(date) {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split('T')[0]
}

export function isFutureDate(dateString) {
  return new Date(dateString) > new Date()
}

export function isValidDate(dateString) {
  const d = new Date(dateString)
  return d instanceof Date && !isNaN(d) && formatDateString(d) === dateString
}

export const getTodayDate = () => formatDateString(new Date())

export function getDayOfWeek(date) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dayIndex = new Date(date).getDay();
  return daysOfWeek[dayIndex];
}

export function getNextNDaysWithDayOfWeek(startDate, n) {
  const dates = [];
  for (let i = 0; i < n; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    const formattedDate = formatDateString(date);
    const dayOfWeek = getDayOfWeek(date);
    dates.push({ date: formattedDate, dayOfWeek });
  }
  return dates;
}