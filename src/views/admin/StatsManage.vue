<script setup>
import { ref, onMounted } from 'vue'
import { adminStats, updateStats } from '../../api'

const list = ref([])
const loading = ref(false)
const saving = ref(false)

async function load() {
  loading.value = true
  try {
    const res = await adminStats()
    list.value = res.data
  } finally {
    loading.value = false
  }
}

function addItem() {
  list.value.push({ value: '', label: '' })
}

function removeItem(i) {
  list.value.splice(i, 1)
}

async function handleSave() {
  const items = list.value.filter((s) => s.value && s.label)
  saving.value = true
  try {
    await updateStats(items)
    alert('保存成功')
    load()
  } finally {
    saving.value = false
  }
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">数据亮点</h1>
        <p class="text-sm text-slate-500 mt-1">管理首页"6年+ / 3000+ / 24 / 10+"等核心数据</p>
      </div>
      <div class="flex gap-3">
        <button class="btn-outline !px-5 !py-2 !text-sm" @click="addItem">+ 添加一项</button>
        <button class="btn-primary !px-5 !py-2 !text-sm" :disabled="saving" @click="handleSave">
          {{ saving ? '保存中…' : '保存' }}
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-slate-100 p-6">
      <div v-if="loading" class="p-10 text-center text-slate-400">加载中…</div>
      <div v-else>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div v-for="(item, i) in list" :key="i" class="flex items-center gap-3 p-4 rounded-lg border border-slate-100 bg-slate-50/50">
            <div class="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold shrink-0">
              {{ i + 1 }}
            </div>
            <input
              v-model="item.value"
              type="text"
              placeholder="数值（如：6年+）"
              class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
            />
            <input
              v-model="item.label"
              type="text"
              placeholder="标签（如：品牌服务经验）"
              class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
            />
            <button class="text-red-500 hover:text-red-600 text-sm px-2" @click="removeItem(i)">×</button>
          </div>
        </div>
        <div v-if="list.length === 0" class="text-center py-10 text-slate-400">
          暂无数据，点击"+ 添加一项"开始
        </div>
      </div>
    </div>
  </div>
</template>
