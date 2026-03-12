import { Consent, ConsentType } from '../types'

const CONSENT_META: Record<ConsentType, { label: string; description: string }> = {
  essential: { label: 'Essential', description: 'Required for the service to function. Cannot be disabled.' },
  analytics: { label: 'Analytics', description: 'Helps us understand how you use the app.' },
  marketing: { label: 'Marketing', description: 'Receive updates and promotional communications.' },
  third_party: { label: 'Third Party', description: 'Share data with trusted third-party services.' },
}

interface Props {
  consents: Consent[]
  onToggle: (type: ConsentType, granted: boolean) => void
  loading?: ConsentType | null
}

export function ConsentPanel({ consents, onToggle, loading }: Props) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-800 mb-1">Consent Settings</h2>
      <p className="text-sm text-slate-500 mb-4">Article 7 — Manage your data processing consents</p>
      <div className="space-y-4">
        {consents.map((consent) => {
          const meta = CONSENT_META[consent.consent_type]
          const isEssential = consent.consent_type === 'essential'
          const isLoading = loading === consent.consent_type
          return (
            <div key={consent.id} className="flex items-center justify-between gap-4 py-3 border-b border-slate-100 last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">{meta.label}</span>
                  {isEssential && <span className="badge-blue">Required</span>}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{meta.description}</p>
              </div>
              <button
                disabled={isEssential || isLoading}
                onClick={() => !isEssential && onToggle(consent.consent_type, !consent.granted)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed ${
                  consent.granted ? 'bg-green-500' : 'bg-slate-300'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                    consent.granted ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
