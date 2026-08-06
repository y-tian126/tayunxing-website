<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'

const router = useRouter()
const route = useRoute()

const user = ref({ username: '', displayName: '' })
const mobileOpen = ref(false)

onMounted(() => {
  const stored = localStorage.getItem('cms_user')
  if (stored) {
    try { user.value = JSON.parse(stored) } catch (e) {}
  }
})

const menu = [
  { path: '/admin/articles', label: '文章管理', icon: 'article' },
  { path: '/admin/cases', label: '案例管理', icon: 'case' },
  { path: '/admin/solutions', label: '解决方案', icon: 'solution' },
  { path: '/admin/partners', label: '合作品牌', icon: 'partner' },
  { path: '/admin/stats', label: '数据亮点', icon: 'stats' },
  { path: '/admin/consultations', label: '咨询管理', icon: 'consultation' },
]

const currentPath = computed(() => route.path)

function handleLogout() {
  localStorage.removeItem('cms_token')
  localStorage.removeItem('cms_user')
  router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex">
    <!-- 侧边栏 -->
    <aside
      class="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 transform transition-transform duration-200"
      :class="mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
    >
      <div class="h-16 flex items-center gap-2.5 px-6 border-b border-slate-800">
        <img src="/logo.png" alt="踏云行" class="w-8 h-8 rounded-md" />
        <div>
          <div class="text-sm font-semibold">踏云行</div>
          <div class="text-xs text-slate-400">内容管理</div>
        </div>
      </div>

      <nav class="p-4 space-y-1">
        <RouterLink
          v-for="m in menu"
          :key="m.path"
          :to="m.path"
          class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors"
          :class="currentPath.startsWith(m.path) ? 'bg-primary-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'"
          @click="mobileOpen = false"
        >
          <span class="w-1.5 h-1.5 rounded-full" :class="currentPath.startsWith(m.path) ? 'bg-white' : 'bg-slate-500'"></span>
          {{ m.label }}
        </RouterLink>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-800">
        <RouterLink to="/" class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
          返回前台
        </RouterLink>
      </div>
    </aside>

    <!-- 主区 -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- 顶栏 -->
      <header class="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0">
        <button
          class="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900"
          @click="mobileOpen = !mobileOpen"
          aria-label="切换菜单"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="hidden lg:block text-sm text-slate-500">
          欢迎回来，<span class="font-medium text-slate-900">{{ user.displayName || user.username }}</span>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <div class="text-sm font-medium text-slate-900">{{ user.displayName || user.username }}</div>
            <div class="text-xs text-slate-400">{{ user.username }}</div>
          </div>
          <div class="w-9 h-9 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
            {{ (user.displayName || user.username || 'A').charAt(0).toUpperCase() }}
          </div>
          <button
            class="text-sm text-slate-500 hover:text-red-600 transition-colors"
            @click="handleLogout"
          >
            退出
          </button>
        </div>
      </header>

      <!-- 内容 -->
      <main class="flex-1 p-6 lg:p-8 overflow-auto">
        <RouterView />
      </main>
    </div>

    <!-- 遮罩 -->
    <div
      v-if="mobileOpen"
      class="fixed inset-0 bg-black/40 z-30 lg:hidden"
      @click="mobileOpen = false"
    ></div>
  </div>
</template>
