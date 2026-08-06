<script setup>
import { ref, onMounted } from 'vue'
import { adminArticles, createArticle, updateArticle, deleteArticle } from '../../api'

const list = ref([])
const loading = ref(false)
const showModal = ref(false)
const editing = ref(null)
const form = ref(emptyForm())

function emptyForm() {
  return {
    title: '', summary: '', content: '', coverImage: '',
    category: 'company', status: 'draft', date: new Date().toISOString().slice(0, 10),
  }
}

async function load() {
  loading.value = true
  try {
    const res = await adminArticles()
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
    title: item.title, summary: item.summary || '', content: item.content || '',
    coverImage: item.coverImage || '', category: item.category,
    status: item.status, date: (item.date || '').slice(0, 10),
  }
  showModal.value = true
}

async function handleSave() {
  if (!form.value.title) return alert('标题必填')
  if (editing.value) {
    await updateArticle(editing.value.id, form.value)
  } else {
    await createArticle(form.value)
  }
  showModal.value = false
  load()
}

async function handleDelete(item) {
  if (!confirm(`确定删除《${item.title}》？`)) return
  await deleteArticle(item.id)
  load()
}

async function toggleStatus(item) {
  const next = item.status === 'published' ? 'draft' : 'published'
  await updateArticle(item.id, { ...item, status: next })
  load()
}

onMounted(load)
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">文章管理</h1>
        <p class="text-sm text-slate-500 mt-1">管理公司动态、行业洞察与活动回顾</p>
      </div>
      <button class="btn-primary" @click="openCreate">+ 新建文章</button>
    </div>

    <div class="bg-white rounded-xl border border-slate-100 overflow-hidden">
      <div v-if="loading" class="p-10 text-center text-slate-400">加载中…</div>
      <div v-else-if="list.length === 0" class="p-10 text-center text-slate-400">暂无文章，点击右上角新建</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-slate-50 text-slate-500 text-left">
          <tr>
            <th class="px-5 py-3 font-medium">标题</th>
            <th class="px-5 py-3 font-medium">分类</th>
            <th class="px-5 py-3 font-medium">状态</th>
            <th class="px-5 py-3 font-medium">日期</th>
            <th class="px-5 py-3 font-medium">阅读</th>
            <th class="px-5 py-3 font-medium text-right">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in list" :key="item.id" class="hover:bg-slate-50/60">
            <td class="px-5 py-4 font-medium text-slate-900 max-w-md truncate">{{ item.title }}</td>
            <td class="px-5 py-4 text-slate-500">{{ item.categoryLabel }}</td>
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
            <td class="px-5 py-4 text-slate-500">{{ (item.date || '').slice(0, 10) }}</td>
            <td class="px-5 py-4 text-slate-500">{{ item.viewCount || 0 }}</td>
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
          <h3 class="text-lg font-semibold text-slate-900">{{ editing ? '编辑文章' : '新建文章' }}</h3>
          <button class="text-slate-400 hover:text-slate-600" @click="showModal = false">×</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">标题 *</label>
            <input v-model="form.title" type="text" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">分类</label>
              <select v-model="form.category" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500">
                <option value="company">公司动态</option>
                <option value="insight">行业洞察</option>
                <option value="event">活动回顾</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">状态</label>
              <select v-model="form.status" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500">
                <option value="draft">草稿</option>
                <option value="published">发布</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">日期</label>
              <input v-model="form.date" type="date" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">摘要</label>
            <textarea v-model="form.summary" rows="2" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">封面图 URL</label>
            <input v-model="form.coverImage" type="text" placeholder="/uploads/xxx.jpg" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1.5">正文（支持 HTML）</label>
            <textarea v-model="form.content" rows="10" class="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 resize-none"></textarea>
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
