import axios from 'axios'
import {
  User, UserData, Consent, ConsentType, AuditLog, AdminAuditLog,
  PaginatedResponse, ExportData, AdminStats, AdminUser, AuditAction
} from '../types'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// Token injected from outside (set by auth context)
let _token: string | null = null
export const setApiToken = (token: string | null) => { _token = token }

api.interceptors.request.use((config) => {
  if (_token) config.headers.Authorization = `Bearer ${_token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      _token = null
      window.dispatchEvent(new CustomEvent('gdpr:logout'))
    }
    return Promise.reject(err)
  }
)

// Auth
export const authApi = {
  register: (data: { email: string; password: string; first_name: string; last_name: string; phone?: string; address?: string }) =>
    api.post<{ access_token: string; token_type: string }>('/auth/register', data).then(r => r.data),

  login: (email: string, password: string) =>
    api.post<{ access_token: string; token_type: string }>('/auth/login', { email, password }).then(r => r.data),

  me: () => api.get<User>('/auth/me').then(r => r.data),
}

// GDPR
export const gdprApi = {
  getMyData: () => api.get<UserData>('/me/data').then(r => r.data),
  updateMyData: (data: { first_name?: string; last_name?: string; phone?: string; address?: string }) =>
    api.put<UserData>('/me/data', data).then(r => r.data),
  deleteMyData: () => api.delete<{ message: string }>('/me/data').then(r => r.data),

  exportMyData: () => api.get<ExportData>('/me/export').then(r => r.data),

  getConsents: () => api.get<Consent[]>('/me/consents').then(r => r.data),
  updateConsent: (consent_type: ConsentType, granted: boolean) =>
    api.put<Consent>('/me/consents', { consent_type, granted }).then(r => r.data),

  getAuditLogs: (params?: { action?: AuditAction; page?: number; page_size?: number }) =>
    api.get<PaginatedResponse<AuditLog>>('/me/audit-logs', { params }).then(r => r.data),
}

// Admin
export const adminApi = {
  getUsers: (params?: { page?: number; page_size?: number }) =>
    api.get<PaginatedResponse<AdminUser>>('/admin/users', { params }).then(r => r.data),

  getAllAuditLogs: (params?: { action?: AuditAction; user_id?: string; page?: number; page_size?: number }) =>
    api.get<PaginatedResponse<AdminAuditLog>>('/admin/audit-logs', { params }).then(r => r.data),

  getStats: () => api.get<AdminStats>('/admin/stats').then(r => r.data),
}

export default api
