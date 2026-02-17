'use client'

import { loginWithOtp, loginWithPassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handlePasswordLogin(formData: FormData) {
        setLoading(true)
        try {
            const result = await loginWithPassword(formData)
            if (result?.error) {
                toast.error(result.error)
            }
            // If redirect happens in action, it will handle navigation
        } catch (e) {
            // Redirect throws an error, which is expected behavior in Next.js
            // We generally let it bubble up, but specific error handling might be needed depending on Next.js version
            // However, separating potential network errors from redirect is good.
            // But simple await usually works fine with redirect.
        } finally {
            setLoading(false)
        }
    }

    async function handleOtpLogin(formData: FormData) {
        setLoading(true)
        try {
            const result = await loginWithOtp(formData)
            if (result?.error) {
                toast.error(result.error)
            } else if (result?.success) {
                toast.success(result.success)
            }
        } finally {
            setLoading(false)
        }
    }


    return (
        <div className="min-h-screen w-full lg:grid lg:grid-cols-2">
            {/* Left Column: Branding (Hidden on mobile) */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-gradient-start to-gradient-end text-white p-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/5" /> {/* Subtle overlay */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                    <Image
                        src="/logo.png"
                        alt="Entraco Logo"
                        width={300}
                        height={100}
                        priority
                        className="h-auto w-auto brightness-0 invert"
                    />
                    <div className="space-y-2 max-w-md">
                        <h1 className="text-4xl font-bold tracking-tight">L'Energia su misura per te</h1>
                        <p className="text-lg text-white/90">
                            Accedi alla tua area riservata per gestire forniture, bollette e autoletture in semplicità.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Login Form */}
            <div className="flex items-center justify-center bg-background p-8">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex flex-col space-y-2 text-center lg:text-left">
                        {/* Mobile Logo */}
                        <div className="lg:hidden mx-auto mb-4">
                            <Image src="/logo.png" alt="Entraco Logo" width={180} height={60} className="h-auto w-auto" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Bentornato</h2>
                        <p className="text-muted-foreground">
                            Inserisci le tue credenziali per accedere.
                        </p>
                    </div>

                    <Tabs defaultValue="password" classname="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="password">Password</TabsTrigger>
                            <TabsTrigger value="otp">Codice Rapido</TabsTrigger>
                        </TabsList>

                        <TabsContent value="password">
                            <form action={handlePasswordLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-pass">Email</Label>
                                    <Input id="email-pass" name="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="#" className="text-sm font-medium text-primary hover:underline">
                                            Password dimenticata?
                                        </Link>
                                    </div>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                                <Button type="submit" className="w-full font-semibold" disabled={loading}>
                                    {loading ? 'Accesso...' : 'Accedi'}
                                </Button>
                            </form>
                            <div className="mt-4 text-center text-sm">
                                <span className="text-muted-foreground">Non hai un account? </span>
                                <Link href="/signup" className="text-primary hover:underline font-medium">
                                    Registrati
                                </Link>
                            </div>
                        </TabsContent>

                        <TabsContent value="otp">
                            <form action={handleOtpLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-otp">Email</Label>
                                    <Input id="email-otp" name="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <Button type="submit" variant="outline" className="w-full border-primary text-primary hover:bg-primary/10" disabled={loading}>
                                    {loading ? 'Invio...' : 'Invia Codice di Accesso'}
                                </Button>
                            </form>
                            <div className="mt-4 text-center text-xs text-muted-foreground">
                                Ti invieremo un link magico via email per accedere senza password.
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
