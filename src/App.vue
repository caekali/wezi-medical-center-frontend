<script setup>
import { RouterView } from 'vue-router'
import Layout from './components/Layout.vue'
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* Global styles */
html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

* {
  box-sizing: border-box;
}
</style>