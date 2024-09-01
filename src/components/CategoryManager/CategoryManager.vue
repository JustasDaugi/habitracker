
<template>
  <CategoryDialog
    v-model="localDialogOpen"
    v-model:newCategoryName="newCategoryName"
    :categories="categories"
    :editingCategory="editingCategory"
    :newCategoryIcon="newCategoryIcon"
    :predefinedIcons="predefinedIcons"
    @start-edit="startEditCategory"
    @delete="handleDeleteCategory"
    @save="saveCategoryAndClose"
    @cancel="cancelEditAndClose"
    @select-icon="selectIcon"
  />
</template>

<script setup>
import { useCategoryDialog } from '../../composables/useCategoryDialog'
import CategoryDialog from './CategoryDialog.vue'

const emit = defineEmits(['category-updated', 'category-deleted'])

const {
  categories,
  localDialogOpen,
  newCategoryName,
  newCategoryIcon,
  editingCategory,
  predefinedIcons,
  handleDeleteCategory,
  selectIcon,
  saveCategoryAndClose,
  startEditCategory,
  cancelEditAndClose
} = useCategoryDialog(emit)
</script>
