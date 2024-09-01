<template>
  <div class="day-buttons">
    <v-btn
      v-for="day in weekDays"
      :key="day.date + weekStartDate.toISOString()"
      :color="day.date === selectedDay ? 'selected-button' : 'default-button'"
      :class="['date-button', 'white--text']"
      @click="handleDateSelected(day.date)"
    >
      {{ formatDayLabel(day.label) }}
    </v-btn>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  weekDays: Array,
  weekStartDate: Date,
  selectedDay: String
})

const emit = defineEmits(['date-selected'])

function handleDateSelected(date) {
  emit('date-selected', date)
  window.dispatchEvent(new CustomEvent('vue:date-selected', { detail: date }))
}

function formatDayLabel(label) {
  const [weekday, monthAndDate] = label.split(', ')
  const [, dateStr] = monthAndDate.split(' ')
  const day = parseInt(dateStr, 10)

  if (isNaN(day)) {
    console.error(`Failed to parse date from label: ${label}`)
    return label
  }

  return `${weekday.slice(0, 3)}, ${day}`
}
</script>

<style scoped>
.day-buttons {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}

.date-button {
  padding: 4px 8px;
  min-width: 70px;
  height: 36px;
  border-radius: 6px;
  text-transform: none;
  font-weight: normal;
  font-size: 0.75rem;
  line-height: 1.2;
  background: linear-gradient(to bottom, #C41E3A 0%, #9B1730 100%);
  color: #FFFFFF;
  transition: background 0.3s ease;
}

.date-button:hover {
  background: linear-gradient(to bottom, #B51B35 0%, #8A152B 100%);
}

.date-button.selected-button {
  background: linear-gradient(to bottom, #A31930 0%, #7D1328 100%);
  font-weight: bold;
}

@media (max-width: 600px) {
  .date-button {
    min-width: 65px;
    font-size: 0.7rem;
  }
}

@media (max-width: 400px) {
  .date-button {
    min-width: 55px;
    font-size: 0.65rem;
    padding: 4px;
  }
}
</style>
