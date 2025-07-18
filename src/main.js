import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import axios from 'axios'  



axios.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt_token')
  console.log('Debug: Token from localStorage:', token)  // Logs the token value (or null if missing)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log('Debug: Authorization header set:', config.headers.Authorization)  // Confirms header is added
  } else {
    console.log('Debug: No token found in localStorage - request sent without auth')
  }
  return config
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
