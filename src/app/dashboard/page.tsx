import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { KpiCards } from '@/components/dashboard/kpi-cards'
import { ConsumptionChart } from '@/components/dashboard/consumption-chart'
import { RecentInvoices } from '@/components/dashboard/recent-invoices'

export default async function DashboardPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    {/* Eventuali azioni globali, range date picker, download report */}
                </div>
            </div>

            <div className="space-y-4">
                <KpiCards />

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <ConsumptionChart />
                    <RecentInvoices />
                </div>
            </div>
        </div>
    )
}
