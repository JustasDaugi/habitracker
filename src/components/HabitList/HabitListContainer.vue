<template>
  <v-card class="rounded habit-list-card custom-background" :outlined="false">
    <v-card-title class="primary white--text d-flex align-center no-border card-title">
      <v-menu
        v-model="showDatePicker"
        :close-on-content-click="false"
        transition="scale-transition"
        :offset-y="true"
        min-width="auto"
      >
        <template v-slot:activator="{ props }">
          <v-icon
            :size="iconSize"
            class="mr-2 calendar-icon"
            v-bind="props"
          >
            mdi-calendar-check
          </v-icon>
        </template>
        <v-date-picker
          v-model="pickerDate"
          @update:model-value="updateSelectedDay"
          :max="maxDate"
          no-title
          scrollable
        ></v-date-picker>
      </v-menu>
      <div class="title-content">
        <span class="habits-for-text">Habits for</span>
        <span class="formatted-selected-day">{{ formattedSelectedDay }}</span>
      </div>
    </v-card-title>

    <HabitListContent
      :grouped-habits="groupedHabits"
      :selected-day="selectedDay"
      v-model:show-stop-habit-dialog="showStopHabitDialog"
      v-model:show-delete-habit-dialog="showDeleteHabitDialog"
      :stopping-habit="stoppingHabit"
      :deleting-habit="deletingHabit"
      :formatted-selected-day="formattedSelectedDay"
      @update-habit-completion="updateHabitCompletion"
      @open-edit-habit-dialog="openEditHabitDialog"
      @open-stop-habit-dialog="openStopHabitDialog"
      @open-delete-habit-dialog="openDeleteHabitDialog"
      @confirm-stop-habit="handleConfirmStopHabit"
      @confirm-delete-habit="handleConfirmDeleteHabit"
    />

    <DialogTriggers
      :categories="categories"
      :open-add-habit-dialog="openAddHabitDialog"
      :refresh-categories="refreshCategoryItems"
      @categories-updated="$emit('categories-updated')"
    />

    <AddHabitDialog
      v-model:show-habit-dialog="showHabitDialog"
      v-model:new-habit-name="newHabitName"
      v-model:new-habit-category="newHabitCategory"
      v-model:selected-days="selectedDays"
      v-model:selected-days-of-week="selectedDaysOfWeek"
      :categories="categories"
      :editing-habit="editingHabit"
      @save="handleSaveHabit"
      @close="closeHabitDialog"
    />
  </v-card>
</template>

<script setup>
import '../../styles/habit-list-container.css'
import { ref, watch, computed } from 'vue'
import { useHabitListContainer } from '../../composables/useHabitListContainer'
import AddHabitDialog from '../AddHabitDialog.vue'
import HabitListContent from './HabitListContent.vue'
import DialogTriggers from '../DialogTriggers.vue'
import { loadCategories } from '../../utils/categoryStorage'
import { saveHabit } from '../../stores/saveHabit'
import { formatDateString } from '../../utils/date'

const props = defineProps({
  date: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['habits-updated', 'categories-updated', 'date-changed'])


const selectedDaysOfWeek = ref([])
const showDatePicker = ref(false)
const pickerDate = ref(new Date(props.date))

const {
  selectedDay,
  showHabitDialog,
  showStopHabitDialog,
  showDeleteHabitDialog,
  newHabitName,
  newHabitCategory,
  stoppingHabit,
  deletingHabit,
  formattedSelectedDay,
  categories,
  groupedHabits,
  iconSize,
  updateHabitCompletion,
  openAddHabitDialog,
  openEditHabitDialog,
  openStopHabitDialog,
  openDeleteHabitDialog,
  closeHabitDialog,
  handleConfirmDeleteHabit,
  handleConfirmStopHabit,
  loadHabitsForDate,
  editingHabit,
  selectedDays
} = useHabitListContainer(props, emit)

const maxDate = computed(() => new Date())

watch(
  () => props.date,
  (newDate) => {
    loadHabitsForDate(newDate)
    pickerDate.value = new Date(newDate)
  },
  { immediate: true }
)

const updateSelectedDay = (date) => {
  showDatePicker.value = false
  const newDate = new Date(date)
  selectedDay.value = newDate
  loadHabitsForDate(formatDateString(newDate))
  emit('habits-updated', formatDateString(newDate))
  emit('date-changed', formatDateString(newDate))
}


const handleSaveHabit = () => {
  saveHabit(
    newHabitName.value,
    newHabitCategory.value,
    editingHabit.value,
    formatDateString(selectedDay.value),
    selectedDaysOfWeek.value,
    loadHabitsForDate,
    closeHabitDialog,
    emit,
    refreshCategoryItems
  )
}

const refreshCategoryItems = (updatedCategories) => {
  if (updatedCategories) {
    categories.value = updatedCategories
  } else {
    categories.value = loadCategories()
  }
}
</script>

<style scoped>
.card-title {
  display: flex;
  align-items: center;
}

.calendar-icon {
  margin-right: 8px;
  color: #e0e0e0;
  cursor: pointer;
}

.title-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.habits-for-text,
.formatted-selected-day {
  color: #e0e0e0;
  font-weight: bold;
  font-size: 1rem;
}

.habits-for-text {
  margin-right: 4px;
}

.custom-background {
  background-color: #222222;
  color: #222222;
}

:deep(.v-btn:not(.v-btn--outlined)) {
  color: #333333;
}

@media screen and (max-width: 600px) {
  .card-title {
    flex-direction: column;
    align-items: flex-start !important;
    padding-left: 16px;
  }

  .calendar-icon {
    margin-bottom: 8px;
    color: #e0e0e0;
  }

  .title-content {
    flex-direction: column;
    align-items: flex-start;
  }

  .habits-for-text,
  .formatted-selected-day {
    font-size: 0.875rem;
  }

  .habits-for-text {
    margin-right: 0;
    margin-bottom: 4px;
  }
}
</style>
