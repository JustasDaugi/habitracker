<template>
  <v-app class="app">
    <v-main>
      <v-container class="mt-5">
        <v-row justify="center" class="mb-4">
          <v-col cols="12" class="text-center">
            <h1 class="text-h3 font-weight-bold primary--text">Habitrack</h1>
          </v-col>
        </v-row>
        <DayNavigation
          :selectedDay="formatDateString(selectedDay)"
          @day-changed="handleDayChange"
          @show-future-date-message="showFutureDateMessage = true"
        />
        <HabitListContainer 
          :date="formatDateString(selectedDay)" 
          @date-changed="handleDateChange"
        />
      </v-container>
    </v-main>
    <v-snackbar v-model="showFutureDateMessage" color="error" timeout="3000">
      Cannot navigate to future dates.
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTodayDate, formatDateString } from '../utils/date'
import { updateSelectedDay, handleRouteChange } from '../components/DayNavigation/dayNavigation'
import DayNavigation from '../components/DayNavigation/DayNavigation.vue'
import HabitListContainer from '../components/HabitList/HabitListContainer.vue'

const route = useRoute()
const router = useRouter()
const selectedDay = ref(new Date(getTodayDate()))
const showFutureDateMessage = ref(false)

const handleDayChange = (newDate) => {
  const dateValue = typeof newDate === 'string' ? new Date(newDate) : newDate
  updateSelectedDay(dateValue, selectedDay, router, showFutureDateMessage)
}

const handleDateChange = (newDate) => {
  selectedDay.value = new Date(newDate)
}

watch(
  () => route.params.date,
  (newDate) => {
    if (typeof newDate === 'string') {
      const validDate = new Date(handleRouteChange(newDate))
      handleDayChange(validDate)
    }
  },
  { immediate: true }
)
</script>


<style scoped>
.app {
  background-color: #222222;
}

.text-h3 {
  color: white !important;
}

.primary--text {
  color: white !important;
}
</style>
