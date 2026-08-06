<script setup>
import { ref, onMounted } from 'vue'
import { adminPartners, createPartner, updatePartner, deletePartner } from '../../api'

const list = ref([])
const loading = ref(false)
const showModal = ref(false)
const editing = ref(null)
const form = ref({ name: '', logoUrl: '', sortOrder: 0 })

async function load() {
  loading.value = true
  try {
    const res = await adminPartners()
    list.value = res.data
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  form.value = { name: '', logoUrl: '', sortOrder: 0 }
  showModal.value = true
}

function openEdit(item) {
  editing.value = item
  form.value = { name: item.name, logoUrl: item.logoUrl || '', sortOrder: item.sortOrder || 0 }
  showModal.value = true
}

async function handleSave() {
  if (!form.value.name) return alert('品牌名必填')
  if (editing.value) {
    await updatePartner(editing.value.id, { ...form.value, isVisible: editing.value.isVisible })
  } else {
    await createPartner(form.value)
  }
  showModal.value = false
  load()
}

async function handleDelete(item) {
  if (!confirm(`确定删除品牌"${item.name}"？`)) return
  await deletePartner(item.id)
  load()
}

async function toggleVisible(item) {
  await updatePartner(item.id, { ...item, isVisible: item.isVisible === 1 ? 0 : 1 })
  load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">合作品牌</h1>
        <p class="text-sm text-slate-500 mt-1">管理首页合作品牌墙展示</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ 新建品牌</button>
    </div>

    <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-slate-400">加载中…</div>
      <div v-else-if="list.length === 0" class="p-10 text-center text-slate-400">暂无品牌</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th class="px-5 py-3 font-medium">品牌名</th>
            <th class="px-5 py-3 font-medium">Logo URL</th>
            <th class="px-5 py-3 font-medium">排序</th>
            <th class="px-5 py-3 font-medium">显示</th>
            <th class="px-5 py-3 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in list" :key="item.id" class="hover:bg-slate-50/60">
            <td class="px-5 py-4 font-medium text-slate-900">{{ item.name }}</td>
            <td class="px-5 py-4 text-slate-500 max-w-xs truncate">{{ item.logoUrl || '-' }}</td>
            <td class="px-5 py-4 text-slate-500">{{ item.sortOrder || 0 }}</td>
            <td class="px-5 py-4">
              <button
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                :class="item.isVisible === 1 ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                @click="toggleVisible(item)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="item.isVisible === 1 ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                {{ item.isVisible === 1 ? '显示' : '隐藏' }}
              </button>
            </td>
            <td class="px-5 py-4 text-right space-x-3">
              <button class="text-primary-600 hover:text-primary-700 text-sm" @click="openEdit(item)">编辑</button>
              <button class="text-red-500 hover:text-red-600 text-sm" @click="handleDelete(item)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">{{ editing ? '编辑品牌' : '新建品牌' }}</h3>
          <button class="text-slate-400 hover:text-slate-600" @click="showModal = false">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">品牌名 *</label>
            <input v-model="form.name" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">Logo URL</label>
            <input v-model="form.logoUrl" type="text" placeholder="/uploads/xxx.png" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">排序</label>
            <input v-model.number="form.sortOrder" type="number" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
          </div>
        </div>
        <div class="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button class="btn-outline !px-5 !py-2 !text-sm" @click="showModal = false">取消</button>
          <button class="btn-primary !px-5 !py-2 !text-sm" @click="handleSave">{{ editing ? '保存' : '创建' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
