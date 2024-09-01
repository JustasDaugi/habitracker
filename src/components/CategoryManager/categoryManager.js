import { saveCategories } from '../../utils/categoryStorage'

const createCategory = (name, icon) => ({
  id: Date.now().toString(),
  name,
  icon
})

export const addCategory = (categories) => (name, icon) => {
  categories.value.push(createCategory(name, icon))
  saveCategories(categories.value)
}

export const updateCategory = (categories) => (id, name, icon) => {
  const index = categories.value.findIndex((c) => c.id === id)
  if (index !== -1) {
    categories.value[index] = { ...categories.value[index], name, icon }
    saveCategories(categories.value)
  }
}

export const deleteCategory = (categories, emit) => (id) => {
  categories.value = categories.value.filter((c) => c.id !== id)
  saveCategories(categories.value)
  emit('category-deleted', id)
}

export const saveCategory = (
  add,
  update,
  editing,
  newName,
  newIcon,
  defaultIcon = 'mdi-help-circle-outline'
) => {
  const name = newName.value.trim()
  const icon = newIcon.value || defaultIcon

  if (name) {
    if (editing.value) {
      update(editing.value.id, name, icon)
    } else {
      add(name, icon)
    }
    return true
  }
  return false
}

export const startEditCategory = (editing, newName, newIcon, category) => {
  editing.value = category
  newName.value = category.name
  newIcon.value = category.icon
}

export const cancelEdit = (editing, dialogOpen, resetForm) => {
  if (editing.value) {
    resetForm()
  } else {
    dialogOpen.value = false
  }
}

export const resetForm = (editing, newName, newIcon) => {
  editing.value = null
  newName.value = ''
  newIcon.value = ''
}

export const selectIcon = (newIcon, icon) => {
  newIcon.value = icon
}
