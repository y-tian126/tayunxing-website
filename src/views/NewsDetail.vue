<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import Icon from '../components/Icon.vue'
import { getArticle } from '../api'

const route = useRoute()
const article = ref(null)
const notFound = ref(false)

onMounted(async () => {
  try {
    const res = await getArticle(Number(route.params.id))
    article.value = res.data
  } catch (e) {
    notFound.value = true
  }
})
</script>

<template>
  <div v-if="article">
    <section class="pt-32 md:pt-40 pb-12 bg-gradient-to-b from-primary-50/60 to-white">
      <div class="container-site max-w-3xl">
        <RouterLink to="/news" class="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 text-sm mb-8 transition-colors">
          <Icon name="arrowRight" class="w-4 h-4 rotate-180" /> 返回新闻动态
        </RouterLink>
        <div class="flex items-center gap-3 mb-5">
          <span class="px-2.5 py-1 rounded-md bg-primary-50 text-primary-600 text-xs font-medium">{{ article.categoryLabel }}</span>
          <span class="text-sm text-slate-400">{{ article.date }}</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold text-slate-900 leading-snug">{{ article.title }}</h1>
	<p
  v-if="article.summary"
  class="mt-5 text-lg text-slate-500 leading-relaxed"
>
  {{ article.summary }}
</p>
      </div>
    </section>

    <section class="pb-24">
      <div class="container-site max-w-3xl">
        <div class="prose-custom border-t border-slate-100 pt-10" v-html="article.content"></div>
        <div class="mt-14 pt-8 border-t border-slate-100 flex items-center justify-between">
          <RouterLink to="/news" class="btn-outline !px-5 !py-2.5 !text-sm">查看全部动态</RouterLink>
          <RouterLink to="/contact" class="btn-primary !px-5 !py-2.5 !text-sm">合作咨询</RouterLink>
        </div>
      </div>
    </section>
  </div>

  <div v-else-if="notFound" class="pt-40 pb-24 text-center">
    <p class="text-slate-400 mb-6">文章不存在</p>
    <RouterLink to="/news" class="btn-outline">返回新闻动态</RouterLink>
  </div>
</template>

<style scoped>
.prose-custom :deep(p) {
  @apply text-slate-600 leading-relaxed mb-5;
}
</style>
