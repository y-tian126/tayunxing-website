<script setup>
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()
let observer = null

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-hidden')
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.12 }
  )
  observeAll()
})

watch(() => route.path, () => {
  setTimeout(observeAll, 100)
})

function observeAll() {
  // Add reveal-hidden to elements that don't have it yet
  document.querySelectorAll('.reveal:not(.reveal-hidden)').forEach((el) => {
    el.classList.add('reveal-hidden')
    observer.observe(el)
  })
}

onBeforeUnmount(() => {
  if (observer) observer.disconnect()
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-white">
    <Navbar />
    <main class="flex-1">
      <router-view @vue:mounted="observeAll" />
    </main>
    <Footer />
  </div>
</template>
