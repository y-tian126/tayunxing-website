<script setup>
import { ref, onMounted } from 'vue'
import { adminConsultations, updateConsultationStatus, deleteConsultation } from '../../api'

const list = ref([])
const loading = ref(false)
function formatDateTime(value) {
  if (!value) return ''

  const utcValue = value.includes('T')
    ? value
    : value.replace(' ', 'T')

  const date = new Date(
    /Z$|[+-]\d{2}:\d{2}$/.test(utcValue)
      ? utcValue
      : `${utcValue}Z`
  )

  return date
    .toLocaleString('zh-CN', {
      timeZone: 'Asia/Shanghai',
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(/\//g, '-')
}

const statusMap = {
  pending: { label: '待处理', class: 'bg-amber-50 text-amber-700' },
  following: { label: '跟进中', class: 'bg-blue-50 text-blue-700' },
  done: { label: '已完成', class: 'bg-emerald-50 text-emerald-700' },
}

async function load() {
  loading.value = true
  try {
    const res = await adminConsultations()
    list.value = res.data
  } finally {
    loading.value = false
  }
}

async function changeStatus(item, status) {
  await updateConsultationStatus(item.id, status)
  load()
}

async function handleDelete(item) {
  if (!confirm(`确定删除来自"${item.contactName}"的咨询？`)) return
  await deleteConsultation(item.id)
  load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-slate-900">咨询管理</h1>
      <p class="text-sm text-slate-500 mt-1">查看和处理来自前台官网的合作咨询</p>
    </div>

    <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-slate-400">加载中…</div>
      <div v-else-if="list.length === 0" class="p-10 text-center text-slate-400">暂无咨询</div>
      <div v-else class="divide-y divide-slate-100">
        <div v-for="item in list" :key="item.id" class="p-5 hover:bg-slate-50/60">
          <div class="flex items-start justify-between gap-4 mb-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-1.5">
                <h3 class="font-semibold text-slate-900">{{ item.contactName }}</h3>
                <span class="text-sm text-slate-500">{{ item.company || '未填写公司' }}</span>
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="(statusMap[item.status] || statusMap.pending).class"
                >
                  {{ (statusMap[item.status] || statusMap.pending).label }}
                </span>
              </div>
              <div class="text-sm text-slate-500 flex flex-wrap gap-x-5 gap-y-1">
                <span>📞 {{ item.phone }}</span>
                <span v-if="item.email">✉️ {{ item.email }}</span>
                <span class="text-slate-400">{{ formatDateTime(item.createdAt) }}</span>
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <select
                :value="item.status"
                class="text-xs px-2 py-1.5 rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                @change="changeStatus(item, $event.target.value)"
              >
                <option value="pending">待处理</option>
                <option value="following">跟进中</option>
                <option value="done">已完成</option>
              </select>
              <button class="text-red-500 hover:text-red-600 text-sm px-2" @click="handleDelete(item)">删除</button>
            </div>
          </div>
          <div v-if="item.message" class="text-sm text-slate-600 bg-slate-50 rounded-lg px-4 py-3 leading-relaxed">
            {{ item.message }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
