import FiveLettersView from '@/views/FiveLettersView.vue'
import HomeView from '@/views/HomeView.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/fiveletters',
      component: FiveLettersView,
      props: true
    }
  ]
})

export default router
