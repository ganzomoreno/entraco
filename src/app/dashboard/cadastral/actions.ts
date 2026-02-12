'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCadastralData(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Utente non autenticato' }

    const id = formData.get('id') as string
    const cadastral_section = formData.get('cadastral_section') as string
    const cadastral_sheet = formData.get('cadastral_sheet') as string
    const cadastral_parcel = formData.get('cadastral_parcel') as string
    const cadastral_subordinate = formData.get('cadastral_subordinate') as string
    const cadastral_type = formData.get('cadastral_type') as string
    const cadastral_category = formData.get('cadastral_category') as string

    if (!id) return { error: 'ID Fornitura mancante' }

    const { error } = await supabase
        .from('supplies')
        .update({
            cadastral_section,
            cadastral_sheet,
            cadastral_parcel,
            cadastral_subordinate,
            cadastral_type,
            cadastral_category,
            updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .eq('user_id', user.id)

    if (error) return { error: error.message }

    revalidatePath('/dashboard/cadastral')
    return { success: 'Dati catastali aggiornati!' }
}
