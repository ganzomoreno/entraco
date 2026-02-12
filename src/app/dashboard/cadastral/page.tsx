import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { CadastralList } from './cadastral-list'

export default async function CadastralPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: supplies } = await supabase
        .from('supplies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Dati Catastali</h1>
            </div>
            <p className="text-muted-foreground">
                Gestisci qui i dati catastali associati alle tue forniture.
            </p>

            <CadastralList supplies={supplies || []} />
        </div>
    )
}
