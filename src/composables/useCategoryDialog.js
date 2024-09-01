import { ref, watch } from 'vue'
import { predefinedIcons } from '../utils/categoryIcons'
import { loadCategories } from '../utils/categoryStorage'
import {
  addCategory,
  updateCategory,
  deleteCategory,
  saveCategory,
  resetForm,
  startEditCategory as startEdit,
  cancelEdit,
} from '../components/CategoryManager/categoryManager'

export function useCategoryDialog(emit) {
  const categories = ref(loadCategories())

  const refreshCategories = () => {
    categories.value = loadCategories()
  }

  const localDialogOpen = ref(false)
  const newCategoryName = ref('')
  const newCategoryIcon = ref('')
  const editingCategory = ref(null)

  const handleAddCategory = addCategory(categories)
  const handleUpdateCategory = updateCategory(categories)
  const handleDeleteCategory = (id) => {
    deleteCategory(categories, (event, categoryId) => {
      if (event === 'category-deleted') {
        emit(event, categoryId);
      }
    })(id);
  };
  
  const selectIcon = (icon) => {
    newCategoryIcon.value = icon
  }

  const saveCategoryAndClose = () => {
    if (!newCategoryName.value.trim()) {
      return
    }

    const success = saveCategory(
      handleAddCategory,
      handleUpdateCategory,
      editingCategory,
      newCategoryName,
      newCategoryIcon,
    )
    if (success) {
      emit('category-updated')
      localDialogOpen.value = false
      refreshCategories()
      resetForm(editingCategory, newCategoryName, newCategoryIcon)
    }
  }

  const startEditCategory = (category) => {
    startEdit(editingCategory, newCategoryName, newCategoryIcon, category)
  }

  const cancelEditAndClose = () => {
    cancelEdit(editingCategory, localDialogOpen, () =>
      resetForm(editingCategory, newCategoryName, newCategoryIcon)
    )
  }

  watch(localDialogOpen, (newValue) => {
    if (newValue) {
      resetForm(editingCategory, newCategoryName, newCategoryIcon)
    }
  })

  return {
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
  }
}



