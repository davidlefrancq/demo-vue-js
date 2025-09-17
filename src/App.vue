<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <main class="min-h-screen grid place-items-center">
    <button class="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
      Hello Tailwind v4 on Vue
    </button>
  </main>

  <RouterView />
</template>
