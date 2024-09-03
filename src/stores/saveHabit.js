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
    const newHabit = createNewHabit();
    const numberOfDays = 365;
    const selectedDate = new Date(selectedDay);
    selectedDate.setHours(0, 0, 0, 0); 
  
    const futureDates = getNextNDaysWithDayOfWeek(
      selectedDate,
      numberOfDays
    );
  
    const datesToSave =
      selectedDaysOfWeek.length > 0
        ? futureDates.filter((date) => selectedDaysOfWeek.includes(date.dayOfWeek))
        : futureDates;
  
    if (!datesToSave.some(d => d.date === selectedDay)) {
      datesToSave.unshift({ date: selectedDay, dayOfWeek: selectedDate.getDay() });
    }
  
    datesToSave.sort((a, b) => new Date(a.date) - new Date(b.date));
  
    saveHabitForMultipleDates(
      datesToSave.map((d) => d.date),
      newHabit
    );
  };
  

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
