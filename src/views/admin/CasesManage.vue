<script setup>
import { ref, onMounted } from 'vue'
import { adminCases, createCase, updateCase, deleteCase } from '../../api'

const list = ref([])
const loading = ref(false)
const showModal = ref(false)
const editing = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return {
    title: '', brand: '', industry: 'tea', industryLabel: '茶饮',
    cover: '', image: '', summary: '', challenge: '', solution: '', result: '', testimonial: '',
    highlights: [], sortOrder: 0, status: 'draft',
  }
}

const industryOptions = [
  { value: 'tea', label: '茶饮' },
  { value: 'fastfood', label: '快餐' },
  { value: 'local', label: '地方菜' },
  { value: 'other', label: '其他' },
]

async function load() {
  loading.value = true
  try {
    const res = await adminCases()
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
    title: item.title, brand: item.brand || '', industry: item.industry,
    industryLabel: item.industryLabel || '', cover: item.cover || '', image: item.image || '',
    summary: item.summary || '', challenge: item.challenge || '', solution: item.solution || '',
    result: item.result || '', testimonial: item.testimonial || '',
    highlights: Array.isArray(item.highlights) ? JSON.parse(JSON.stringify(item.highlights)) : [],
    sortOrder: item.sortOrder || 0, status: item.status || 'draft',
  }
  showModal.value = true
}

function addHighlight() {
  form.value.highlights.push({ label: '', value: '' })
}

function removeHighlight(i) {
  form.value.highlights.splice(i, 1)
}

async function handleSave() {
  if (!form.value.title) return alert('标题必填')
  const payload = { ...form.value, highlights: form.value.highlights.filter((h) => h.label && h.value) }
  if (editing.value) {
    await updateCase(editing.value.id, payload)
  } else {
    await createCase(payload)
  }
  showModal.value = false
  load()
}

async function handleDelete(item) {
  if (!confirm(`确定删除案例《${item.title}》？`)) return
  await deleteCase(item.id)
  load()
}

async function toggleStatus(item) {
  const next = item.status === 'published' ? 'draft' : 'published'
  await updateCase(item.id, { ...item, status: next })
  load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">案例管理</h1>
        <p class="text-sm text-slate-500 mt-1">管理客户成功案例</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ 新建案例</button>
    </div>

    <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-slate-400">加载中…</div>
      <div v-else-if="list.length === 0" class="p-10 text-center text-slate-400">暂无案例</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th class="px-5 py-3 font-medium">案例标题</th>
            <th class="px-5 py-3 font-medium">品牌</th>
            <th class="px-5 py-3 font-medium">行业</th>
            <th class="px-5 py-3 font-medium">状态</th>
            <th class="px-5 py-3 font-medium">排序</th>
            <th class="px-5 py-3 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in list" :key="item.id" class="hover:bg-slate-50/60">
            <td class="px-5 py-4 font-medium text-slate-900 max-w-md truncate">{{ item.title }}</td>
            <td class="px-5 py-4 text-slate-500">{{ item.brand || '-' }}</td>
            <td class="px-5 py-4 text-slate-500">{{ item.industryLabel || item.industry }}</td>
            <td class="px-5 py-4">
              <button
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                :class="item.status === 'published' ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'"
                @click="toggleStatus(item)"
              >
                <span class="w-1.5 h-1.5 rounded-full" :class="item.status === 'published' ? 'bg-emerald-500' : 'bg-slate-400'"></span>
                {{ item.status === 'published' ? '已发布' : '草稿' }}
              </button>
            </td>
            <td class="px-5 py-4 text-slate-500">{{ item.sortOrder || 0 }}</td>
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
          <h3 class="text-lg font-semibold text-slate-900">{{ editing ? '编辑案例' : '新建案例' }}</h3>
          <button class="text-slate-400 hover:text-slate-600" @click="showModal = false">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">标题 *</label>
              <input v-model="form.title" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">品牌</label>
              <input v-model="form.brand" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
            </div>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">行业</label>
              <select v-model="form.industry" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500">
                <option v-for="o in industryOptions" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">行业标签</label>
              <input v-model="form.industryLabel" type="text" placeholder="茶饮" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">排序</label>
              <input v-model.number="form.sortOrder" type="number" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">状态</label>
            <select v-model="form.status" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500">
              <option value="draft">草稿</option>
              <option value="published">发布</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">摘要</label>
            <textarea v-model="form.summary" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none"></textarea>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">封面（CSS 背景）</label>
              <input v-model="form.cover" type="text" placeholder="linear-gradient(...)" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">案例图 URL</label>
              <input v-model="form.image" type="text" placeholder="/uploads/xxx.jpg" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">面临的挑战</label>
            <textarea v-model="form.challenge" rows="3" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">解决方案</label>
            <textarea v-model="form.solution" rows="3" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">项目成果</label>
            <textarea v-model="form.result" rows="3" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">客户证言</label>
            <textarea v-model="form.testimonial" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none"></textarea>
          </div>

          <!-- 数据亮点 -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-slate-700">数据亮点</label>
              <button class="text-xs text-primary-600 hover:text-primary-700" @click="addHighlight">+ 添加</button>
            </div>
            <div class="space-y-2">
              <div v-for="(h, i) in form.highlights" :key="i" class="flex items-center gap-2">
                <input v-model="h.label" type="text" placeholder="指标名（如：复购率）" class="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
                <input v-model="h.value" type="text" placeholder="数值（如：+45%）" class="w-32 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
                <button class="text-red-500 hover:text-red-600 text-sm px-2" @click="removeHighlight(i)">×</button>
              </div>
              <div v-if="form.highlights.length === 0" class="text-xs text-slate-400">暂无数据亮点</div>
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
