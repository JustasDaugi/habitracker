<template>
  <v-card-text class="pa-0 custom-background">
    <v-list v-if="groupedHabits.length" dense class="habit-list">
      <template v-for="group in groupedHabits" :key="group.id">
        <v-list-item v-for="habit in group.habits" :key="habit.id" class="habit-item py-0">
          <template #prepend>
            <v-icon :icon="group.icon" size="small" class="mr-2"></v-icon>
            <div class="d-flex align-center">
              <v-checkbox
                v-model="habit.completed"
                :disabled="selectedDay > getTodayDate()"
                @change="$emit('update-habit-completion', habit)"
                :color="habit.completed ? 'success' : ''"
                hide-details
                density="compact"
                class="ma-0 pa-0 mr-1"
              ></v-checkbox>

              <HabitStateDialog
                :habit="habit"
                :show-stop-habit-dialog="showStopHabitDialog"
                :show-delete-habit-dialog="showDeleteHabitDialog"
                :stopping-habit="stoppingHabitProp"
                :deleting-habit="deletingHabitProp"
                :formatted-selected-day="formattedSelectedDay"
                @edit="$emit('open-edit-habit-dialog', $event)"
                @stop="$emit('open-stop-habit-dialog', $event)"
                @delete="$emit('open-delete-habit-dialog', $event)"
                @update:show-stop-habit-dialog="$emit('update:showStopHabitDialog', $event)"
                @update:show-delete-habit-dialog="$emit('update:showDeleteHabitDialog', $event)"
                @confirm-stop="$emit('confirm-stop-habit')"
                @confirm-delete="$emit('confirm-delete-habit')"
              />
            </div>
          </template>

          <v-list-item-title class="habit-name text-body-2">
            {{ habit.name }}
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-list>
    <v-alert v-else type="info" color="#C41E3A" class="white--text ma-2">
      No habits for this day.
    </v-alert>
  </v-card-text>
</template>

<script setup>
import { computed } from 'vue'
import { getTodayDate } from '../../utils/date'
import HabitStateDialog from './HabitStateDialog.vue'

const props = defineProps({
  groupedHabits: Array,
  selectedDay: [String, Date],
  showStopHabitDialog: Boolean,
  showDeleteHabitDialog: Boolean,
  stoppingHabit: Object,
  deletingHabit: Object,
  formattedSelectedDay: String
})

const stoppingHabitProp = computed(() =>
  props.stoppingHabit ? { ...props.stoppingHabit } : undefined
)

const deletingHabitProp = computed(() =>
  props.deletingHabit ? { ...props.deletingHabit } : undefined
)
</script>

<style scoped>
.custom-background,
.habit-list,
.habit-item {
  background-color: #222222;
}

.habit-item.bg-light-green-lighten-5 {
  background-color: #c8e6c9 !important;
}

.habit-name {
  color: #e0e0e0 !important;
}

.v-icon {
  color: white !important;
}
</style>
