'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, BarChart3, Menu, User, Map } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
    { name: 'Home', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Fatture', href: '/dashboard/invoices', icon: FileText },
    { name: 'Consumi', href: '/dashboard/consumption', icon: BarChart3 },
    { name: 'Profilo', href: '/dashboard/profile', icon: User },
]

export function BottomNav() {
    const pathname = usePathname()

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white px-6 py-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] md:hidden">
            <nav className="flex items-center justify-between">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[64px]",
                            pathname === item.href
                                ? "text-primary font-medium"
                                : "text-gray-500 hover:text-primary hover:bg-gray-50"
                        )}
                    >
                        <item.icon className={cn("h-6 w-6", pathname === item.href ? "fill-current/20" : "")} />
                        <span className="text-[10px]">{item.name}</span>
                    </Link>
                ))}
                {/* Menu is for sidebar sheets if needed, but for now specific links are better */}
            </nav>
        </div>
    )
}
