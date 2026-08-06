<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import Icon from '../components/Icon.vue'
import { getCases } from '../api'

const filters = [
  { id: 'all', label: '全部' },
  { id: 'tea', label: '茶饮' },
  { id: 'fastfood', label: '快餐' },
  { id: 'local', label: '正餐' },
  { id: 'other', label: '其他' },
]

const activeFilter = ref('all')
const cases = ref([])

onMounted(async () => {
  try {
    const res = await getCases({ size: 100 })
    cases.value = res.data.list
  } catch (e) {
    console.error('案例加载失败', e)
  }
})

const filteredCases = computed(() =>
  activeFilter.value === 'all' ? cases.value : cases.value.filter((c) => c.industry === activeFilter.value)
)
</script>

<template>
  <div>
    <PageHeader
      title="案例中心"
      subtitle="每一个数据背后，都是我们与品牌并肩作战的成果"
    />

    <section class="section !pt-2">
      <div class="container-site">
        <!-- 筛选 -->
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

        <!-- 案例网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RouterLink
            v-for="(c, i) in filteredCases"
            :key="c.id"
            :to="`/cases/${c.id}`"
            class="card overflow-hidden group reveal"
            :style="{ transitionDelay: `${(i % 2) * 80}ms` }"
          >
            <div class="h-48 flex items-center justify-center relative" :style="{ background: c.cover }">
              <span class="text-white/90 text-3xl font-bold tracking-widest">{{ c.brand }}</span>
              <span class="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-white/20 backdrop-blur text-white text-xs font-medium">{{ c.industryLabel }}</span>
            </div>
            <div class="p-7">
              <h3 class="text-lg font-semibold text-slate-900 mb-2.5 group-hover:text-primary-600 transition-colors leading-snug">{{ c.title }}</h3>
              <p class="text-sm text-slate-500 leading-relaxed mb-6">{{ c.summary }}</p>
              <div class="flex gap-8 pt-5 border-t border-slate-100">
                <div v-for="h in c.highlights" :key="h.label">
                  <div class="text-xl font-bold text-primary-600">{{ h.value }}</div>
                  <div class="text-xs text-slate-400 mt-0.5">{{ h.label }}</div>
                </div>
              </div>
              <div class="flex items-center gap-2 mt-6 text-sm font-medium text-primary-600">
                查看详情 <Icon name="arrowRight" class="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </RouterLink>
        </div>

        <div v-if="filteredCases.length === 0" class="text-center py-20 text-slate-400">
          该分类下暂无案例
        </div>
      </div>
    </section>
  </div>
</template>
