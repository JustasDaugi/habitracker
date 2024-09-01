import { watch, computed } from 'vue'
import { useHabitList as useHabitListCore } from '../stores/habitList'
import { useCategoryDialog } from './useCategoryDialog'
import { stopHabitForDay, deleteHabitFromAllDates } from '../utils/habitStorage'

/**
 * Wrapper function for useHabitListCore
 * @param {Date} date - The date for which to load habits
 * @returns {ReturnType<typeof useHabitListCore>} The habit list state and methods
 */
function useHabitList(date) {
  return useHabitListCore(date)
}

export function useHabitListContainer(props, emit) {
  const habitListProps = useHabitList(props.date)
  const { categories } = useCategoryDialog(() => {})

  watch(
    () => props.date,
    (newDate) => {
      habitListProps.loadHabitsForDate(newDate)
    }
  )

  const handleConfirmDeleteHabit = () => {
    if (habitListProps.deletingHabit.value) {
      deleteHabitFromAllDates(habitListProps.deletingHabit.value.name)
      habitListProps.loadHabitsForDate(props.date)
      emit('habits-updated')
      habitListProps.closeDeleteHabitDialog()
    }
  }

  const handleConfirmStopHabit = () => {
    if (habitListProps.stoppingHabit.value) {
      stopHabitForDay(habitListProps.stoppingHabit.value.name, props.date)
      habitListProps.loadHabitsForDate(props.date)
      emit('habits-updated')
      habitListProps.closeStopHabitDialog()
    }
  }

  const getCategoryIcon = computed(() => (categoryId) => {
    const category = categories.value.find((c) => c.id === categoryId)
    return category ? category.icon : 'mdi-help-circle-outline'
  })

  return {
    ...habitListProps,
    handleConfirmDeleteHabit,
    handleConfirmStopHabit,
    getCategoryIcon
  }
}
