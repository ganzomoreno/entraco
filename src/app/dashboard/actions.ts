'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
// ... existing code ...

export async function getKpiData() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return {
        suppliesCount: 0,
        unpaidInvoicesCount: 0,
        lastBillAmount: 0,
        elecConsumption: 0,
        gasConsumption: 0
    }

    // 1. Supplies Count
    const { count: suppliesCount } = await supabase
        .from('supplies')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // 2. Unpaid Invoices
    const { count: unpaidInvoicesCount } = await supabase
        .from('invoices')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('status', 'unpaid')

    // 3. Last Bill Amount (Latest Invoice)
    const { data: lastInvoice } = await supabase
        .from('invoices')
        .select('amount')
        .eq('user_id', user.id)
        .order('issue_date', { ascending: false })
        .limit(1)
        .single()

    // 4. Consumption (Latest Month for Elec and Gas)
    // We need to verify which is which. 
    // Simplified: Sum of all readings in the last 30 days? Or just the latest reading value?
    // Since our readings structure is 'f1'+'f2'+'f3' for a specific date (usually end of month).
    // Let's get the SUM of consumption for the current year? Or just the latest month?
    // "Consumo (Ultimo Mese)" is better.

    // Get latest readings
    const { data: readings } = await supabase
        .from('readings')
        .select(`
            f1, f2, f3,
            supply:supplies ( service_type )
        `)
        .eq('user_id', user.id)
        .order('reading_date', { ascending: false })
        .limit(2) // Assumes 1 per supply max per month, roughly

    let elecConsumption = 0
    let gasConsumption = 0

    if (readings) {
        readings.forEach((r: any) => {
            const total = (r.f1 || 0) + (r.f2 || 0) + (r.f3 || 0)
            if (r.supply?.service_type === 'gas') {
                gasConsumption += total
            } else {
                elecConsumption += total
            }
        })
    }

    return {
        suppliesCount: suppliesCount || 0,
        unpaidInvoicesCount: unpaidInvoicesCount || 0,
        lastBillAmount: lastInvoice?.amount || 0,
        elecConsumption,
        gasConsumption
    }
}
