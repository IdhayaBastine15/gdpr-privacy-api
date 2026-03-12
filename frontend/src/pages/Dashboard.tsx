import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gdprApi } from '../services/api'
import { UserData, Consent, ConsentType } from '../types'
import { Layout } from '../components/Layout'
import { DataCard } from '../components/DataCard'
import { ConsentPanel } from '../components/ConsentToggle'
import { PageSpinner } from '../components/Spinner'
import { useToast } from '../components/Toast'
import { Download, Trash2, Edit3 } from 'lucide-react'

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [consents, setConsents] = useState<Consent[]>([])
  const [loadingConsent, setLoadingConsent] = useState<ConsentType | null>(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([gdprApi.getMyData(), gdprApi.getConsents()])
      .then(([data, c]) => { setUserData(data); setConsents(c) })
      .catch(() => showToast('Failed to load dashboard data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleConsentToggle = async (type: ConsentType, granted: boolean) => {
    setLoadingConsent(type)
    try {
      const updated = await gdprApi.updateConsent(type, granted)
      setConsents(prev => prev.map(c => c.consent_type === type ? updated : c))
      showToast(`${type.replace('_', ' ')} consent ${granted ? 'granted' : 'revoked'}`)
    } catch (err: any) {
      showToast(err.response?.data?.detail || 'Failed to update consent', 'error')
    } finally {
      setLoadingConsent(null)
    }
  }

  if (loading) return <Layout><PageSpinner /></Layout>

  return (
    <Layout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800">My Data Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Everything we store about you, in one place.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {userData && <DataCard user={userData} />}
          <ConsentPanel consents={consents} onToggle={handleConsentToggle} loading={loadingConsent} />
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/export')} className="btn-primary flex items-center gap-2">
              <Download size={16} /> Export My Data
            </button>
            <button onClick={() => navigate('/edit')} className="btn-secondary flex items-center gap-2">
              <Edit3 size={16} /> Edit My Data
            </button>
            <button onClick={() => navigate('/delete')} className="btn-danger flex items-center gap-2">
              <Trash2 size={16} /> Delete My Account
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
