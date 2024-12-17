<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppHeader from './common/Header.vue'
import { Chains } from './views';
</script>

<template>
  <header>
      <AppHeader msg="OKXConnect Examples" />
  </header>

  <div id="app-container">
    <RouterView />
  </div>
</template>

<style src="./App.css"></style>
