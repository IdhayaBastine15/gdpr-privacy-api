import { AuditLog, AuditAction } from '../types'

const ACTION_COLORS: Record<AuditAction, string> = {
  ACCESS: 'badge-blue',
  DELETE: 'badge-red',
  EXPORT: 'badge-green',
  RECTIFY: 'badge-slate',
  CONSENT_CHANGE: 'badge-slate',
  LOGIN: 'badge-blue',
  REGISTER: 'badge-green',
  ANONYMISE: 'badge-red',
}

interface Props {
  logs: AuditLog[]
  showUserId?: boolean
}

export function AuditTable({ logs, showUserId }: Props) {
  if (logs.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">
        No activity records found.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            {showUserId && <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wide">User ID</th>}
            <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Action</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Date & Time</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wide">IP Address</th>
            <th className="text-left py-3 px-4 text-xs font-medium text-slate-500 uppercase tracking-wide">Details</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {logs.map((log) => (
            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
              {showUserId && (
                <td className="py-3 px-4 font-mono text-xs text-slate-500">
                  {'user_id' in log ? String((log as any).user_id).slice(0, 8) + '...' : ''}
                </td>
              )}
              <td className="py-3 px-4">
                <span className={ACTION_COLORS[log.action]}>{log.action.replace('_', ' ')}</span>
              </td>
              <td className="py-3 px-4 text-slate-600">
                {new Date(log.timestamp).toLocaleString('en-GB')}
              </td>
              <td className="py-3 px-4 font-mono text-xs text-slate-500">{log.ip_address || '—'}</td>
              <td className="py-3 px-4 text-slate-600 max-w-xs truncate">{log.details || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
