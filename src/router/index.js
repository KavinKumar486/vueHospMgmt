// router/index.js or wherever you create and export your router
import { createRouter, createWebHistory } from 'vue-router'
import Patient from '../views/patientView.vue'
import Doctor from '../views/doctorView.vue'
import Login from '../views/loginView.vue'

const routes = [
  {
    path: '/',
    name: 'loginPage',
    component: Login,
  },
  {
    path: '/doc',
    name: 'doctor',
    component: Doctor,
    meta: { requiresAuth: true }    
  },
  {
    path: '/patient',
    name: 'patient',
    component: Patient,
    meta: { requiresAuth: true }    
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  console.log(to)
  const token = localStorage.getItem('jwt_token')
  if (to.meta.requiresAuth && !token) {
    next('/')
  }
   else {
    next()
  }
})
export default router
