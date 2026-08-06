<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Icon from '../components/Icon.vue'
import { getCase } from '../api'

const route = useRoute()
const caseItem = ref(null)
const notFound = ref(false)

onMounted(async () => {
  try {
    const res = await getCase(Number(route.params.id))
    caseItem.value = res.data
  } catch (e) {
    notFound.value = true
  }
})
</script>

<template>
  <div v-if="caseItem">
    <!-- 头部 -->
    <section class="relative pt-32 md:pt-40 pb-16 overflow-hidden" :style="{ background: caseItem.cover }">
      <div class="absolute inset-0 bg-black/25" aria-hidden="true"></div>
      <div class="container-site relative">
        <RouterLink to="/cases" class="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-8 transition-colors">
          <Icon name="arrowRight" class="w-4 h-4 rotate-180" /> 返回案例中心
        </RouterLink>
        <span class="inline-block px-3 py-1 rounded-md bg-white/20 backdrop-blur text-white text-xs font-medium mb-4">{{ caseItem.industryLabel }}</span>
        <h1 class="text-3xl md:text-4xl font-bold text-white max-w-3xl leading-snug mb-4">{{ caseItem.title }}</h1>
        <p class="text-white/80 text-lg max-w-2xl">{{ caseItem.brand }} · {{ caseItem.summary }}</p>
      </div>
    </section>

    <!-- 数据亮点 -->
    <section class="py-14 bg-slate-50 border-b border-slate-100">
      <div class="container-site grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div v-for="h in caseItem.highlights" :key="h.label" class="bg-white rounded-xl border border-slate-100 shadow-sm p-7 text-center reveal">
          <div class="text-3xl font-bold text-primary-600 mb-1.5">{{ h.value }}</div>
          <div class="text-sm text-slate-500">{{ h.label }}</div>
        </div>
      </div>
    </section>

    <!-- 详情内容 -->
    <section class="section">
      <div class="container-site max-w-3xl">
        <div class="space-y-12">
          <div class="reveal">
            <div class="flex items-center gap-3 mb-4">
              <span class="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center font-bold">挑战</span>
              <h2 class="text-xl font-bold text-slate-900">面临的挑战</h2>
            </div>
            <p class="text-slate-600 leading-relaxed">{{ caseItem.challenge }}</p>
          </div>

          <div class="reveal">
            <div class="flex items-center gap-3 mb-4">
              <span class="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center font-bold">方案</span>
              <h2 class="text-xl font-bold text-slate-900">解决方案</h2>
            </div>
            <p class="text-slate-600 leading-relaxed">{{ caseItem.solution }}</p>
          </div>

          <div class="reveal">
            <div class="flex items-center gap-3 mb-4">
              <span class="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">效果</span>
              <h2 class="text-xl font-bold text-slate-900">项目成果</h2>
            </div>
            <p class="text-slate-600 leading-relaxed">{{ caseItem.result }}</p>
          </div>

          <div v-if="caseItem.image" class="reveal">
            <div class="rounded-2xl overflow-hidden border border-slate-200 shadow-lg shadow-slate-200/60">
              <img :src="caseItem.image" :alt="caseItem.title" class="w-full h-auto block" loading="lazy" />
            </div>
            <p class="text-xs text-slate-400 text-center mt-3">案例运营全景图</p>
          </div>

          <div class="reveal">
            <div class="rounded-2xl bg-slate-50 border border-slate-100 p-8 relative">
              <span class="absolute -top-4 left-8 text-6xl text-primary-200 font-serif leading-none" aria-hidden="true">“</span>
              <p class="text-slate-700 leading-relaxed italic mb-4 pl-4">{{ caseItem.testimonial }}</p>
              <div class="pl-4 text-sm font-medium text-slate-500">—— {{ caseItem.brand }} 运营负责人</div>
            </div>
          </div>
        </div>

        <div class="mt-16 text-center reveal">
          <p class="text-slate-500 mb-6">想获得类似的增长成果？</p>
          <RouterLink to="/contact" class="btn-primary">与我们聊聊您的品牌</RouterLink>
        </div>
      </div>
    </section>
  </div>

  <div v-else-if="notFound" class="pt-40 pb-24 text-center">
    <p class="text-slate-400 mb-6">案例不存在</p>
    <RouterLink to="/cases" class="btn-outline">返回案例中心</RouterLink>
  </div>
</template>
