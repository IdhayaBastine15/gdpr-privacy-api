import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AuditLog } from '../types'

interface Props {
  logs: AuditLog[]
}

export function ActivityChart({ logs }: Props) {
  // Group by date
  const counts: Record<string, number> = {}
  logs.forEach(log => {
    const date = new Date(log.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    counts[date] = (counts[date] || 0) + 1
  })
  const data = Object.entries(counts)
    .slice(-14)
    .map(([date, count]) => ({ date, count }))

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-48 text-slate-400 text-sm">No activity data to chart.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <Tooltip
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
        />
        <Bar dataKey="count" name="Events" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
