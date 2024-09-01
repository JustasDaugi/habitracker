import { ref } from 'vue'

/**
 * Composable that manages the state and actions for habit-related dialogs.
 *
 * @returns {Object} An object containing reactive references for dialog states and methods for managing dialogs.
 */
export function useHabitDialog() {
  const showHabitDialog = ref(false)
  const showStopHabitDialog = ref(false)
  const showDeleteHabitDialog = ref(false)
  const editingHabit = ref(null)
  const stoppingHabit = ref(null)
  const deletingHabit = ref(null)
  const newHabitName = ref('')
  const newHabitCategory = ref(null)

  /**
   * Opens the dialog for adding a new habit and resets relevant state.
   */
  const openAddHabitDialog = () => {
    editingHabit.value = null
    newHabitName.value = ''
    newHabitCategory.value = null
    showHabitDialog.value = true
  }

  /**
   * Opens the dialog for editing an existing habit and populates the form with habit data.
   *
   * @param {Object} habit - The habit object to be edited.
   */
  const openEditHabitDialog = (habit) => {
    editingHabit.value = habit
    newHabitName.value = habit.name
    newHabitCategory.value = habit.categoryId
    showHabitDialog.value = true
  }

  const closeHabitDialog = () => {
    showHabitDialog.value = false
    newHabitName.value = ''
    newHabitCategory.value = null
    editingHabit.value = null
  }

  const openStopHabitDialog = (habit) => {
    stoppingHabit.value = habit
    showStopHabitDialog.value = true
  }

  const closeStopHabitDialog = () => {
    showStopHabitDialog.value = false
    stoppingHabit.value = null
  }

  const openDeleteHabitDialog = (habit) => {
    deletingHabit.value = habit
    showDeleteHabitDialog.value = true
  }

  const closeDeleteHabitDialog = () => {
    showDeleteHabitDialog.value = false
    deletingHabit.value = null
  }

  return {
    showHabitDialog,
    showStopHabitDialog,
    showDeleteHabitDialog,
    editingHabit,
    stoppingHabit,
    deletingHabit,
    newHabitName,
    newHabitCategory,
    openAddHabitDialog,
    openEditHabitDialog,
    closeHabitDialog,
    openStopHabitDialog,
    closeStopHabitDialog,
    openDeleteHabitDialog,
    closeDeleteHabitDialog
  }
}
