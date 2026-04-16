'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { createClient } from '@/lib/supabase/client'

const COUNTRIES = [
  { code: 'GA', label: '🇬🇦 Gabon' },
  { code: 'CM', label: '🇨🇲 Cameroun' },
  { code: 'CG', label: '🇨🇬 Congo' },
  { code: 'FR', label: '🇫🇷 France' },
  { code: 'OTHER', label: '🌍 Autre' },
]

export default function RegisterPage() {
  const t = useTranslations('auth')
  const tErr = useTranslations('errors')
  const locale = useLocale()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isVendorFlow = searchParams.get('vendor') === '1'

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    phone: '',
    country: '',
  })
  const [loading, setLoading] = useState(false)

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      toast.error(tErr('passwords_mismatch'))
      return
    }
    if (form.password.length < 8) {
      toast.error(tErr('password_too_short'))
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.fullName,
          country_code: form.country,
          phone: form.phone,
        },
      },
    })
    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Compte créé ! Vérifiez votre email.')
      if (isVendorFlow && form.country === 'GA') {
        router.push(`/${locale}/auth/vendor-onboarding`)
      } else {
        router.push(`/${locale}/client`)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <Link href={`/${locale}`} className="flex justify-center mb-4">
            <span className="text-2xl font-bold text-primary">Gabo</span>
            <span className="text-2xl font-bold">Shop</span>
          </Link>
          <CardTitle>{isVendorFlow ? t('vendor_onboarding') : t('register_title')}</CardTitle>
          <CardDescription>{t('has_account')}{' '}
            <Link href={`/${locale}/auth/login`} className="text-primary hover:underline">
              {t('login_btn')}
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label>{t('full_name')}</Label>
              <Input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>{t('email')}</Label>
              <Input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>{t('phone')}</Label>
              <Input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>{t('country')}</Label>
              <Select onValueChange={(v) => update('country', String(v ?? ''))}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t('password')}</Label>
              <Input type="password" value={form.password} onChange={(e) => update('password', e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label>{t('confirm_password')}</Label>
              <Input type="password" value={form.confirm} onChange={(e) => update('confirm', e.target.value)} required />
            </div>
            {isVendorFlow && form.country !== 'GA' && form.country && (
              <p className="text-sm text-destructive">{t('gabon_required')}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || (isVendorFlow && form.country !== 'GA' && !!form.country)}
            >
              {loading ? '...' : t('register_btn')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
