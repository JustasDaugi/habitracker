import { formatDateString } from './date.js'

const HABITS_KEY_PREFIX = 'habits_'
const ALL_DATES_KEY = 'all_habit_dates'

export function saveHabits(date, habits) {
  const formattedDate = formatDateString(date)
  localStorage.setItem(`${HABITS_KEY_PREFIX}${formattedDate}`, JSON.stringify(habits))
  addDateToAllDates(formattedDate)
}

export function loadHabits(date) {
  const formattedDate = formatDateString(date)
  return JSON.parse(localStorage.getItem(`${HABITS_KEY_PREFIX}${formattedDate}`)) || []
}

export function saveHabitForMultipleDates(dates, habit) {
  dates.forEach((date) => {
    const habits = loadHabits(date)
    const existingIndex = habits.findIndex((h) => h.id === habit.id)
    existingIndex !== -1 ? (habits[existingIndex] = habit) : habits.push(habit)
    saveHabits(date, habits)
  })
}

export function stopHabitForDay(habitName, date) {
  const formattedDate = formatDateString(date)
  const allDates = getAllDates().sort((a, b) => new Date(a) - new Date(b))
  const dateIndex = allDates.findIndex((d) => new Date(d) >= new Date(formattedDate))

  if (dateIndex === -1) {
    removeHabitFromDate(habitName, formattedDate)
    return
  }

  const updatedDates = allDates.slice(dateIndex).filter((currentDate) => {
    const habits = loadHabits(currentDate).filter((habit) => habit.name !== habitName)
    if (habits.length > 0) {
      saveHabits(currentDate, habits)
      return true
    }
    localStorage.removeItem(`${HABITS_KEY_PREFIX}${currentDate}`)
    return false
  })

  localStorage.setItem(
    ALL_DATES_KEY,
    JSON.stringify([...allDates.slice(0, dateIndex), ...updatedDates])
  )
}

function removeHabitFromDate(habitName, date) {
  const habits = loadHabits(date).filter((habit) => habit.name !== habitName)
  habits.length > 0
    ? saveHabits(date, habits)
    : (localStorage.removeItem(`${HABITS_KEY_PREFIX}${date}`), removeDateFromAllDates(date))
}

export function deleteHabitFromAllDates(habitName) {
  const updatedDates = getAllDates().filter((date) => {
    const habits = loadHabits(date).filter((habit) => habit.name !== habitName)
    if (habits.length > 0) {
      saveHabits(date, habits)
      return true
    }
    localStorage.removeItem(`${HABITS_KEY_PREFIX}${date}`)
    return false
  })

  localStorage.setItem(ALL_DATES_KEY, JSON.stringify(updatedDates))
}

export function getAllDates() {
  return JSON.parse(localStorage.getItem(ALL_DATES_KEY)) || []
}

function addDateToAllDates(date) {
  const allDates = getAllDates()
  if (!allDates.includes(date)) {
    localStorage.setItem(ALL_DATES_KEY, JSON.stringify([...allDates, date]))
  }
}

function removeDateFromAllDates(date) {
  localStorage.setItem(ALL_DATES_KEY, JSON.stringify(getAllDates().filter((d) => d !== date)))
}
