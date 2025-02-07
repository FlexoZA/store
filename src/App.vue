<script setup>
//import { RouterLink, RouterView } from 'vue-router'
import Navigation from './components/Navigation.vue'
</script>

<template>
  <div class="bg-slate-100">
    <Navigation />
    <!--
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
-->

    <RouterView />
  </div>
</template>
