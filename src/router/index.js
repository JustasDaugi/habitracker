import { createRouter, createWebHistory } from 'vue-router'
import HabitList from '../components/HabitList/HabitListContainer.vue'

const routes = [
  {
    path: '/',
    redirect: '/day/' + new Date().toISOString().split('T')[0]
  },
  {
    path: '/day/:date',
    name: 'Day',
    component: HabitList,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/day/' + new Date().toISOString().split('T')[0]
  }
]

const router = createRouter({
  history: createWebHistory('/habitracker/'),
  routes
})

export default router
