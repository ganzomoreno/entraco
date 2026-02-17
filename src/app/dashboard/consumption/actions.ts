'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getConsumptionData(supplyId: string, year: number) {
    const supabase = await createClient()

    // Get readings for the specific supply and year
    const startDate = `${year}-01-01`
    const endDate = `${year}-12-31`

    const { data: readings, error } = await supabase
        .from('readings')
        .select('*')
        .eq('supply_id', supplyId)
        .gte('reading_date', startDate)
        .lte('reading_date', endDate)
        .order('reading_date', { ascending: true })

    if (error) {
        console.error('Error fetching readings:', error)
        return { error: error.message }
    }

    // Calculate value_total for the frontend
    const readingsWithTotal = readings.map(r => ({
        id: r.id,
        reading_date: r.reading_date,
        value_f1: r.f1,
        value_f2: r.f2,
        value_f3: r.f3,
        value_total: (r.f1 || 0) + (r.f2 || 0) + (r.f3 || 0),
        is_estimated: r.source === 'estimated'
    }))

    return { readings: readingsWithTotal }
}

export async function getSupplies() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { data: supplies } = await supabase
        .from('supplies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

    return supplies || []
}

export async function submitReading(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Utente non autenticato' }

    const supplyId = formData.get('supplyId') as string
    const date = formData.get('date') as string
    const readingValue = Number(formData.get('readingValue'))

    if (!supplyId || !date || isNaN(readingValue)) {
        return { error: 'Dati mancanti o non validi' }
    }

    // Security Check: Verify supply belongs to user AND is GAS
    const { data: supply } = await supabase
        .from('supplies')
        .select('service_type')
        .eq('id', supplyId)
        .eq('user_id', user.id)
        .single()

    if (!supply) return { error: 'Fornitura non trovata' }
    if (supply.service_type !== 'gas') {
        return { error: 'L\'autolettura è disponibile solo per il GAS.' }
    }

    // Validation: Check if reading is lower than previous (simplified for now, ideally check DB)
    // For MVP we just insert. In real app, we should fetch last reading.

    // Calculate F1/F2/F3 split (For MVP, we assign all to F1 or split evenly? 
    // Let's simplified: User inserts TOTAL reading. We save it as F1 (or split it).
    // Better: Ask user for Total, and we just save it. 
    // Since table has F1/F2/F3, we might need to ask for all 3 or just save Total in F1 and 0 in others?
    // Let's assume for "Autolettura Semplicificata" user gives just one number (Total).
    // We will save it in F1 for now, or split 33/33/33. 
    // Let's put everything in F1 and mark source as 'manual'.

    // Check if reading exists for this date
    const { data: existing } = await supabase
        .from('readings')
        .select('id')
        .eq('supply_id', supplyId)
        .eq('reading_date', date)
        .single()

    if (existing) {
        return { error: 'Esiste già una lettura per questa data.' }
    }

    const { error } = await supabase
        .from('readings')
        .insert({
            supply_id: supplyId,
            user_id: user.id,
            reading_date: date,
            f1: readingValue, // Assigning total to F1 for simplicity in this MVP
            f2: 0,
            f3: 0,
            source: 'manual'
        })

    if (error) return { error: error.message }

    revalidatePath('/dashboard/consumption')
    return { success: 'Lettura inviata correttamente!' }
}
