import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signOut } from './actions'

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                        <p className="text-muted-foreground">Benvenuto, {profile?.first_name || user.email}!</p>
                    </div>
                    <form action={signOut}>
                        <Button variant="outline">Esci</Button>
                    </form>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Stato Utenze</CardTitle>
                            <CardDescription>Riepilogo delle tue forniture attive.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">0</p>
                            <p className="text-xs text-muted-foreground">Utenze attive</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ultime Fatture</CardTitle>
                            <CardDescription>Situazione pagamenti.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">€ 0,00</p>
                            <p className="text-xs text-muted-foreground">Da saldare</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
