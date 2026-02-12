import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileForm } from './profile-form'
import { SuppliesList } from './supplies-list'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

export default async function ProfilePage() {
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

    // Fetch supplies
    const { data: supplies } = await supabase
        .from('supplies')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Profilo Utente</h1>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>I tuoi dati personali</CardTitle>
                        <CardDescription>
                            Visualizza e aggiorna le informazioni del tuo account e il tuo Codice Cliente.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProfileForm user={user} profile={profile} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Le tue Forniture</CardTitle>
                        <CardDescription>
                            Gestisci i tuoi POD/PDR per Luce e Gas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <SuppliesList supplies={supplies || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
