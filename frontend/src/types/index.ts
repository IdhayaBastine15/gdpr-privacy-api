export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string | null
  address: string | null
  is_admin: boolean
  is_active: boolean
}

export interface UserData extends User {
  created_at: string
  anonymised_at: string | null
}

export type ConsentType = 'essential' | 'analytics' | 'marketing' | 'third_party'

export interface Consent {
  id: string
  consent_type: ConsentType
  granted: boolean
  updated_at: string
  ip_address: string | null
}

export type AuditAction =
  | 'ACCESS'
  | 'DELETE'
  | 'EXPORT'
  | 'RECTIFY'
  | 'CONSENT_CHANGE'
  | 'LOGIN'
  | 'REGISTER'
  | 'ANONYMISE'

export interface AuditLog {
  id: string
  action: AuditAction
  timestamp: string
  ip_address: string | null
  details: string | null
}

export interface AdminAuditLog extends AuditLog {
  user_id: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface ExportData {
  profile: UserData
  consents: Consent[]
  audit_logs: AuditLog[]
  exported_at: string
}

export interface AdminStats {
  total_users: number
  active_users: number
  anonymised_users: number
  deletion_requests: number
  export_requests: number
  consent_withdrawals: number
  daily_requests: { date: string; count: number }[]
}

export interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  is_active: boolean
  is_admin: boolean
  created_at: string
  anonymised_at: string | null
}
