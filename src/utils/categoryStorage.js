const CATEGORIES_STORAGE_KEY = 'habit_categories'

export function loadCategories() {
  try {
    const categoriesJson = localStorage.getItem(CATEGORIES_STORAGE_KEY)
    if (categoriesJson) {
      const parsedCategories = JSON.parse(categoriesJson)
      return parsedCategories.map((category) => ({
        ...category,
        icon: category.icon || 'mdi-help-circle-outline'
      }))
    }
  } catch (error) {
    console.error('Error loading categories:', error)
  }
  return []
}

export function saveCategories(categories) {
  try {
    const categoriesToSave = categories.map((category) => ({
      ...category,
      icon: category.icon || 'mdi-help-circle-outline'
    }))
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categoriesToSave))
  } catch (error) {
    console.error('Error saving categories:', error)
  }
}

export function createCategory(name, color, icon) {
  return {
    id: Date.now(), // timestamp as unique id
    name,
    color,
    icon: icon || 'mdi-help-circle-outline'
  }
}
