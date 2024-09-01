<template>
  <v-dialog
    :model-value="showHabitDialog"
    @update:model-value="(e) => updateModelValue(e, 'showHabitDialog')"
    max-width="500px"
  >
    <v-card class="custom-dialog">
      <v-card-title class="primary white--text">
        {{ editingHabit ? 'Edit Habit' : 'Add New Habit' }}
      </v-card-title>
      <v-card-text>
        <v-text-field
          :model-value="newHabitName"
          @update:model-value="(e) => updateModelValue(e, 'newHabitName')"
          label="Habit Name"
          @keyup.enter="save"
          outlined
        ></v-text-field>

        <v-select
          :model-value="newHabitCategory"
          @update:model-value="(e) => updateModelValue(e, 'newHabitCategory')"
          :items="categories"
          item-title="name"
          item-value="id"
          placeholder="Category"
          outlined
          class="custom-select"
        >
          <template v-slot:selection="{ item }">
            <v-icon :icon="item.raw.icon" class="mr-2"></v-icon>
            {{ item.raw.name }}
          </template>

          <template v-slot:item="{ item, props }">
            <v-list-item v-bind="props">
              <template v-slot:prepend>
                <v-icon :icon="item.raw.icon"></v-icon>
              </template>
            </v-list-item>
          </template>
        </v-select>

        <v-select
          v-if="!editingHabit"
          :model-value="selectedDaysOfWeek"
          @update:model-value="(e) => updateModelValue(e, 'selectedDaysOfWeek')"
          :items="daysOfWeek"
          label="Select days (leave empty for every day)"
          multiple
          chips
          outlined
          class="custom-select"
        ></v-select>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="text" @click="close">Cancel</v-btn>
        <v-btn variant="text" color="success" @click="save" :disabled="!newHabitName.trim()">
          {{ editingHabit ? 'Update' : 'Add' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  showHabitDialog: Boolean,
  editingHabit: Object,
  newHabitName: String,
  newHabitCategory: [String, Number, null],
  categories: Array,
  selectedDaysOfWeek: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:showHabitDialog',
  'update:newHabitName',
  'update:newHabitCategory',
  'update:selectedDaysOfWeek',
  'save',
  'close'
])

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
]

const updateModelValue = (value, prop) => {
  emit(`update:${prop}`, value)
}

const close = () => emit('close')

const save = () => {
  if (props.newHabitName.trim()) {
    emit('save', props.newHabitName.trim(), props.newHabitCategory, props.selectedDaysOfWeek)
  }
}
</script>


<style>
.custom-dialog {
  background-color: #222222 !important;
  color: white !important;
}

.custom-select {
  z-index: 3000;
  position: relative;
}

.v-select__content,
.v-menu__content {
  background-color: #222222 !important;
  color: white !important;
  opacity: 1 !important;
}

.v-list-item {
  background-color: #222222 !important;
  color: white !important;
}

.v-list {
  background-color: #222222 !important;
}

.v-field__overlay {
  opacity: 0 !important;
}

.v-field__field {
  color: white !important;
}
</style>
<style>
.custom-dialog {
  background-color: #222222 !important;
  color: white !important;
}

.custom-select {
  z-index: 3000;
  position: relative;
}

.v-select__content,
.v-menu__content {
  background-color: #222222 !important;
  color: white !important;
  opacity: 1 !important;
}

.v-list-item {
  background-color: #222222 !important;
  color: white !important;
}

.v-list {
  background-color: #222222 !important;
}

.v-field__overlay {
  opacity: 0 !important;
}

.v-field__field {
  color: white !important;
}
</style>