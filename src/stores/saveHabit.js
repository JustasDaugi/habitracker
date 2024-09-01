import { getNextNDaysWithDayOfWeek } from '../utils/date'
import { saveHabitForMultipleDates, saveHabits, loadHabits } from '../utils/habitStorage'

export const saveHabit = (
  newHabitName,
  newHabitCategory,
  editingHabit,
  selectedDay,
  selectedDaysOfWeek,
  loadHabitsForDate,
  closeHabitDialog,
  emit,
  refreshCategories
) => {
  if (!newHabitName || typeof newHabitName !== 'string') {
    console.error('Invalid habit name')
    return
  }

  const trimmedName = newHabitName.trim()
  if (!trimmedName) {
    console.error('Habit name cannot be empty')
    return
  }

  const createUpdatedHabit = () => ({
    ...editingHabit,
    name: trimmedName,
    categoryId: newHabitCategory
  })

  const createNewHabit = () => ({
    id: Date.now().toString(),
    name: trimmedName,
    completed: false,
    categoryId: newHabitCategory
  })

  const updateExistingHabit = () => {
    const updatedHabit = createUpdatedHabit()
    const habits = loadHabits(selectedDay)
    const updatedHabits = habits.map((habit) =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    )
    saveHabits(selectedDay, updatedHabits)
  }

  const createNewHabitForMultipleDates = () => {
    const newHabit = createNewHabit()
    const numberOfDays = 365
    const selectedDate = new Date(selectedDay)

    const pastDates = getNextNDaysWithDayOfWeek(
      new Date(selectedDate.getTime() - 365 * 24 * 60 * 60 * 1000),
      numberOfDays
    )
    const presentDates = getNextNDaysWithDayOfWeek(selectedDate, numberOfDays)
    const futureDates = getNextNDaysWithDayOfWeek(
      new Date(selectedDate.getTime() + 365 * 24 * 60 * 60 * 1000),
      numberOfDays
    )

    const combinedDates = [...pastDates, ...presentDates, ...futureDates]

    const datesToSave =
      selectedDaysOfWeek.length > 0
        ? combinedDates.filter((date) => selectedDaysOfWeek.includes(date.dayOfWeek))
        : combinedDates

    saveHabitForMultipleDates(
      datesToSave.map((d) => d.date),
      newHabit
    )
  }

  try {
    editingHabit ? updateExistingHabit() : createNewHabitForMultipleDates()

    loadHabitsForDate(selectedDay)
    closeHabitDialog()
    emit('habits-updated')
    refreshCategories()
  } catch (error) {
    console.error('Error saving habit:', error)
  }
}
