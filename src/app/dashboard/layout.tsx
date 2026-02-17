import { Sidebar } from '@/components/dashboard/sidebar'
import { BottomNav } from '@/components/dashboard/bottom-nav'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'


export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row md:bg-background pb-16 md:pb-0">
            {/* Desktop Sidebar */}
            <aside className="hidden h-screen w-64 flex-col border-r bg-sidebar md:flex fixed left-0 top-0 z-40 bg-white">
                <Sidebar className="h-full" userEmail={user.email} />
            </aside>

            {/* Main Content */}
            <div className="flex flex-col w-full md:pl-64">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden justify-center shadow-sm">
                    <Image src="/logo.png" alt="Entraco" width={120} height={40} priority className="h-8 w-auto" />
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>

            {/* Mobile Bottom Navigation */}
            <BottomNav />
        </div>
    )
}
