// import { formatDate, formatDateString } from './date.js'

// const HABITS_KEY_PREFIX = 'habits_'
// const ALL_DATES_KEY = 'all_habit_dates'

// export function saveHabits(date, habits) {
//   const formattedDate = formatDateString(date)
//   localStorage.setItem(`${HABITS_KEY_PREFIX}${formattedDate}`, JSON.stringify(habits))
//   addDateToAllDates(formattedDate)
// }

// export function loadHabits(date) {
//   const formattedDate = formatDateString(date)
//   const habits = localStorage.getItem(`${HABITS_KEY_PREFIX}${formattedDate}`)
//   return habits ? JSON.parse(habits) : []
// }

// export function saveHabitForMultipleDates(dates, habit) {
//   dates.forEach(date => {
//     const habits = loadHabits(date)
//     const existingHabitIndex = habits.findIndex(h => h.id === habit.id)
//     if (existingHabitIndex !== -1) {
//       habits[existingHabitIndex] = habit
//     } else {
//       habits.push(habit)
//     }
//     saveHabits(date, habits)
//   })
// }
// export function stopHabitForDay(habitName, date) {
//   const formattedDate = formatDate(date)
//   const habits = loadHabits(formattedDate)
//   const updatedHabits = habits.filter((habit) => habit.name !== habitName)
//   saveHabits(formattedDate, updatedHabits)
//   if (updatedHabits.length === 0) {
//     removeDateFromAllDates(formattedDate)
//   }
// }

// export function deleteHabitFromAllDates(habitName) {
//   const allDates = getAllDates()
//   const updatedDates = []

//   allDates.forEach(date => {
//     const habits = loadHabits(date)
//     const updatedHabits = habits.filter((habit) => habit.name !== habitName)
//     if (updatedHabits.length > 0) {
//       saveHabits(date, updatedHabits)
//       updatedDates.push(date)
//     } else {
//       localStorage.removeItem(`${HABITS_KEY_PREFIX}${date}`)
//     }
//   })

//   localStorage.setItem(ALL_DATES_KEY, JSON.stringify(updatedDates))
// }

// export function getAllDates() {
//   const datesString = localStorage.getItem(ALL_DATES_KEY)
//   return datesString ? JSON.parse(datesString) : []
// }

// function addDateToAllDates(date) {
//   const allDates = getAllDates()
//   if (!allDates.includes(date)) {
//     allDates.push(date)
//     localStorage.setItem(ALL_DATES_KEY, JSON.stringify(allDates))
//   }
// }

// function removeDateFromAllDates(date) {
//   const allDates = getAllDates()
//   const updatedDates = allDates.filter((d) => d !== date)
//   localStorage.setItem(ALL_DATES_KEY, JSON.stringify(updatedDates))
// }


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
  const habits = localStorage.getItem(`${HABITS_KEY_PREFIX}${formattedDate}`)
  return habits ? JSON.parse(habits) : []
}

export function saveHabitForMultipleDates(dates, habit) {
  dates.forEach((date) => {
    const habits = loadHabits(date)
    const existingHabitIndex = habits.findIndex((h) => h.id === habit.id)
    if (existingHabitIndex !== -1) {
      habits[existingHabitIndex] = habit
    } else {
      habits.push(habit)
    }
    saveHabits(date, habits)
  })
}

export function stopHabitForDay(habitName, date) {
  const formattedDate = formatDateString(date)
  const allDates = getAllDates().sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  const dateIndex = allDates.findIndex((d) => new Date(d) >= new Date(formattedDate))

  if (dateIndex === -1) {
    removeHabitFromDate(habitName, formattedDate)
    return
  }

  const datesToUpdate = allDates.slice(dateIndex)
  const updatedDates = []

  datesToUpdate.forEach((currentDate) => {
    const habits = loadHabits(currentDate)
    const updatedHabits = habits.filter((habit) => habit.name !== habitName)
    if (updatedHabits.length > 0) {
      saveHabits(currentDate, updatedHabits)
      updatedDates.push(currentDate)
    } else {
      localStorage.removeItem(`${HABITS_KEY_PREFIX}${currentDate}`)
    }
  })

  const newAllDates = [...allDates.slice(0, dateIndex), ...updatedDates]
  localStorage.setItem(ALL_DATES_KEY, JSON.stringify(newAllDates))
}

function removeHabitFromDate(habitName, date) {
  const habits = loadHabits(date)
  const updatedHabits = habits.filter((habit) => habit.name !== habitName)
  if (updatedHabits.length > 0) {
    saveHabits(date, updatedHabits)
  } else {
    localStorage.removeItem(`${HABITS_KEY_PREFIX}${date}`)
    removeDateFromAllDates(date)
  }
}

export function deleteHabitFromAllDates(habitName) {
  const allDates = getAllDates()
  const updatedDates = []

  allDates.forEach((date) => {
    const habits = loadHabits(date)
    const updatedHabits = habits.filter((habit) => habit.name !== habitName)
    if (updatedHabits.length > 0) {
      saveHabits(date, updatedHabits)
      updatedDates.push(date)
    } else {
      localStorage.removeItem(`${HABITS_KEY_PREFIX}${date}`)
    }
  })

  localStorage.setItem(ALL_DATES_KEY, JSON.stringify(updatedDates))
}

export function getAllDates() {
  const datesString = localStorage.getItem(ALL_DATES_KEY)
  return datesString ? JSON.parse(datesString) : []
}

function addDateToAllDates(date) {
  const allDates = getAllDates()
  if (!allDates.includes(date)) {
    allDates.push(date)
    localStorage.setItem(ALL_DATES_KEY, JSON.stringify(allDates))
  }
}

function removeDateFromAllDates(date) {
  const allDates = getAllDates()
  const updatedDates = allDates.filter((d) => d !== date)
  localStorage.setItem(ALL_DATES_KEY, JSON.stringify(updatedDates))
}
