<template>
  <div class="flex flex-col items-center justify-center min-h-[60vh]">
    <h1 class="text-3xl font-bold text-center mb-4">Bienvenue sur la page d’accueil</h1>
    <h2 class="text-gray-600 text-lg mb-8 text-center">Ceci est le sous-titre de la page d’accueil</h2>
    <button
      class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
      @click="goToDemo"
    >
      Bouton de test
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useRouter } from 'vue-router';

  const router = useRouter();
  function goToDemo() {
    router.push({ name: 'shared-demo' });
  }
</script>

<style scoped>
</style>
