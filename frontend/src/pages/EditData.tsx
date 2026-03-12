import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { gdprApi } from '../services/api'
import { UserData } from '../types'
import { Layout } from '../components/Layout'
import { PageSpinner, Spinner } from '../components/Spinner'
import { useToast } from '../components/Toast'
import { FileEdit, Lock } from 'lucide-react'

const schema = z.object({
  first_name: z.string().min(1, 'Required'),
  last_name: z.string().min(1, 'Required'),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function EditData() {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    gdprApi.getMyData()
      .then(data => { setUserData(data); reset({ first_name: data.first_name, last_name: data.last_name, phone: data.phone || '', address: data.address || '' }) })
      .catch(() => showToast('Failed to load data', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const onSubmit = async (data: FormData) => {
    try {
      const updated = await gdprApi.updateMyData(data)
      setUserData(updated)
      reset({ first_name: updated.first_name, last_name: updated.last_name, phone: updated.phone || '', address: updated.address || '' })
      showToast('Your data has been updated successfully')
    } catch {
      showToast('Failed to save changes', 'error')
    }
  }

  if (loading) return <Layout><PageSpinner /></Layout>

  return (
    <Layout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Edit My Data</h1>
            <span className="badge-blue flex items-center gap-1"><FileEdit size={10} /> Article 16</span>
          </div>
          <p className="text-slate-500 text-sm">Right to Rectification — correct any inaccurate personal data.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">First name</label>
                <input {...register('first_name')} className="input" />
                {errors.first_name && <p className="mt-1 text-xs text-red-600">{errors.first_name.message}</p>}
              </div>
              <div>
                <label className="label">Last name</label>
                <input {...register('last_name')} className="input" />
                {errors.last_name && <p className="mt-1 text-xs text-red-600">{errors.last_name.message}</p>}
              </div>
            </div>
            <div>
              <label className="label flex items-center gap-2">
                Email address
                <span className="inline-flex items-center gap-1 text-xs text-slate-400 font-normal"><Lock size={10} /> Read-only</span>
              </label>
              <input value={userData?.email} disabled className="input bg-slate-50 text-slate-500 cursor-not-allowed" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input {...register('phone')} type="tel" placeholder="+44 7700 900000" className="input" />
            </div>
            <div>
              <label className="label">Address</label>
              <textarea {...register('address')} rows={3} placeholder="123 Example Street..." className="input resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={isSubmitting || !isDirty} className="btn-primary flex items-center gap-2">
                {isSubmitting ? <><Spinner /> Saving...</> : 'Save Changes'}
              </button>
              <button type="button" onClick={() => reset()} disabled={!isDirty} className="btn-secondary">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
