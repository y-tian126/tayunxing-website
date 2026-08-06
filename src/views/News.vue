<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import Icon from '../components/Icon.vue'
import { getArticles } from '../api'

const filters = [
  { id: 'all', label: '全部' },
  { id: 'company', label: '公司动态' },
  { id: 'insight', label: '行业洞察' },
  { id: 'event', label: '活动回顾' },
]

const activeFilter = ref('all')
const news = ref([])

onMounted(async () => {
  const res = await getArticles({ size: 100 })
  news.value = res.data.list
})

const filteredNews = computed(() =>
  activeFilter.value === 'all' ? news.value : news.value.filter((n) => n.category === activeFilter.value)
)
</script>

<template>
  <div>
    <PageHeader
      title="新闻动态"
      subtitle="公司动态、行业洞察与活动回顾，了解我们的最新进展"
    />

    <section class="section !pt-2">
      <div class="container-site">
        <div class="flex flex-wrap justify-center gap-3 mb-14 reveal">
          <button
            v-for="f in filters"
            :key="f.id"
            class="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300"
            :class="activeFilter === f.id
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
            @click="activeFilter = f.id"
          >
            {{ f.label }}
          </button>
        </div>

        <div class="max-w-3xl mx-auto space-y-6">
          <RouterLink
            v-for="(n, i) in filteredNews"
            :key="n.id"
            :to="`/news/${n.id}`"
            class="card p-7 md:p-8 flex flex-col sm:flex-row sm:items-center gap-6 group reveal"
            :style="{ transitionDelay: `${i * 60}ms` }"
          >
            <div class="sm:w-24 shrink-0 text-center sm:border-r sm:border-slate-100 sm:pr-6">
              <div class="text-2xl font-bold text-slate-900">{{ n.date.slice(8, 10) }}</div>
              <div class="text-xs text-slate-400 mt-0.5">{{ n.date.slice(0, 7) }}</div>
            </div>
            <div class="flex-1">
              <span class="inline-block px-2.5 py-1 rounded-md bg-primary-50 text-primary-600 text-xs font-medium mb-2.5">{{ n.categoryLabel }}</span>
              <h3 class="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors leading-snug">{{ n.title }}</h3>
              <p class="text-sm text-slate-500 leading-relaxed line-clamp-2">{{ n.summary }}</p>
            </div>
            <Icon name="arrowRight" class="w-5 h-5 text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all shrink-0 hidden sm:block" />
          </RouterLink>
        </div>

        <div v-if="filteredNews.length === 0" class="text-center py-20 text-slate-400">
          该分类下暂无文章
        </div>
      </div>
    </section>
  </div>
</template>
