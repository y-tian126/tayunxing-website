<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../../api'

const router = useRouter()
const form = ref({ username: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  if (!form.value.username || !form.value.password) return
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await login(form.value)
    localStorage.setItem('cms_token', res.data.token)
    localStorage.setItem('cms_user', JSON.stringify({ username: res.data.username, displayName: res.data.displayName }))
    router.push('/admin/articles')
  } catch (e) {
    errorMsg.value = (e && e.message) || '登录失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-4">
          <img src="/logo.png" alt="踏云行" class="w-10 h-10 rounded-lg" />
          <span class="text-xl font-bold text-slate-900">踏云行</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-900">后台管理</h1>
        <p class="text-sm text-slate-500 mt-2">内容管理系统</p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">用户名</label>
            <input
              v-model="form.username"
              type="text"
              required
              placeholder="请输入用户名"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">密码</label>
            <input
              v-model="form.password"
              type="password"
              required
              placeholder="请输入密码"
              class="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition"
            />
          </div>

          <div v-if="errorMsg" class="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            <svg class="w-4 h-4 shrink-0 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
            </svg>
            <span>{{ errorMsg }}</span>
          </div>

          <button
            type="submit"
            class="btn-primary w-full !py-3"
            :disabled="loading"
            :class="loading ? 'opacity-60 cursor-not-allowed' : ''"
          >
            {{ loading ? '登录中…' : '登录' }}
          </button>
        </form>
      </div>

      <p class="text-center text-xs text-slate-400 mt-6">默认账号 admin / admin123</p>
    </div>
  </div>
</template>
