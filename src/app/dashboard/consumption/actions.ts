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

    return { readings }
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
