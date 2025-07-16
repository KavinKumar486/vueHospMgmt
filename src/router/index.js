import { createRouter, createWebHistory } from 'vue-router'

// import helloWorld from '../components/getForm.vue'
// import Doctor from '../components/doctorForm.vue'
import Patient from '../components/getPatient.vue'
import HomeComponent from '../views/main.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeComponent,
    },
    // {
    //   path:'/doc',
    //   name:'doctor',
    //   component:Doctor
    
    // },
    {
      path:'/patient',
      name: 'patient',
      component:Patient
    }
  ],
})

export default router
