'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import {
    LayoutDashboard,
    User,
    Map,
    FileText,
    BarChart3,
    Globe,
    LogOut,
    Menu
} from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut } from '@/app/dashboard/actions'

const navItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Anagrafiche', href: '/dashboard/profile', icon: User },
    { name: 'Dati Catastali', href: '/dashboard/cadastral', icon: Map },
    { name: 'Fatture', href: '/dashboard/invoices', icon: FileText },
    { name: 'Consumi', href: '/dashboard/consumption', icon: BarChart3 },
]

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    userEmail?: string
}

export function Sidebar({ className, userEmail }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className={cn("pb-12 h-screen border-r bg-white text-gray-900", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="mb-6 px-4 flex items-center gap-2 py-2">
                        <Image src="/logo.png" alt="Entraco" width={150} height={55} priority className="h-10 w-auto" />
                    </div>
                    <div className="space-y-1">
                        {navItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? 'secondary' : 'ghost'}
                                className={cn(
                                    "w-full justify-start transition-all duration-200",
                                    pathname === item.href
                                        ? "bg-primary/10 text-primary font-medium border-r-4 border-primary rounded-none rounded-r-md"
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                                )}
                                asChild
                            >
                                <Link
                                    href={item.href}
                                >
                                    <item.icon className={cn("mr-2 h-4 w-4", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                                    {item.name}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="px-3 py-2 mt-auto">
                    <div className="flex items-center gap-3 px-4 py-2 mb-4">
                        <Avatar>
                            <AvatarFallback>{userEmail?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                            <p className="font-medium">Utente</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[120px]">{userEmail}</p>
                        </div>
                    </div>
                    <form action={signOut}>
                        <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                            <LogOut className="mr-2 h-4 w-4" />
                            Esci
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export function MobileNav() {
    const pathname = usePathname()
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
                <SheetHeader className="p-4 text-left">
                    <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
                        <div className="flex items-center gap-2 bg-white/95 py-1 px-2 rounded-md w-fit">
                            <Image src="/logo.png" alt="Entraco" width={120} height={40} priority className="h-6 w-auto" />
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <div className="py-4">
                    <div className="space-y-1 px-3">
                        {navItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? 'secondary' : 'ghost'}
                                className="w-full justify-start"
                                asChild
                            >
                                <Link
                                    href={item.href}
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.name}
                                </Link>
                            </Button>
                        ))}
                        <Separator className="my-4" />
                        <form action={signOut}>
                            <Button variant="ghost" className="w-full justify-start text-red-500">
                                <LogOut className="mr-2 h-4 w-4" />
                                <span className="ml-2">Esci</span>
                            </Button>
                        </form>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
