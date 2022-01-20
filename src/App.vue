<template>
  <v-app id="app">
   <HomePage />
  </v-app>
</template>

<script>
import HomePage from './views/HomePage';
export default {
  name: "App",
  components: {
    HomePage
  }
};
</script>

<style>
  @import url('./assets/styles/main.css');

  html, body {
    font-family: 'Nunito', sans-serif !important;
  }
</style>