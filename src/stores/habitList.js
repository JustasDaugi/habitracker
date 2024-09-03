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

  const loadHabitsForDate = (date) => {
    selectedDay.value = date
    habits.value = loadHabits(date)
  }

  const updateHabitCompletion = (habit) => {
    const index = habits.value.findIndex((h) => h.id === habit.id)
    if (index !== -1) {
      habits.value[index] = { ...habit }
      saveHabits(selectedDay.value, habits.value)
    }
  }

  const deleteHabit = (habit) => {
    deleteHabitFromAllDates(habit.name)
    loadHabitsForDate(selectedDay.value)
  }

  const stopHabit = (habit) => {
    habits.value = habits.value.filter((h) => h.id !== habit.id)
    saveHabits(selectedDay.value, habits.value)
  }

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
    getNumberOfDays: () => parseInt(selectedDays.value),
    getDatesToSave: () =>
      getNextNDaysWithDayOfWeek(selectedDay.value, parseInt(selectedDays.value)),
    ...dialogUtils
  }
}
