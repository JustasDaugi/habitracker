<template>
  <div class="day-buttons">
    <v-btn
      v-for="day in weekDays"
      :key="day.date + weekStartDate.toISOString()"
      :color="day.date === selectedDay ? 'selected-button' : 'default-button'"
      class="date-button white--text"
      @click="handleDateSelected(day.date)"
    >
      <div class="date-content">
        <div class="date-top">{{ formatLabel(day.label, 'day') }}</div>
        <div class="date-bottom">{{ formatLabel(day.label, 'month') }}</div>
      </div>
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

const handleDateSelected = (date) => {
  emit('date-selected', date)
  window.dispatchEvent(new CustomEvent('vue:date-selected', { detail: date }))
}

const formatLabel = (label, type) => {
  const [weekday, monthAndDate] = label.split(', ')
  const [month, dateStr] = monthAndDate.split(' ')
  
  if (type === 'day') {
    const day = parseInt(dateStr, 10)
    return isNaN(day) ? label : `${weekday.slice(0, 3)}, ${day}`
  }
  
  return month.slice(0, 3)
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
  height: 50px;
  border-radius: 6px;
  text-transform: none;
  font-weight: normal;
  font-size: 0.75rem;
  line-height: 1.2;
  background: linear-gradient(to bottom, #C41E3A 0%, #9B1730 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: background 0.3s ease;
}

.date-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-top { margin-bottom: 2px; }
.date-bottom { font-size: 0.65rem; }

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
