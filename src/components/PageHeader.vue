<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<template>
  <section class="relative pt-32 md:pt-40 pb-16 md:pb-20 overflow-hidden bg-gradient-to-b from-primary-50/60 to-white">
    <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
      <div class="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-100/40 blur-3xl"></div>
      <div class="absolute top-20 -left-32 w-80 h-80 rounded-full bg-primary-50 blur-3xl"></div>
    </div>
    <div class="container-site relative">
      <h1 class="text-3xl md:text-5xl font-bold text-slate-900 mb-4 reveal">{{ title }}</h1>
      <p v-if="subtitle" class="section-subtitle reveal">{{ subtitle }}</p>
    </div>
  </section>
</template>
