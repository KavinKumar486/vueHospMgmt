import { createRouter, createWebHistory } from 'vue-router'

// import helloWorld from '../components/getForm.vue'
// import Doctor from '../components/doctorForm.vue'
import Patient from '../views/patientView.vue'
import Doctor from '../views/doctorView.vue'
import Login from '../views/loginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'loginPage',
      component: Login,
    },
    {
    path:'/doc',
    name:'doctor',
      component:Doctor
    
    },
    {
      path:'/patient',
      name: 'patient',
      component:Patient
    }
  ],
})

export default router
