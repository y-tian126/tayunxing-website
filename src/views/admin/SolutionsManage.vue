<script setup>
import { ref, onMounted } from 'vue'
import { adminSolutions, createSolution, updateSolution, deleteSolution } from '../../api'

const list = ref([])
const loading = ref(false)
const showModal = ref(false)
const editing = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return {
    category: '', categoryLabel: '', title: '', pain: '', strategy: '',
    actions: [], results: [], sortOrder: 0, isVisible: true,
  }
}

async function load() {
  loading.value = true
  try {
    const res = await adminSolutions()
    list.value = res.data
  } finally {
    loading.value = false
  }
}

function openCreate() {
  editing.value = null
  form.value = emptyForm()
  showModal.value = true
}

function openEdit(item) {
  editing.value = item
  form.value = {
    category: item.category, categoryLabel: item.categoryLabel,
    title: item.title, pain: item.pain || '', strategy: item.strategy || '',
    actions: Array.isArray(item.actions) ? JSON.parse(JSON.stringify(item.actions)) : [],
    results: Array.isArray(item.results) ? JSON.parse(JSON.stringify(item.results)) : [],
    sortOrder: item.sortOrder || 0, isVisible: item.isVisible,
  }
  showModal.value = true
}

function addAction() {
  form.value.actions.push('')
}

function removeAction(i) {
  form.value.actions.splice(i, 1)
}

function addResult() {
  form.value.results.push({ label: '', value: '' })
}

function removeResult(i) {
  form.value.results.splice(i, 1)
}

async function handleSave() {
  if (!form.value.title) return alert('标题必填')
  if (!form.value.categoryLabel) return alert('分类标签必填')
  const payload = {
    ...form.value,
    actions: form.value.actions.filter((a) => a),
    results: form.value.results.filter((r) => r.label && r.value),
  }
  if (editing.value) {
    await updateSolution(editing.value.id, payload)
  } else {
    await createSolution(payload)
  }
  showModal.value = false
  load()
}

async function handleDelete(item) {
  if (!confirm(`确定删除"${item.categoryLabel}"方案？`)) return
  await deleteSolution(item.id)
  load()
}

async function toggleVisible(item) {
  await updateSolution(item.id, { ...item, isVisible: !item.isVisible })
  load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">解决方案管理</h1>
        <p class="text-sm text-slate-500 mt-1">管理不同业态的数字化增长方案</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ 新建方案</button>
    </div>

    <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-slate-400">加载中…</div>
      <div v-else-if="list.length === 0" class="p-10 text-center text-slate-400">暂无方案</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th class="px-5 py-3 font-medium">分类</th>
            <th class="px-5 py-3 font-medium">方案标题</th>
            <th class="px-5 py-3 font-medium">排序</th>
            <th class="px-5 py-3 font-medium">显示</th>
            <th class="px-5 py-3 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in list" :key="item.id" class="hover:bg-slate-50/60">
            <td class="px-5 py-4">
              <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">{{ item.categoryLabel }}</span>
            </td>
            <td class="px-5 py-4 font-medium text-slate-900 max-w-md truncate">{{ item.title }}</td>
            <td class="px-5 py-4 text-slate-500">{{ item.sortOrder || 0 }}</td>
            <td class="px-5 py-4">
              <button
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                :class="item.isVisible ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                @click="toggleVisible(item)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="item.isVisible ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                {{ item.isVisible ? '显示' : '隐藏' }}
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

    <!-- 编辑弹窗 -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" @click.self="showModal = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-900">{{ editing ? '编辑方案' : '新建方案' }}</h3>
          <button class="text-slate-400 hover:text-slate-600" @click="showModal = false">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">分类标识</label>
              <input v-model="form.category" type="text" placeholder="如：dessert" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">分类标签 *</label>
              <input v-model="form.categoryLabel" type="text" placeholder="如：甜品饮品" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">方案标题 *</label>
            <input v-model="form.title" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">行业痛点</label>
            <textarea v-model="form.pain" rows="3" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">核心策略</label>
            <textarea v-model="form.strategy" rows="3" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none"></textarea>
          </div>

          <!-- 关键动作 -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-slate-700">关键动作</label>
              <button class="text-xs text-primary-600 hover:text-primary-700" @click="addAction">+ 添加</button>
            </div>
            <div class="space-y-2">
              <div v-for="(a, i) in form.actions" :key="i" class="flex items-center gap-2">
                <input v-model="form.actions[i]" type="text" placeholder="动作描述" class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
                <button class="text-red-500 hover:text-red-600 text-sm px-2" @click="removeAction(i)">×</button>
              </div>
              <div v-if="form.actions.length === 0" class="text-xs text-slate-400">暂无动作</div>
            </div>
          </div>

          <!-- 方案效果 -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-slate-700">方案效果</label>
              <button class="text-xs text-primary-600 hover:text-primary-700" @click="addResult">+ 添加</button>
            </div>
            <div class="space-y-2">
              <div v-for="(r, i) in form.results" :key="i" class="flex items-center gap-2">
                <input v-model="r.label" type="text" placeholder="指标名" class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
                <input v-model="r.value" type="text" placeholder="数值" class="w-32 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
                <button class="text-red-500 hover:text-red-600 text-sm px-2" @click="removeResult(i)">×</button>
              </div>
              <div v-if="form.results.length === 0" class="text-xs text-slate-400">暂无效果数据</div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">排序</label>
              <input v-model.number="form.sortOrder" type="number" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">显示状态</label>
              <select v-model="form.isVisible" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500">
                <option :value="true">显示</option>
                <option :value="false">隐藏</option>
              </select>
            </div>
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
