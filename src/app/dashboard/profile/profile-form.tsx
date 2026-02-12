'use client'

import { updateProfile } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { useState } from 'react'
import { User } from '@supabase/supabase-js'

interface ProfileFormProps {
    user: User
    profile: any
}

export function ProfileForm({ user, profile }: ProfileFormProps) {
    const [loading, setLoading] = useState(false)

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            const result = await updateProfile(formData)
            if (result.error) {
                toast.error(result.error)
            } else if (result.success) {
                toast.success(result.success)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="first_name">Nome</Label>
                    <Input id="first_name" name="first_name" defaultValue={profile?.first_name || ''} required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="last_name">Cognome</Label>
                    <Input id="last_name" name="last_name" defaultValue={profile?.last_name || ''} required />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email (Non modificabile)</Label>
                <Input id="email" value={user.email || ''} disabled type="email" className="bg-muted" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="customer_code">Codice Cliente</Label>
                <Input id="customer_code" name="customer_code" defaultValue={profile?.customer_code || ''} placeholder="Es. 123456789" />
                <p className="text-xs text-muted-foreground">Lo trovi sulla tua bolletta, in alto a destra.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="fiscal_code">Codice Fiscale</Label>
                    <Input id="fiscal_code" name="fiscal_code" defaultValue={profile?.fiscal_code || ''} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Telefono</Label>
                    <Input id="phone" name="phone" defaultValue={profile?.phone || ''} type="tel" />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                    {loading ? 'Salvataggio...' : 'Salva Modifiche'}
                </Button>
            </div>
        </form>
    )
}
