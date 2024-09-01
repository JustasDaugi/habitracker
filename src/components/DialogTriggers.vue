<template>
  <v-card-actions>
    <v-spacer></v-spacer>
    <CategoryManager
      @category-deleted="handleCategoryDeleted"
      @category-updated="refreshCategories"
    />
    <v-btn @click="openAddHabitDialog" class="add-habit-btn">
      <v-icon left>mdi-plus</v-icon>
      Add Habit
    </v-btn>
  </v-card-actions>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import CategoryManager from './CategoryManager/CategoryManager.vue'

const props = defineProps({
  categories: Array,
  openAddHabitDialog: Function,
  refreshCategories: Function
})

const emit = defineEmits(['categories-updated', 'open-add-habit-dialog'])

const handleCategoryDeleted = (deletedCategoryId) => {
  const updatedCategories = props.categories.filter(
    (category) => category.id !== deletedCategoryId.toString()
  )
  props.refreshCategories(updatedCategories)
  emit('categories-updated')
}
</script>

<style scoped>
.add-habit-btn {
  font-size: 0.75rem;
  font-weight: bold;
  color: #E0E0E0 !important;
  padding: 4px 8px;
  height: auto;
}

@media (max-width: 400px) {
  .add-habit-btn {
    font-size: 0.6rem;
    padding: 0 6px;
    height: 28px;
  }
}
</style>
