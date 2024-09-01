<template>
  <div class="week-navigation">
    <v-btn icon @click="navigateWeek(-1)" class="nav-btn">
      <v-icon>mdi-chevron-left</v-icon>
    </v-btn>
    <slot></slot>
    <v-btn icon @click="navigateWeek(1)" class="nav-btn">
      <v-icon>mdi-chevron-right</v-icon>
    </v-btn>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue'

const emit = defineEmits(['navigate-week'])

const navigateWeek = (direction) => {
  emit('navigate-week', direction);
  document.dispatchEvent(new CustomEvent('navigate-week', { detail: direction }));
}
</script>


<style scoped>
.week-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.nav-btn {
  background: linear-gradient(to bottom, #C41E3A 0%, #9B1730 100%);
  color: white;
  transition: background 0.3s ease, transform 0.2s ease;
}

.nav-btn:hover {
  background: linear-gradient(to bottom, #B51B35 0%, #8A152B 100%);
  transform: scale(1.05);
}

.nav-btn:active {
  background: linear-gradient(to bottom, #A31930 0%, #7D1328 100%);
  transform: scale(0.95);
}

.nav-btn .v-icon {
  font-size: 24px;
}

@media (max-width: 320px) {
  .nav-btn {
    width: 32px;
    height: 32px;
  }

  .nav-btn .v-icon {
    font-size: 20px;
  }
}
</style>
