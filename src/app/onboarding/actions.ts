'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Utente non autenticato' }
    }

    const rawData = {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        fiscal_code: formData.get('fiscal_code') as string,
        phone: formData.get('phone') as string,
        consent_marketing: formData.get('consent_marketing') === 'on',
        consent_profiling: formData.get('consent_profiling') === 'on',
        consent_third_party: formData.get('consent_third_party') === 'on',
        terms_accepted_at: new Date().toISOString(), // User must have accepted mandatory TOS to submit
    }

    // Basic Validation
    if (!rawData.first_name || !rawData.last_name || !rawData.fiscal_code || !rawData.phone) {
        return { error: 'Compila tutti i campi obbligatori' }
    }

    const { error } = await supabase
        .from('profiles')
        .update(rawData)
        .eq('id', user.id)

    if (error) {
        console.error('Profile update error:', error)
        return { error: 'Errore durante il salvataggio dei dati. Riprova.' }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard') // Redirect to main dashboard after onboarding
}
