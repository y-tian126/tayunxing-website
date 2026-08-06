<script setup>
import { ref } from 'vue'
import PageHeader from '../components/PageHeader.vue'
import Icon from '../components/Icon.vue'
import { siteConfig } from '../data/site'
import { submitConsultation } from '../api'

const form = ref({
  company: '',
  contactName: '',
  phone: '',
  email: '',
  message: '',
})

const submitted = ref(false)
const submitting = ref(false)
const errorMsg = ref('')

async function handleSubmit() {
  if (!form.value.contactName || !form.value.phone) return
  submitting.value = true
  errorMsg.value = ''
  try {
    await submitConsultation(form.value)
    submitted.value = true
  } catch (e) {
    errorMsg.value = (e && e.message) || '提交失败，请稍后重试或直接致电我们'
  } finally {
    submitting.value = false
  }
}

const contactCards = [
  { icon: 'phone', label: '联系电话', value: siteConfig.contact.phone },
  { icon: 'mail', label: '商务邮箱', value: siteConfig.contact.email },
  { icon: 'mapPin', label: '公司地址', value: siteConfig.contact.address },
]
</script>

<template>
  <div>
    <PageHeader
      title="联系我们"
      subtitle="留下您的信息，我们的运营专家将在 1 个工作日内与您联系"
    />

    <section class="section !pt-4">
      <div class="container-site grid grid-cols-1 lg:grid-cols-5 gap-12">
        <!-- 联系方式 -->
        <div class="lg:col-span-2 space-y-5">
          <div v-for="c in contactCards" :key="c.label" class="card p-7 flex items-center gap-5 reveal">
            <div class="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
              <Icon :name="c.icon" class="w-5 h-5" />
            </div>
            <div>
              <div class="text-sm text-slate-400 mb-1">{{ c.label }}</div>
              <div class="font-medium text-slate-900">{{ c.value }}</div>
            </div>
          </div>
          <div class="rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 p-8 reveal">
            <h3 class="text-white font-semibold mb-3">为什么选择我们</h3>
            <ul class="space-y-3">
              <li v-for="item in ['50+ 餐饮品牌服务经验', '数据驱动的运营方法论', '从战略到执行的全链路服务', '可量化的增长结果承诺']" :key="item" class="flex items-center gap-3 text-sm text-primary-100/90">
                <Icon name="check" class="w-4 h-4 text-primary-300 shrink-0" />
                {{ item }}
              </li>
            </ul>
          </div>
        </div>

        <!-- 咨询表单 -->
        <div class="lg:col-span-3">
          <div class="card p-8 md:p-10 reveal">
            <div v-if="submitted" class="text-center py-16">
              <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-6">
                <Icon name="check" class="w-8 h-8" />
              </div>
              <h3 class="text-xl font-bold text-slate-900 mb-3">提交成功</h3>
              <p class="text-slate-500">感谢您的信任，我们的运营专家将尽快与您联系</p>
            </div>

            <form v-else @submit.prevent="handleSubmit">
              <h3 class="text-xl font-bold text-slate-900 mb-8">合作咨询</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">公司名称</label>
                  <input
                    v-model="form.company"
                    type="text"
                    placeholder="您的品牌/公司名称"
                    class="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">联系人 <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.contactName"
                    type="text"
                    required
                    placeholder="您的姓名"
                    class="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">联系电话 <span class="text-red-500">*</span></label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    required
                    placeholder="便于我们联系您的电话"
                    class="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-2">邮箱</label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="选填"
                    class="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition"
                  />
                </div>
              </div>
              <div class="mb-8">
                <label class="block text-sm font-medium text-slate-700 mb-2">需求描述</label>
                <textarea
                  v-model="form.message"
                  rows="5"
                  placeholder="简单描述您的品牌现状与希望解决的问题，例如：茶饮品牌，300家门店，希望搭建会员体系…"
                  class="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition resize-none"
                ></textarea>
              </div>
              <div v-if="errorMsg" class="mb-5 flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                <svg class="w-4 h-4 shrink-0 mt-0.5 text-red-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                </svg>
                <span>{{ errorMsg }}</span>
              </div>
              <button
                type="submit"
                class="btn-primary w-full !py-4"
                :disabled="submitting"
                :class="submitting ? 'opacity-60 cursor-not-allowed' : ''"
              >
                {{ submitting ? '提交中…' : '提交咨询' }}
              </button>
              <p class="text-xs text-slate-400 text-center mt-4">提交即表示您同意我们就合作事宜与您取得联系</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
