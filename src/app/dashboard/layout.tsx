import { Sidebar, MobileNav } from '@/components/dashboard/sidebar'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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
        <div className="flex min-h-screen w-full flex-col bg-muted/40 md:flex-row md:bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 flex-col border-r bg-sidebar md:flex">
                <Sidebar className="h-full" userEmail={user.email} />
            </aside>

            {/* Mobile & Main Content */}
            <div className="flex flex-col w-full">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden">
                    <MobileNav />
                    <div className="flex-1">
                        <span className="font-semibold">Entraco</span>
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
