<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="500px"
  >
    <template #activator="{ props }">
      <v-btn
        v-bind="props"
        :size="$vuetify.display.lgAndUp ? 'small' : 'default'"
        class="manage-categories-btn"
      >
        Categories
      </v-btn>
    </template>
    <v-card class="custom-dialog">
      <v-card-title>
        {{ editingCategory ? 'Edit Category' : 'Manage Categories' }}
      </v-card-title>

      <v-card-text>
        <v-list v-if="!editingCategory">
          <v-list-item v-for="category in categories" :key="category.id">
            <template v-slot:prepend>
              <v-icon :icon="category.icon" class="mr-2"></v-icon>
            </template>

            <v-list-item-title>
              {{ category.name }}
            </v-list-item-title>

            <template v-slot:append>
              <v-btn icon @click="$emit('start-edit', category)" class="action-btn">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="$emit('delete', category.id)" class="action-btn">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>

        <v-form @submit.prevent="$emit('save')">
          <v-text-field
            v-model="newCategoryNameModel"
            :label="editingCategory ? 'Edit Category Name' : 'New Category Name'"
            :rules="[(v) => !!v || 'Category name is required']"
            required
            class="mt-4"
          ></v-text-field>

          <v-row class="mt-2">
            <v-col cols="12">
              <label>Select Icon:</label>
            </v-col>
            <v-col v-for="icon in predefinedIcons" :key="icon" cols="3" sm="2">
              <v-btn
                @click="$emit('select-icon', icon)"
                :color="newCategoryIcon === icon ? 'primary' : ''"
                class="icon-btn"
                icon
                variant="outlined"
              >
                <v-icon>{{ icon }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="
            $emit('save', {
              name: newCategoryNameModel.trim(),
              icon: newCategoryIcon || 'mdi-cirlce-outline'
            })
          "
          :disabled="!newCategoryNameModel.trim()"
        >
          {{ editingCategory ? 'Update' : 'Add' }} Category
        </v-btn>
        <v-btn color="grey" @click="$emit('cancel')">
          {{ editingCategory ? 'Cancel' : 'Close' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  categories: Array,
  editingCategory: Object,
  newCategoryName: String,
  newCategoryIcon: String,
  predefinedIcons: Array
})

const emit = defineEmits([
  'update:modelValue',
  'update:newCategoryName',
  'start-edit',
  'delete',
  'save',
  'cancel',
  'select-icon'
])

const newCategoryNameModel = computed({
  get: () => props.newCategoryName,
  set: (value) => emit('update:newCategoryName', value)
})
</script>

<style>
.custom-dialog {
  background-color: #222222 !important;
  color: white !important;
}

.custom-dialog .v-list,
.custom-dialog .v-card,
.custom-dialog .action-btn {
  background-color: inherit !important;
  color: inherit !important;
}

.custom-dialog .v-field__outline,
.custom-dialog .v-label {
  color: rgba(255, 255, 255, 0.7) !important;
}

.custom-dialog .v-field__input,
.custom-dialog .v-btn {
  color: inherit !important;
}

.custom-dialog .action-btn .v-icon {
  color: white !important;
}
</style>

<style scoped>
.manage-categories-btn {
  font-size: 0.75rem;
  font-weight: bold;
  color: #E0E0E0 !important;
  padding: 4px 8px;
  height: auto;
}

@media (max-width: 400px) {
  .manage-categories-btn {
    font-size: 0.6rem;
    padding: 0 6px;
    height: 28px;
  }
}
</style>