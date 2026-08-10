<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import Icon from '../components/Icon.vue'
import { siteConfig, stats, milestones, advantages } from '../data/site'
import { getStats } from '../api'

const aboutStats = ref(stats)

onMounted(async () => {
  try {
    const response = await getStats()

    if (Array.isArray(response.data) && response.data.length) {
      aboutStats.value = response.data
    }
  } catch (error) {
    console.error('关于我们数据加载失败', error)
  }
})
</script>

<template>
  <div>
    <PageHeader
      title="关于我们"
      subtitle="一家专业深耕餐饮的品牌策划运营公司，用数字化能力助力品牌增长"
    />

    <!-- 公司简介 -->
    <section class="section !pt-4">
      <div class="container-site grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div class="reveal">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-6">公司简介</h2>
          <p class="text-slate-600 leading-relaxed mb-5">
            {{ siteConfig.fullName }}是一家专业深耕餐饮的品牌策划运营公司，拥有6年+运营经验，在全国拥有本地生活达人3000+，目前可覆盖杭州、上海、南京、苏州、西安、成都、重庆、广州、长沙、武汉等城市。
          </p>
          <div class="rounded-xl bg-accent-50 border border-accent-100 p-6 mb-6">
            <div class="flex items-center gap-2.5 mb-2">
              <Icon name="zap" class="w-5 h-5 text-accent-500" />
              <span class="font-semibold text-accent-700">{{ siteConfig.identity }}</span>
            </div>
            <p class="text-sm text-slate-600 leading-relaxed">{{ siteConfig.identityDetail }}。</p>
          </div>
          <div class="grid grid-cols-2 gap-6">
            <div v-for="s in aboutStats" :key="s.label">
              <div class="text-2xl font-bold text-primary-600">{{ s.value }}</div>
              <div class="text-sm text-slate-500 mt-1">{{ s.label }}</div>
            </div>
          </div>
        </div>

        <!-- 覆盖城市 -->
        <div class="reveal">
          <div class="card p-8">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-11 h-11 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                <Icon name="mapPin" class="w-5 h-5" />
              </div>
              <h3 class="text-lg font-semibold text-slate-900">覆盖城市</h3>
            </div>
            <div class="flex flex-wrap gap-3">
              <span
                v-for="city in siteConfig.cities"
                :key="city"
                class="px-4 py-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 text-sm font-medium"
              >
                {{ city }}
              </span>
            </div>
            <p class="text-sm text-slate-400 mt-6 leading-relaxed">本地生活达人资源覆盖全国核心城市，支撑全域内容种草与探店营销落地。</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 核心优势 -->
    <section class="section bg-slate-50 border-y border-slate-100">
      <div class="container-site">
        <div class="text-center mb-14 reveal">
          <h2 class="section-title">核心优势</h2>
          <p class="section-subtitle mx-auto">平台级合作资源与品类操盘经验，让数字化运营真正落地见效</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div v-for="(adv, i) in advantages" :key="adv.title" class="card p-8 reveal" :style="{ transitionDelay: `${(i % 2) * 80}ms` }">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center mb-5 shadow-lg shadow-primary-500/25">
              <Icon :name="adv.icon" class="w-6 h-6" />
            </div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2.5">{{ adv.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ adv.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 发展历程 -->
    <section class="section">
      <div class="container-site">
        <div class="text-center mb-16 reveal">
          <h2 class="section-title">发展历程</h2>
          <p class="section-subtitle mx-auto">深耕餐饮数字化，每一步都与品牌共同成长</p>
        </div>
        <div class="max-w-3xl mx-auto relative">
          <div class="absolute left-[19px] md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-primary-100" aria-hidden="true"></div>
          <div
            v-for="(m, i) in milestones"
            :key="m.title"
            class="relative flex items-start gap-8 mb-12 last:mb-0 reveal"
            :class="i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'"
          >
            <div class="hidden md:block md:w-1/2" :class="i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'">
              <div class="card p-6 inline-block text-left">
                <div class="text-accent-500 font-bold text-lg mb-1">{{ m.year }}</div>
                <h3 class="font-semibold text-slate-900 mb-1.5">{{ m.title }}</h3>
                <p class="text-sm text-slate-500 leading-relaxed">{{ m.desc }}</p>
              </div>
            </div>
            <div class="absolute left-0 md:left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-primary-500 flex items-center justify-center z-10 shadow-md">
              <span class="w-3 h-3 rounded-full bg-primary-500"></span>
            </div>
            <div class="md:hidden pl-14">
              <div class="card p-6">
                <div class="text-accent-500 font-bold text-lg mb-1">{{ m.year }}</div>
                <h3 class="font-semibold text-slate-900 mb-1.5">{{ m.title }}</h3>
                <p class="text-sm text-slate-500 leading-relaxed">{{ m.desc }}</p>
              </div>
            </div>
            <div class="hidden md:block md:w-1/2"></div>
          </div>
        </div>
      </div>
    </section>

    <section class="pb-24">
      <div class="container-site text-center reveal">
        <h2 class="text-2xl md:text-3xl font-bold text-slate-900 mb-4">期待与您同行</h2>
        <p class="text-slate-500 mb-8">无论您的品牌处于哪个阶段，我们都能提供匹配的成长助力</p>
        <RouterLink to="/contact" class="btn-accent">开启合作</RouterLink>
      </div>
    </section>
  </div>
</template>
