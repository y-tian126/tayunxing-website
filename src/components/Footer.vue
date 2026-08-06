<script setup>
import { RouterLink } from 'vue-router'
import { siteConfig } from '../data/site'

const quickLinks = [
  { path: '/services', label: '业务介绍' },
  { path: '/solutions', label: '解决方案' },
  { path: '/cases', label: '案例中心' },
  { path: '/about', label: '关于我们' },
  { path: '/news', label: '新闻动态' },
  { path: '/contact', label: '合作咨询' },
]
</script>

<template>
  <footer class="bg-slate-900 text-slate-400">
    <div class="container-site py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- 品牌 -->
      <div class="md:col-span-2">
        <div class="flex items-center gap-2.5 mb-4">
          <img src="/logo.png" alt="踏云行" class="h-10 w-auto object-contain" />
        </div>
        <p class="text-sm leading-relaxed max-w-md">{{ siteConfig.subSlogan }}</p>
      </div>

      <!-- 快捷链接 -->
      <div>
        <h4 class="text-white font-semibold mb-4 text-sm">快捷导航</h4>
        <ul class="space-y-2.5">
          <li v-for="link in quickLinks" :key="link.path">
            <RouterLink :to="link.path" class="text-sm hover:text-primary-400 transition-colors">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </div>

      <!-- 联系方式 -->
      <div>
        <h4 class="text-white font-semibold mb-4 text-sm">联系我们</h4>
        <ul class="space-y-2.5 text-sm">
          <li>电话：{{ siteConfig.contact.phone }}</li>
          <li>邮箱：{{ siteConfig.contact.email }}</li>
          <li>地址：{{ siteConfig.contact.address }}</li>
        </ul>
      </div>
    </div>

    <div class="border-t border-slate-800">
      <div class="container-site py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <span>© 2026 {{ siteConfig.fullName }} 版权所有</span>
        <span>{{ siteConfig.icp }}</span>
      </div>
    </div>
  </footer>
</template>
