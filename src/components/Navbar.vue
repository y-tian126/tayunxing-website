<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { siteConfig } from '../data/site'

const route = useRoute()
const scrolled = ref(false)
const mobileOpen = ref(false)

const navItems = [
  { path: '/', label: '首页' },
  { path: '/services', label: '业务介绍' },
  { path: '/solutions', label: '解决方案' },
  { path: '/cases', label: '案例中心' },
  { path: '/about', label: '关于我们' },
  { path: '/news', label: '新闻动态' },
]

function onScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', onScroll))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <header
    class="fixed top-0 inset-x-0 z-50 transition-all duration-300"
    :class="scrolled || mobileOpen ? 'bg-white/95 backdrop-blur shadow-sm' : 'bg-transparent'"
  >
    <div class="container-site flex items-center justify-between h-16 md:h-20">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center" @click="closeMobile">
        <img src="/logo-navbar.png" alt="踏云行" class="h-10 w-auto object-contain" />
      </RouterLink>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-1">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          :class="route.path === item.path ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'"
        >
          {{ item.label }}
        </RouterLink>
        <RouterLink to="/contact" class="btn-primary !px-5 !py-2.5 !text-sm ml-3">合作咨询</RouterLink>
      </nav>

      <!-- Mobile Hamburger -->
      <button
        class="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-slate-100"
        @click="mobileOpen = !mobileOpen"
        aria-label="菜单"
      >
        <span class="block w-5 h-0.5 bg-slate-700 transition-transform" :class="mobileOpen ? 'translate-y-2 rotate-45' : ''"></span>
        <span class="block w-5 h-0.5 bg-slate-700 transition-opacity" :class="mobileOpen ? 'opacity-0' : ''"></span>
        <span class="block w-5 h-0.5 bg-slate-700 transition-transform" :class="mobileOpen ? '-translate-y-2 -rotate-45' : ''"></span>
      </button>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <nav v-if="mobileOpen" class="md:hidden bg-white border-t border-slate-100 px-5 py-4 flex flex-col gap-1 shadow-lg">
        <RouterLink
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
          :class="route.path === item.path ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:bg-slate-50'"
          @click="closeMobile"
        >
          {{ item.label }}
        </RouterLink>
        <RouterLink to="/contact" class="btn-primary mt-2" @click="closeMobile">合作咨询</RouterLink>
      </nav>
    </transition>
  </header>
</template>
