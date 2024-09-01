import { ref, computed } from 'vue'
import { getNextNDaysWithDayOfWeek, formatDateString } from '../utils/date'

export function useDayNavigation(initialDate) {
  const weekStartDate = ref(new Date(initialDate))
  const weekDays = ref([])

  const updateWeekDays = () => {
    weekDays.value = getNextNDaysWithDayOfWeek(weekStartDate.value, 7).map((day) => ({
      date: new Date(day.date),
      label: day.dayOfWeek
    }))
  }

  const handleDateSelection = (date) => {
    weekStartDate.value = new Date(date)
    updateWeekDays()
  }

  const handleNavigateWeek = (direction) => {
    const newDate = new Date(weekStartDate.value)
    newDate.setDate(newDate.getDate() + direction * 7)
    weekStartDate.value = newDate
    updateWeekDays()
  }

  updateWeekDays()

  const formattedDate = computed(() => formatDateString(weekStartDate.value))

  return {
    weekDays,
    weekStartDate,
    handleDateSelection,
    handleNavigateWeek,
    updateWeekDays,
    formattedDate
  }
}

