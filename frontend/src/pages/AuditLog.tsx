import { useEffect, useState } from 'react'
import { gdprApi } from '../services/api'
import { AuditLog as AuditLogType, AuditAction, PaginatedResponse } from '../types'
import { Layout } from '../components/Layout'
import { AuditTable } from '../components/AuditTable'
import { ActivityChart } from '../components/ActivityChart'
import { PageSpinner } from '../components/Spinner'
import { useToast } from '../components/Toast'

const ACTIONS: (AuditAction | '')[] = ['', 'ACCESS', 'RECTIFY', 'EXPORT', 'ANONYMISE', 'CONSENT_CHANGE', 'LOGIN', 'REGISTER']

export default function AuditLog() {
  const [data, setData] = useState<PaginatedResponse<AuditLogType> | null>(null)
  const [allLogs, setAllLogs] = useState<AuditLogType[]>([])
  const [action, setAction] = useState<AuditAction | ''>('')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const load = async (a: AuditAction | '', p: number) => {
    setLoading(true)
    try {
      const result = await gdprApi.getAuditLogs({ action: a || undefined, page: p, page_size: 15 })
      setData(result)
      if (p === 1 && !a) setAllLogs(result.items)
    } catch {
      showToast('Failed to load activity log', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load(action, page) }, [action, page])

  return (
    <Layout>
      <div className="max-w-5xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">My Activity</h1>
          <p className="text-slate-500 text-sm mt-1">A complete audit trail of all actions taken on your data.</p>
        </div>

        {allLogs.length > 0 && (
          <div className="card mb-6">
            <h2 className="text-base font-semibold text-slate-800 mb-4">Activity Over Time</h2>
            <ActivityChart logs={allLogs} />
          </div>
        )}

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-800">Event Log</h2>
            <select
              value={action}
              onChange={e => { setAction(e.target.value as AuditAction | ''); setPage(1) }}
              className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ACTIONS.map(a => <option key={a} value={a}>{a || 'All Actions'}</option>)}
            </select>
          </div>

          {loading ? <PageSpinner /> : <AuditTable logs={data?.items || []} />}

          {data && data.pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <span className="text-sm text-slate-500">{data.total} total events</span>
              <div className="flex gap-2">
                <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn-secondary text-xs py-1 px-3 disabled:opacity-40">Prev</button>
                <span className="text-sm text-slate-600 py-1 px-2">Page {page} of {data.pages}</span>
                <button disabled={page === data.pages} onClick={() => setPage(p => p + 1)} className="btn-secondary text-xs py-1 px-3 disabled:opacity-40">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
