<template>
<h1 id="heading">Login</h1>
<form @submit.prevent="handleLogin">
<label for="username">Username:</label>
<input v-model="uname" type="text" name="username" >
<label for="password">Password:</label>
<input v-model="pass" type="password" name="password">
<button type="submit">Login</button>
</form>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router' 
const uname= ref('')
const pass = ref('')
const expertise = ref('')
const credentials = ref({name:'',expertise:''})

const router = useRouter() 
async function handleLogin(){
   try {
     credentials.value.name = uname.value;
     credentials.value.pass = pass.value;
     const res = await axios.post('http://localhost:3333/login', credentials.value);
     console.log(res.data);

     if (res.data.message === 'Verified') {
      console.log(res.data.token)
      localStorage.setItem('jwt_token', res.data.token)
       console.log(res.data.token)
       
       router.push('/doc'); 
     } else {
       console.log('Login failed: Server did not return "Verified".');   
     }
   } catch (error) {
     console.error('An error occurred during login:', error);
     
     if (error.response) {
         console.error('Server response error:', error.response.data);
     }
   } finally {
     
     credentials.value.name ='';
     credentials.value.pass= '';
     uname.value='';
     pass.value='';
   }
}
</script>

<style>

</style>