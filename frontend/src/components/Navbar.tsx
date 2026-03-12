import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { setApiToken } from '../services/api'
import {
  LayoutDashboard, Activity, Edit3, Download, Trash2,
  Shield, LogOut, ShieldCheck
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/my-activity', label: 'My Activity', icon: Activity },
  { to: '/edit', label: 'Edit Data', icon: Edit3 },
  { to: '/export', label: 'Export Data', icon: Download },
  { to: '/delete', label: 'Delete Account', icon: Trash2, danger: true },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setApiToken(null)
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-navy-900 flex flex-col z-10">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-navy-700">
        <ShieldCheck className="text-blue-400" size={28} />
        <div>
          <div className="text-white font-bold text-sm">GDPR Privacy</div>
          <div className="text-slate-400 text-xs">Manager</div>
        </div>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-navy-700">
        <div className="text-slate-400 text-xs uppercase tracking-wider mb-1">Signed in as</div>
        <div className="text-white text-sm font-medium truncate">{user?.first_name} {user?.last_name}</div>
        <div className="text-slate-400 text-xs truncate">{user?.email}</div>
        {user?.is_admin && (
          <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-600 text-white">
            <Shield size={10} /> Admin
          </span>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon, danger }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? danger
                    ? 'bg-red-600/20 text-red-400'
                    : 'bg-blue-600/20 text-blue-400'
                  : danger
                  ? 'text-red-400/70 hover:bg-red-600/10 hover:text-red-400'
                  : 'text-slate-400 hover:bg-navy-700 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {user?.is_admin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-purple-600/20 text-purple-400' : 'text-slate-400 hover:bg-navy-700 hover:text-white'
              }`
            }
          >
            <Shield size={18} />
            Admin Panel
          </NavLink>
        )}
      </nav>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-navy-700 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
