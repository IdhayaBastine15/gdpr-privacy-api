import { useEffect, useState } from 'react'
import { adminApi } from '../services/api'
import { AdminStats, PaginatedResponse, AdminAuditLog } from '../types'
import { Layout } from '../components/Layout'
import { AuditTable } from '../components/AuditTable'
import { PageSpinner } from '../components/Spinner'
import { useToast } from '../components/Toast'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, Trash2, Download, ToggleLeft } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [logs, setLogs] = useState<PaginatedResponse<AdminAuditLog> | null>(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    Promise.all([adminApi.getStats(), adminApi.getAllAuditLogs({ page_size: 20 })])
      .then(([s, l]) => { setStats(s); setLogs(l) })
      .catch(() => showToast('Failed to load admin data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Layout><PageSpinner /></Layout>

  const statCards = [
    { label: 'Total Users', value: stats?.total_users ?? 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Deletion Requests', value: stats?.deletion_requests ?? 0, icon: Trash2, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Data Exports', value: stats?.export_requests ?? 0, icon: Download, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Consent Withdrawals', value: stats?.consent_withdrawals ?? 0, icon: ToggleLeft, color: 'text-orange-600', bg: 'bg-orange-50' },
  ]

  return (
    <Layout>
      <div className="max-w-6xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">GDPR request monitoring across all users.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map(({ label, value, icon: Icon, color, bg }) => (
            <div key={label} className="card">
              <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
                <Icon size={20} className={color} />
              </div>
              <div className="text-2xl font-bold text-slate-800">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {stats && stats.daily_requests.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">GDPR Requests — Last 30 Days</h2>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.daily_requests} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                <Line type="monotone" dataKey="count" name="Requests" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Audit log */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800">Recent Audit Activity</h2>
            <span className="text-xs text-slate-500">{logs?.total ?? 0} total events</span>
          </div>
          <AuditTable logs={logs?.items ?? []} showUserId />
        </div>
      </div>
    </Layout>
  )
}
