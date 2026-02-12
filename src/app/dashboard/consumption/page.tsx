import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getSupplies } from './actions'
import { ConsumptionClient } from './consumption-client'

export default async function ConsumptionPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch supplies server-side to pass to client component
    const supplies = await getSupplies()

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Consumi</h1>
            </div>
            <p className="text-muted-foreground">
                Analizza i tuoi consumi energetici e scarica i report.
            </p>

            <ConsumptionClient supplies={supplies} />
        </div>
    )
}
