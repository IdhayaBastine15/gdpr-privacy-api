import { UserData } from '../types'
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react'

export function DataCard({ user }: { user: UserData }) {
  const fields = [
    { icon: User, label: 'Full Name', value: `${user.first_name} ${user.last_name}` },
    { icon: Mail, label: 'Email', value: user.email },
    { icon: Phone, label: 'Phone', value: user.phone || '—' },
    { icon: MapPin, label: 'Address', value: user.address || '—' },
    { icon: Calendar, label: 'Registered', value: new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
  ]

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h2>
      <div className="space-y-4">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <div className="mt-0.5 p-2 bg-slate-100 rounded-lg">
              <Icon size={16} className="text-slate-500" />
            </div>
            <div>
              <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
              <div className="text-sm font-medium text-slate-800">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
