import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('../views/Home.vue'), meta: { title: '首页' } },
  { path: '/services', name: 'Services', component: () => import('../views/Services.vue'), meta: { title: '业务介绍' } },
  { path: '/solutions', name: 'Solutions', component: () => import('../views/Solutions.vue'), meta: { title: '解决方案' } },
  { path: '/cases', name: 'Cases', component: () => import('../views/Cases.vue'), meta: { title: '案例中心' } },
  { path: '/cases/:id', name: 'CaseDetail', component: () => import('../views/CaseDetail.vue'), meta: { title: '案例详情' } },
  { path: '/about', name: 'About', component: () => import('../views/About.vue'), meta: { title: '关于我们' } },
  { path: '/news', name: 'News', component: () => import('../views/News.vue'), meta: { title: '新闻动态' } },
  { path: '/news/:id', name: 'NewsDetail', component: () => import('../views/NewsDetail.vue'), meta: { title: '文章详情' } },
  { path: '/contact', name: 'Contact', component: () => import('../views/Contact.vue'), meta: { title: '联系我们' } },

  // 后台
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../views/admin/AdminLogin.vue'),
    meta: { title: '管理员登录', guest: true },
  },
  {
    path: '/admin',
    component: () => import('../views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/admin/articles' },
      { path: 'articles', name: 'AdminArticles', component: () => import('../views/admin/ArticlesManage.vue'), meta: { title: '文章管理' } },
      { path: 'cases', name: 'AdminCases', component: () => import('../views/admin/CasesManage.vue'), meta: { title: '案例管理' } },
      { path: 'solutions', name: 'AdminSolutions', component: () => import('../views/admin/SolutionsManage.vue'), meta: { title: '解决方案' } },
      { path: 'partners', name: 'AdminPartners', component: () => import('../views/admin/PartnersManage.vue'), meta: { title: '合作品牌' } },
      { path: 'stats', name: 'AdminStats', component: () => import('../views/admin/StatsManage.vue'), meta: { title: '数据亮点' } },
      { path: 'consultations', name: 'AdminConsultations', component: () => import('../views/admin/ConsultationsManage.vue'), meta: { title: '咨询管理' } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const token = localStorage.getItem('cms_token')
  if (to.matched.some((r) => r.meta.requiresAuth) && !token) {
    return { name: 'AdminLogin', query: { redirect: to.fullPath } }
  }
  if (to.matched.some((r) => r.meta.guest) && token && to.name === 'AdminLogin') {
    return { name: 'AdminArticles' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 踏云行` : '踏云行 - 餐饮数字化运营服务商'
})

export default router
