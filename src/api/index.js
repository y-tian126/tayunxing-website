import axios from 'axios'

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 15000,
})

// 请求拦截：附带 token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('cms_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 响应拦截：统一解包 + 401 处理
http.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('cms_token')
      if (location.pathname.startsWith('/admin') && location.pathname !== '/admin/login') {
        location.href = '/admin/login'
      }
    }
    return Promise.reject(err.response ? err.response.data : err)
  }
)

/* ===== 前台 ===== */
export const getStats = () => http.get('/stats')
export const getPartners = () => http.get('/partners')
export const getArticles = (params) => http.get('/articles', { params })
export const getArticle = (id) => http.get(`/articles/${id}`)
export const getCases = (params) => http.get('/cases', { params })
export const getCase = (id) => http.get(`/cases/${id}`)
export const getSolutions = () => http.get('/solutions')
export const submitConsultation = (data) => http.post('/consultations', data)

/* ===== 后台 ===== */
export const login = (data) => http.post('/admin/login', data)

export const adminArticles = () => http.get('/admin/articles')
export const createArticle = (data) => http.post('/admin/articles', data)
export const updateArticle = (id, data) => http.put(`/admin/articles/${id}`, data)
export const deleteArticle = (id) => http.delete(`/admin/articles/${id}`)

export const adminCases = () => http.get('/admin/cases')
export const createCase = (data) => http.post('/admin/cases', data)
export const updateCase = (id, data) => http.put(`/admin/cases/${id}`, data)
export const deleteCase = (id) => http.delete(`/admin/cases/${id}`)

export const adminPartners = () => http.get('/admin/partners')
export const createPartner = (data) => http.post('/admin/partners', data)
export const updatePartner = (id, data) => http.put(`/admin/partners/${id}`, data)
export const deletePartner = (id) => http.delete(`/admin/partners/${id}`)

export const adminStats = () => http.get('/admin/stats')
export const updateStats = (items) => http.put('/admin/stats', { items })

export const adminSolutions = () => http.get('/admin/solutions')
export const createSolution = (data) => http.post('/admin/solutions', data)
export const updateSolution = (id, data) => http.put(`/admin/solutions/${id}`, data)
export const deleteSolution = (id) => http.delete(`/admin/solutions/${id}`)

export const adminConsultations = () => http.get('/admin/consultations')
export const updateConsultationStatus = (id, status) => http.put(`/admin/consultations/${id}/status`, { status })
export const deleteConsultation = (id) => http.delete(`/admin/consultations/${id}`)

export const uploadImage = (file) => {
  const fd = new FormData()
  fd.append('file', file)
  return http.post('/admin/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
}

export default http
