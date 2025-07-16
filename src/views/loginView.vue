<template>
<h1 id="heading">Login</h1>
<form @submit="()=> $router.push('/doc')">
    <label for="username">Username:</label>
    <input type="text" name="username" >
    <label for="password">Password:</label>
    <input type="password" name="password">
    <button type="submit">Login</button>
</form>
</template>
<script setup>
</script>
<style>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
#heading {
    text-align: center;
    margin-top: 20px;
    color: #333;
}
</style>