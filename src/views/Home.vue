<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import Icon from '../components/Icon.vue'
import { siteConfig, services } from '../data/site'
import { getStats, getCases, getArticles } from '../api'

const stats = ref([])
const featuredCases = ref([])
const latestNews = ref([])

const partnerCount = computed(() => {
  const item = stats.value.find((s) => s.label === '合作品牌')
  return item ? item.value : '24+'
})

onMounted(async () => {
  try {
    const [s, c, n] = await Promise.all([
      getStats(),
      getCases({ size: 3 }),
      getArticles({ size: 3 }),
    ])
    stats.value = s.data
    featuredCases.value = c.data.list
    latestNews.value = n.data.list
  } catch (e) {
    console.error('首页数据加载失败', e)
  }
})
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-primary-950 via-primary-900 to-primary-700">
      <!-- 装饰背景 -->
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-40 -right-40 w-[36rem] h-[36rem] rounded-full bg-primary-500/20 blur-3xl"></div>
        <div class="absolute bottom-0 -left-40 w-[30rem] h-[30rem] rounded-full bg-primary-400/15 blur-3xl"></div>
        <div class="absolute inset-0 opacity-[0.07]" style="background-image:linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px);background-size:56px 56px"></div>
      </div>

      <div class="container-site relative py-32 md:py-40">
        <div class="max-w-3xl">
          <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-primary-100 text-sm mb-6 backdrop-blur">
            <Icon name="zap" class="w-4 h-4 text-accent-400" />
            {{ siteConfig.identity }}
          </span>
          <h1 class="text-4xl md:text-6xl font-bold text-white leading-tight mb-6 tracking-tight">
            让每一个餐饮品牌<br />都拥有<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 to-primary-100">数字化增长力</span>
          </h1>
          <p class="text-lg md:text-xl text-primary-100/80 leading-relaxed mb-10 max-w-2xl">
            {{ siteConfig.subSlogan }}
          </p>
          <div class="flex flex-wrap gap-4">
            <RouterLink to="/services" class="btn-accent !px-8 !py-4">了解服务</RouterLink>
            <RouterLink to="/contact" class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg border border-white/30 text-white font-medium transition-all duration-300 hover:bg-white/10 hover:-translate-y-0.5 backdrop-blur">合作咨询</RouterLink>
          </div>
        </div>
      </div>

      <!-- 底部数据条 -->
      <div class="absolute bottom-0 inset-x-0 border-t border-white/10 bg-white/5 backdrop-blur">
        <div class="container-site grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
          <div v-for="s in stats" :key="s.label" class="py-6 md:py-8 px-4 text-center">
            <div class="text-2xl md:text-4xl font-bold text-white mb-1">{{ s.value }}</div>
            <div class="text-xs md:text-sm text-primary-200/70">{{ s.label }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务概览 -->
    <section class="section">
      <div class="container-site">
        <div class="text-center mb-14 reveal">
          <h2 class="section-title">我们能为您做什么</h2>
          <p class="section-subtitle mx-auto">从会员资产到数据洞察，提供覆盖品牌经营全链路的数字化运营服务</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(service, i) in services" :key="service.id" class="card p-8 reveal" :style="{ transitionDelay: `${(i % 3) * 80}ms` }">
            <div class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5">
              <Icon :name="service.icon" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2.5">{{ service.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ service.desc }}</p>
          </div>
        </div>
        <div class="text-center mt-12 reveal">
          <RouterLink to="/services" class="btn-outline">查看全部服务 <Icon name="arrowRight" class="w-4 h-4" /></RouterLink>
        </div>
      </div>
    </section>

    <!-- 合作品牌墙 -->
    <section class="py-16 md:py-20 bg-slate-50 border-y border-slate-100 overflow-hidden">
      <div class="container-site reveal">
        <h2 class="text-center text-2xl md:text-3xl font-bold text-slate-900 mb-3">{{ partnerCount }} 品牌的共同选择</h2>
        <p class="text-center text-slate-500 mb-10">覆盖茶饮、快餐、正餐、烘焙、烧烤等多业态餐饮品牌</p>
        <div class="rounded-2xl overflow-hidden shadow-xl shadow-slate-200/70 border border-slate-100">
          <img src="/assets/partners-wall.png" alt="踏云行合作品牌墙" class="w-full h-auto block" loading="lazy" />
        </div>
      </div>
    </section>

    <!-- 精选案例 -->
    <section class="section">
      <div class="container-site">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-14 reveal">
          <div>
            <h2 class="section-title">精选案例</h2>
            <p class="section-subtitle">用数据说话，看我们如何帮助品牌实现确定性增长</p>
          </div>
          <RouterLink to="/cases" class="btn-outline mt-6 md:mt-0 shrink-0">全部案例 <Icon name="arrowRight" class="w-4 h-4" /></RouterLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RouterLink
            v-for="(c, i) in featuredCases"
            :key="c.id"
            :to="`/cases/${c.id}`"
            class="card overflow-hidden group reveal"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <div class="h-40 flex items-center justify-center" :style="{ background: c.cover }">
              <span class="text-white/90 text-2xl font-bold tracking-widest">{{ c.brand }}</span>
            </div>
            <div class="p-6">
              <span class="inline-block px-2.5 py-1 rounded-md bg-primary-50 text-primary-600 text-xs font-medium mb-3">{{ c.industryLabel }}</span>
              <h3 class="text-base font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug">{{ c.title }}</h3>
              <p class="text-sm text-slate-500 leading-relaxed line-clamp-2">{{ c.summary }}</p>
              <div class="flex gap-6 mt-5 pt-4 border-t border-slate-100">
                <div v-for="h in c.highlights.slice(0, 2)" :key="h.label">
                  <div class="text-lg font-bold text-primary-600">{{ h.value }}</div>
                  <div class="text-xs text-slate-400">{{ h.label }}</div>
                </div>
              </div>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 最新动态 -->
    <section class="section bg-slate-50 border-y border-slate-100">
      <div class="container-site">
        <div class="flex flex-col md:flex-row md:items-end md:justify-between mb-14 reveal">
          <div>
            <h2 class="section-title">最新动态</h2>
            <p class="section-subtitle">公司动态、行业洞察与活动回顾</p>
          </div>
          <RouterLink to="/news" class="btn-outline mt-6 md:mt-0 shrink-0">查看全部 <Icon name="arrowRight" class="w-4 h-4" /></RouterLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RouterLink
            v-for="(n, i) in latestNews"
            :key="n.id"
            :to="`/news/${n.id}`"
            class="card p-7 group reveal"
            :style="{ transitionDelay: `${i * 80}ms` }"
          >
            <div class="flex items-center gap-3 mb-4">
              <span class="px-2.5 py-1 rounded-md bg-primary-50 text-primary-600 text-xs font-medium">{{ n.categoryLabel }}</span>
              <span class="text-xs text-slate-400">{{ n.date }}</span>
            </div>
            <h3 class="text-base font-semibold text-slate-900 mb-2.5 group-hover:text-primary-600 transition-colors leading-snug">{{ n.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed line-clamp-2">{{ n.summary }}</p>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- 底部CTA -->
    <section class="relative py-24 overflow-hidden bg-gradient-to-br from-primary-700 to-primary-900">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="absolute -top-24 right-1/4 w-96 h-96 rounded-full bg-primary-500/25 blur-3xl"></div>
      </div>
      <div class="container-site relative text-center reveal">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">开启品牌数字化增长之旅</h2>
        <p class="text-primary-100/80 text-lg mb-10 max-w-xl mx-auto">与我们的运营专家聊聊，获取专属于您品牌的增长方案</p>
        <RouterLink to="/contact" class="btn-accent !px-10 !py-4">立即咨询</RouterLink>
      </div>
    </section>
  </div>
</template>
