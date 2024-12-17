<script src="./HomeView.ts" lang="ts"/>
<style src="./HomeView.css" />
<template>
  <header>
    <div class="chain-links">
        <RouterLink
            v-for="chain in Chains"
            :to="`/${chain}`"
        >
            {{ chain.toUpperCase() }}
        </RouterLink>
    </div>
  </header>
</template>
