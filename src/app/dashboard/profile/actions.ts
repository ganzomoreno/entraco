'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Utente non autenticato' }
    }

    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const phone = formData.get('phone') as string
    const fiscal_code = formData.get('fiscal_code') as string
    const customer_code = formData.get('customer_code') as string

    if (!first_name || !last_name) {
        return { error: 'Nome e Cognome sono obbligatori' }
    }

    const { error } = await supabase
        .from('profiles')
        .upsert({
            id: user.id,
            first_name,
            last_name,
            phone,
            fiscal_code,
            customer_code,
            updated_at: new Date().toISOString(),
        })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/profile')
    return { success: 'Profilo aggiornato correttamente!' }
}

export async function addSupply(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Utente non autenticato' }

    const pod = formData.get('pod') as string
    const nickname = formData.get('nickname') as string
    const service_type = formData.get('service_type') as string
    const address = formData.get('address') as string

    if (!pod) return { error: 'Il POD/PDR è obbligatorio' }

    const { error } = await supabase
        .from('supplies')
        .insert({
            user_id: user.id,
            pod,
            nickname,
            service_type,
            address
        })

    if (error) return { error: error.message }

    revalidatePath('/dashboard/profile')
    return { success: 'Fornitura aggiunta!' }
}

export async function deleteSupply(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Utente non autenticato' }

    const { error } = await supabase
        .from('supplies')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/profile')
    return { success: 'Fornitura rimossa!' }
}
