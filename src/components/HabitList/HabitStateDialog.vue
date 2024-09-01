<template>
  <v-menu location="bottom" class="custom-menu">
    <template #activator="{ props }">
      <v-btn icon v-bind="props" class="menu-button" style="width: 24px; height: 24px">
        <v-icon size="small" class="dots-icon">mdi-dots-vertical</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item v-for="action in actions" :key="action.text" @click="handleAction(action.event)">
        <v-list-item-title>{{ action.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-dialog v-for="dialog in dialogs" :key="dialog.title" v-model="dialog.show" max-width="500px">
    <v-card>
      <v-card-title class="primary white--text">{{ dialog.title }}</v-card-title>
      <v-card-text>{{ dialog.text }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="closeDialog(dialog)">Cancel</v-btn>
        <v-btn text color="error" @click="confirmDialog(dialog)">{{ dialog.confirmText }}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  habit: { type: Object, required: true },
  showStopHabitDialog: Boolean,
  showDeleteHabitDialog: Boolean,
  stoppingHabit: Object,
  deletingHabit: Object,
  formattedSelectedDay: String
})

const emit = defineEmits([
  'edit',
  'stop',
  'delete',
  'update:showStopHabitDialog',
  'update:showDeleteHabitDialog',
  'confirmStop',
  'confirmDelete',
  
])

const actions = [
  { text: 'Edit', event: 'edit' },
  { text: 'Stop', event: 'stop' },
  { text: 'Delete', event: 'delete' }
]

const dialogs = computed(() => [
  {
    title: 'Stop Habit',
    text: `Are you sure you want to stop tracking "${props.stoppingHabit?.name}" for today? This will remove it from your habit list for ${props.formattedSelectedDay} and all future days.`,
    show: props.showStopHabitDialog,
    updateEvent: 'update:showStopHabitDialog',
    confirmEvent: 'confirmStop',
    confirmText: 'Stop'
  },
  {
    title: 'Delete Habit',
    text: `Are you sure you want to delete "${props.deletingHabit?.name}"? This will remove it from all days.`,
    show: props.showDeleteHabitDialog,
    updateEvent: 'update:showDeleteHabitDialog',
    confirmEvent: 'confirmDelete',
    confirmText: 'Delete'
  }
])

const handleAction = (event) => {
  emit(event, props.habit)
}

const closeDialog = (dialog) => {
  emit(dialog.updateEvent, false)
}

const confirmDialog = (dialog) => {
  emit(dialog.confirmEvent)
  emit(dialog.updateEvent, false)
}
</script>

<style>
.custom-menu .v-list {
  background-color: #222222 !important;
  color: white !important;
}

.custom-menu .v-list-item {
  color: inherit !important;
}

.v-dialog .v-card {
  background-color: #222222 !important;
  color: white !important;
}

.v-dialog .v-card-title {
  color: white !important;
}

.v-dialog .v-btn {
  color: white !important;
}
</style>


<style scoped>
.habit-action-btn {
  width: 24px;
  height: 24px;
  margin-left: 4px;
}

.menu-button {
  background-color: #E0E0E0 !important;
}

.dots-icon {
  color: #000000 !important;
}
</style>
