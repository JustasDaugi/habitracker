<template>
  <v-card class="mb-6 custom-background" flat>
    <v-card-text style="max-width: 100%; margin: auto">
      <WeekButtons
        :selected-day="selectedDay"
        @navigate-week="handleNavigateWeek"
        @show-future-date-message="handleFutureDateMessage"
      >
        <DayButtons
          :week-days="weekDays"
          :week-start-date="weekStartDate"
          :selected-day="selectedDay"
          @date-selected="handleDateSelection"
        />
      </WeekButtons>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useNavigation } from './dayNavigation'
import WeekButtons from './WeekButtons.vue'
import DayButtons from './DayButtons.vue'

const props = defineProps({
  selectedDay: String
})

const emit = defineEmits(['day-changed', 'show-future-date-message'])

const { weekDays, weekStartDate, handleDateSelection, handleNavigateWeek, updateWeek } = useNavigation(
  computed(() => new Date(props.selectedDay)),
  (date) => emit('day-changed', date),
  () => emit('show-future-date-message')
)

const handleFutureDateMessage = () => emit('show-future-date-message')

watch(() => props.selectedDay, (newDate) => {
  updateWeek(new Date(newDate))
})
</script>


<style scoped>
.day-navigation-container {
  max-width: 100%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-background {
  background-color:  #222222;
  color: #E0E0E0;
}

:deep(.v-btn) {
  color: #E0E0E0;
}

:deep(.v-btn--active) {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>
