import { ref, computed } from 'vue'
import { formatDate, isFutureDate, getNextNDaysWithDayOfWeek } from '../utils/date.js'
import { loadHabits, saveHabits, deleteHabitFromAllDates } from '../utils/habitStorage.js'
import { useCategoryDialog } from '../composables/useCategoryDialog.js'
import { useHabitDialog } from '../composables/useHabitDialog.js'

export function useHabitList(initialDate) {
  const selectedDay = ref(initialDate)
  const habits = ref([])
  const iconSize = ref(24)
  const selectedDays = ref(7)

  const { categories, refreshCategories } = useCategoryDialog(() => {})
  const dialogUtils = useHabitDialog()

  const formattedSelectedDay = computed(() => formatDate(selectedDay.value))
  const isDateInFuture = computed(() => isFutureDate(selectedDay.value))

  const getNumberOfDays = () => parseInt(selectedDays.value)
  const getDatesToSave = () => getNextNDaysWithDayOfWeek(selectedDay.value, getNumberOfDays())

  function loadHabitsForDate(date) {
    selectedDay.value = date
    habits.value = loadHabits(date)
  }

  function updateHabitCompletion(habit) {
    const index = habits.value.findIndex((h) => h.id === habit.id)
    if (index !== -1) {
      habits.value[index] = { ...habit }
      saveHabits(selectedDay.value, habits.value)
    }
  }

  function deleteHabit(habit) {
    deleteHabitFromAllDates(habit.name)
    loadHabitsForDate(selectedDay.value)
  }

  function stopHabit(habit) {
    const updatedHabits = habits.value.filter(h => h.id !== habit.id)
    saveHabits(selectedDay.value, updatedHabits)
    loadHabitsForDate(selectedDay.value)
  }

  /**
   * Groups habits by their categories.
   * If a habit doesn't have a category, it's placed in an "Uncategorized" group.
   * @returns {Array} An array of category objects, each containing an array of habits.
   */
  const groupedHabits = computed(() => {
    const groups = {}
    habits.value.forEach((habit) => {
      const category = categories.value.find((c) => c.id === habit.categoryId) || {
        id: null,
        name: 'Uncategorized',
        color: '#9E9E9E',
        icon: 'mdi-help-circle-outline'
      }

      if (!groups[category.id]) {
        groups[category.id] = { ...category, habits: [] }
      }
      groups[category.id].habits.push(habit)
    })
    return Object.values(groups)
  })

  loadHabitsForDate(initialDate)

  return {
    selectedDay,
    habits,
    formattedSelectedDay,
    isDateInFuture,
    categories,
    groupedHabits,
    iconSize,
    selectedDays,
    loadHabitsForDate,
    updateHabitCompletion,
    deleteHabit,
    stopHabit,
    refreshCategories,
    getNumberOfDays,
    getDatesToSave,
    ...dialogUtils
  }
}
