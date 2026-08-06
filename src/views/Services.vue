<script setup>
import { RouterLink } from 'vue-router'
import PageHeader from '../components/PageHeader.vue'
import Icon from '../components/Icon.vue'
import { services, serviceProcess } from '../data/site'
</script>

<template>
  <div>
    <PageHeader
      title="业务介绍"
      subtitle="覆盖餐饮品牌经营全链路的六大核心服务能力，从战略到执行，陪伴品牌完成数字化增长"
    />

    <section class="section !pt-4">
      <div class="container-site grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div
          v-for="(service, i) in services"
          :key="service.id"
          class="card p-8 md:p-10 reveal"
          :style="{ transitionDelay: `${(i % 2) * 80}ms` }"
        >
          <div class="flex items-start gap-5">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center shrink-0 shadow-lg shadow-primary-500/25">
              <Icon :name="service.icon" class="w-7 h-7" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-slate-900 mb-3">{{ service.title }}</h2>
              <p class="text-sm text-slate-500 leading-relaxed mb-5">{{ service.desc }}</p>
              <ul class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <li v-for="point in service.points" :key="point" class="flex items-center gap-2 text-sm text-slate-600">
                  <Icon name="check" class="w-4 h-4 text-primary-500 shrink-0" />
                  {{ point }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务交付流程 -->
    <section class="section bg-slate-50 border-y border-slate-100">
      <div class="container-site">
        <div class="text-center mb-14 reveal">
          <h2 class="section-title">数字化服务交付流程</h2>
          <p class="section-subtitle mx-auto">从培训赋能到复盘诊断，四步闭环保障数字化运营落地见效</p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(p, i) in serviceProcess" :key="p.step" class="relative card p-8 reveal" :style="{ transitionDelay: `${i * 80}ms` }">
            <div class="text-4xl font-bold text-accent-100 mb-3">{{ p.step }}</div>
            <h3 class="text-lg font-semibold text-slate-900 mb-2.5">{{ p.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ p.desc }}</p>
            <Icon
              v-if="i < serviceProcess.length - 1"
              name="arrowRight"
              class="hidden lg:block absolute top-1/2 -right-3.5 w-6 h-6 text-slate-300 -translate-y-1/2 z-10"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="pb-24 pt-24">
      <div class="container-site">
        <div class="rounded-2xl bg-gradient-to-br from-primary-700 to-primary-900 px-8 py-14 md:px-16 text-center reveal">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">不确定需要哪种服务？</h2>
          <p class="text-primary-100/80 mb-8 max-w-lg mx-auto">告诉我们您的品牌现状与目标，我们会为您定制最合适的运营组合方案</p>
          <RouterLink to="/contact" class="btn-primary !bg-white !text-primary-700 hover:!bg-primary-50">免费获取诊断建议</RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>
