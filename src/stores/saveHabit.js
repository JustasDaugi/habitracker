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
  const trimmedName = newHabitName?.trim()
  if (!trimmedName) {
    console.error('Invalid or empty habit name')
    return
  }

  const createHabit = (isEditing) => ({
    ...(isEditing ? editingHabit : { id: Date.now().toString(), completed: false }),
    name: trimmedName,
    categoryId: newHabitCategory
  })

  const saveNewHabit = () => {
    const newHabit = createHabit(false)
    const selectedDate = new Date(selectedDay)
    selectedDate.setHours(0, 0, 0, 0)

    const futureDates = getNextNDaysWithDayOfWeek(selectedDate, 365)
    const datesToSave =
      selectedDaysOfWeek.length > 0
        ? futureDates.filter((date) => selectedDaysOfWeek.includes(date.dayOfWeek))
        : futureDates

    if (!datesToSave.some((d) => d.date === selectedDay)) {
      datesToSave.unshift({ date: selectedDay, dayOfWeek: selectedDate.getDay() })
    }

    saveHabitForMultipleDates(
      datesToSave.map((d) => d.date).sort((a, b) => new Date(a) - new Date(b)),
      newHabit
    )
  }

  const updateExistingHabit = () => {
    const updatedHabit = createHabit(true)
    const habits = loadHabits(selectedDay)
    const updatedHabits = habits.map((habit) =>
      habit.id === updatedHabit.id ? updatedHabit : habit
    )
    saveHabits(selectedDay, updatedHabits)
  }

  try {
    editingHabit ? updateExistingHabit() : saveNewHabit()
    loadHabitsForDate(selectedDay)
    closeHabitDialog()
    emit('habits-updated')
    refreshCategories()
  } catch (error) {
    console.error('Error saving habit:', error)
  }
}
