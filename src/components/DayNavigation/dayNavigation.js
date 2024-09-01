import { ref, watch } from 'vue'
import { formatDateString, getTodayDate, isValidDate, isFutureDate } from '../../utils/date'

export function useNavigation(selectedDay, onDateChange, onFutureDateAttempt) {
  const weekDays = ref([])
  const weekStartDate = ref(new Date(selectedDay.value))

  const updateWeekDays = () => {
    weekDays.value = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStartDate.value)
      date.setDate(weekStartDate.value.getDate() + i)
      return {
        date: formatDateString(date),
        label: date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      }
    })
  }

  const handleDateSelection = (date) => {
    if (isFutureDate(date)) {
      onFutureDateAttempt()
      return
    }
    onDateChange(date)
  }

  const handleNavigateWeek = (direction) => {
    const newDate = new Date(weekStartDate.value)
    newDate.setDate(newDate.getDate() + direction * 7)

    if (direction > 0 && isFutureDate(newDate)) {
      onFutureDateAttempt()
      return
    }

    weekStartDate.value = newDate
    updateWeekDays()
  }

  watch(
    () => selectedDay.value,
    (newValue) => {
      weekStartDate.value = new Date(newValue)
      weekStartDate.value.setDate(weekStartDate.value.getDate() - weekStartDate.value.getDay())
      updateWeekDays()
    },
    { immediate: true }
  )

  return {
    weekDays,
    weekStartDate,
    handleDateSelection,
    handleNavigateWeek,
    updateWeekDays
  }
}

/**
 * @param newDate
 * @returns {string}
 */
export function handleRouteChange(newDate) {
  return newDate && isValidDate(newDate) ? newDate : getTodayDate()
}

/**
 * Updates the selected day, handling future dates and routing.
 * 
 * @param newDate - The new date to be set
 * @param selectedDay - Ref containing the currently selected date
 * @param router - Vue Router instance for navigation
 * @param showFutureDateMessage - Ref to control display of future date warning
 */
export function updateSelectedDay(newDate, selectedDay, router, showFutureDateMessage) {
  const formattedNewDate = formatDateString(newDate)
  const today = getTodayDate()

  if (formattedNewDate > today) {
    showFutureDateMessage.value = true
    router.replace(`/day/${today}`).catch(() => {})
    return
  }

  if (formattedNewDate !== formatDateString(selectedDay.value)) {
    selectedDay.value = new Date(formattedNewDate)
    router.push(`/day/${formattedNewDate}`).catch(() => {})
  }
}
