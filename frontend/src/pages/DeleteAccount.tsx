import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gdprApi } from '../services/api'
import { setApiToken } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Layout } from '../components/Layout'
import { Spinner } from '../components/Spinner'
import { useToast } from '../components/Toast'
import { AlertTriangle, Trash2, ChevronRight } from 'lucide-react'

type Step = 1 | 2 | 3

export default function DeleteAccount() {
  const [step, setStep] = useState<Step>(1)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await gdprApi.deleteMyData()
      showToast('Your account has been erased. Goodbye.')
      setApiToken(null)
      logout()
      navigate('/login')
    } catch {
      showToast('Deletion failed. Please try again.', 'error')
      setDeleting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Delete My Account</h1>
            <span className="badge-red flex items-center gap-1"><Trash2 size={10} /> Article 17</span>
          </div>
          <p className="text-slate-500 text-sm">Right to Erasure — permanently remove all your personal data.</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= s ? 'bg-red-600 text-white' : 'bg-slate-200 text-slate-500'}`}>{s}</div>
              {s < 3 && <ChevronRight size={16} className="text-slate-300" />}
            </div>
          ))}
          <span className="text-sm text-slate-500 ml-2">
            {step === 1 ? 'Review' : step === 2 ? 'Confirm' : 'Final Confirmation'}
          </span>
        </div>

        {step === 1 && (
          <div className="card">
            <div className="flex items-start gap-3 mb-5 p-4 bg-red-50 rounded-xl border border-red-200">
              <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <div className="text-sm font-semibold text-red-800">This action is irreversible</div>
                <div className="text-sm text-red-700 mt-0.5">Your account will be permanently anonymised and deactivated.</div>
              </div>
            </div>
            <h2 className="text-base font-semibold text-slate-800 mb-3">The following will happen:</h2>
            <ul className="space-y-2 mb-6">
              {[
                'Your name, phone, and address will be replaced with [REDACTED]',
                'Your email will be replaced with an anonymous identifier',
                'Your password will be invalidated',
                'All active consents will be revoked',
                'Your account will be permanently deactivated',
                'Audit log entries are retained for legal compliance',
              ].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-red-500 font-bold flex-shrink-0">×</span> {item}
                </li>
              ))}
            </ul>
            <button onClick={() => setStep(2)} className="btn-danger">I Understand — Continue</button>
          </div>
        )}

        {step === 2 && (
          <div className="card">
            <h2 className="text-base font-semibold text-slate-800 mb-2">Type DELETE to confirm</h2>
            <p className="text-sm text-slate-500 mb-4">This confirms you understand this action cannot be undone.</p>
            <input
              value={confirmText}
              onChange={e => setConfirmText(e.target.value)}
              placeholder="Type DELETE here"
              className="input mb-4 font-mono"
            />
            <div className="flex gap-3">
              <button
                disabled={confirmText !== 'DELETE'}
                onClick={() => setStep(3)}
                className="btn-danger disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to Final Step
              </button>
              <button onClick={() => setStep(1)} className="btn-secondary">Go Back</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="card">
            <div className="flex items-start gap-3 mb-5 p-4 bg-red-50 rounded-xl border border-red-200">
              <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
              <div className="text-sm font-semibold text-red-800">Last chance — are you absolutely sure?</div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Clicking the button below will immediately anonymise your account and log you out.
              This cannot be reversed.
            </p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={deleting} className="btn-danger flex items-center gap-2">
                {deleting ? <><Spinner /> Erasing account...</> : <><Trash2 size={16} /> Permanently Erase My Account</>}
              </button>
              <button onClick={() => { setStep(1); setConfirmText('') }} className="btn-secondary">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
