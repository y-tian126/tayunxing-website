<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import Icon from '../components/Icon.vue'
import { getSolutions } from '../api'

const solutions = ref([])
const activeId = ref(null)

onMounted(async () => {
  const res = await getSolutions()
  solutions.value = res.data
  if (solutions.value.length > 0) {
    activeId.value = solutions.value[0].id
  }
})

const active = computed(() => solutions.value.find((s) => s.id === activeId.value))

function select(id) {
  activeId.value = id
}
</script>

<template>
  <div>
    <PageHeader
      title="解决方案"
      subtitle="针对不同业态的经营痛点，提供经过验证的数字化增长方案"
    />

    <section class="section !pt-2">
      <div class="container-site">
        <!-- Tab 切换 -->
        <div class="flex flex-wrap justify-center gap-3 mb-14 reveal">
          <button
            v-for="s in solutions"
            :key="s.id"
            class="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="activeId === s.id
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            @click="select(s.id)"
          >
            {{ s.categoryLabel }}
          </button>
        </div>

        <!-- 方案详情 -->
        <div v-if="active" :key="active.id" class="max-w-4xl mx-auto">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-12 reveal">{{ active.title }}</h2>

          <!-- 痛点 -->
          <div class="card p-8 mb-6 reveal border-l-4 !border-l-red-400">
            <div class="flex items-center gap-2.5 mb-3">
              <span class="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center text-sm font-bold">痛</span>
              <h3 class="font-semibold text-slate-900">行业痛点</h3>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">{{ active.pain }}</p>
          </div>

          <!-- 策略 -->
          <div class="card p-8 mb-6 reveal border-l-4 !border-l-primary-500">
            <div class="flex items-center gap-2.5 mb-3">
              <span class="w-8 h-8 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center text-sm font-bold">策</span>
              <h3 class="font-semibold text-slate-900">核心策略</h3>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">{{ active.strategy }}</p>
          </div>

          <!-- 动作 -->
          <div class="card p-8 mb-6 reveal border-l-4 !border-l-emerald-500">
            <div class="flex items-center gap-2.5 mb-4">
              <span class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm font-bold">行</span>
              <h3 class="font-semibold text-slate-900">关键动作</h3>
            </div>
            <ul class="space-y-3">
              <li v-for="action in active.actions" :key="action" class="flex items-start gap-3 text-sm text-slate-600">
                <Icon name="check" class="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {{ action }}
              </li>
            </ul>
          </div>

          <!-- 效果 -->
          <div class="rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 p-8 md:p-10 reveal">
            <div class="flex items-center gap-2.5 mb-6">
              <span class="w-8 h-8 rounded-lg bg-white/15 text-white flex items-center justify-center"><Icon name="trendUp" class="w-4 h-4" /></span>
              <h3 class="font-semibold text-white">方案效果</h3>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div v-for="r in active.results" :key="r.label" class="text-center">
                <div class="text-3xl font-bold text-white mb-1">{{ r.value }}</div>
                <div class="text-sm text-primary-200/70">{{ r.label }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-14 reveal">
          <RouterLink to="/contact" class="btn-primary">获取同行业方案详情</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
