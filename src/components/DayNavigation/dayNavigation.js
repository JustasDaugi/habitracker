import { ref, watch } from 'vue'
import { formatDateString, getTodayDate, isValidDate, isFutureDate } from '../../utils/date'

export function useNavigation(selectedDayRef, onDateChange, onFutureDateAttempt) {
  const weekDays = ref([])
  const weekStartDate = ref(new Date(selectedDayRef.value))

  const updateWeekDays = () => {
    const startDate = new Date(weekStartDate.value)
    startDate.setDate(startDate.getDate() - startDate.getDay())

    weekDays.value = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
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

  const updateWeek = (date) => {
    const newDate = new Date(date)
    newDate.setDate(newDate.getDate() - newDate.getDay())
    weekStartDate.value = newDate
    updateWeekDays()
  }

  watch(selectedDayRef, (newValue) => {
    updateWeek(newValue)
  }, { immediate: true })

  return {
    weekDays,
    weekStartDate,
    handleDateSelection,
    handleNavigateWeek,
    updateWeekDays,
    updateWeek
  }
}

export function handleRouteChange(newDate) {
  return newDate && isValidDate(newDate) ? newDate : getTodayDate()
}

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
