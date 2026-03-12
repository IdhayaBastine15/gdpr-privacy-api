import { useEffect, useState } from 'react'
import { gdprApi } from '../services/api'
import { ExportData } from '../types'
import { Layout } from '../components/Layout'
import { PageSpinner, Spinner } from '../components/Spinner'
import { useToast } from '../components/Toast'
import { Download, Package, X } from 'lucide-react'

export default function Export() {
  const [preview, setPreview] = useState<ExportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [exporting, setExporting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    gdprApi.getMyData()
      .then(data => setPreview({ profile: data, consents: [], audit_logs: [], exported_at: new Date().toISOString() }))
      .catch(() => showToast('Failed to load preview', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleExport = async () => {
    setExporting(true)
    try {
      const data = await gdprApi.exportMyData()
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `gdpr-export-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Export downloaded successfully')
      setShowModal(false)
    } catch {
      showToast('Export failed. Please try again.', 'error')
    } finally {
      setExporting(false)
    }
  }

  if (loading) return <Layout><PageSpinner /></Layout>

  return (
    <Layout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Export My Data</h1>
            <span className="badge-green flex items-center gap-1"><Package size={10} /> Article 20</span>
          </div>
          <p className="text-slate-500 text-sm">Right to Data Portability — download everything we hold about you.</p>
        </div>

        <div className="card mb-6">
          <h2 className="text-base font-semibold text-slate-800 mb-4">What will be included</h2>
          <div className="space-y-3">
            {[
              { label: 'Personal Profile', desc: 'Name, email, phone, address, registration date' },
              { label: 'Consent History', desc: 'All consent decisions and timestamps' },
              { label: 'Full Audit Log', desc: 'Every action taken on your account' },
            ].map(item => (
              <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-slate-800">{item.label}</div>
                  <div className="text-xs text-slate-500">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-slate-800 mb-3">Download Format</h2>
          <p className="text-sm text-slate-500 mb-4">Your data will be exported as structured JSON — a machine-readable, portable format.</p>
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <Download size={16} /> Download My Data
          </button>
        </div>

        {/* Confirmation Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Confirm Export</h3>
                <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400" /></button>
              </div>
              <p className="text-sm text-slate-600 mb-6">
                Your full personal data bundle (profile, consents, audit logs) will be downloaded as a JSON file.
                An export event will be recorded in your audit log.
              </p>
              <div className="flex gap-3">
                <button onClick={handleExport} disabled={exporting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {exporting ? <><Spinner /> Exporting...</> : <><Download size={16} /> Confirm Download</>}
                </button>
                <button onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
