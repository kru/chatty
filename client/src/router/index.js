import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue';

import { useUserStore } from '@/stores/user';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/rooms',
      name: 'rooms',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/ChatView.vue'),
      beforeEnter: (to, from, next) => {
        const userStore = useUserStore();
        const isAuthenticated = userStore.auth
        console.log({ isAuthenticated })
        if (isAuthenticated) {
          next();
          return;
        }
        next({ name: 'home' });
      }
    }
  ]
})


export default router