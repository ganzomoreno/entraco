'use client'

import { signup } from '@/app/login/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Zap } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

import Image from 'next/image'

export default function SignupPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        const result = await signup(formData)
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else if (result.success) {
            toast.success(result.success)
            // Optional: redirect to login or show a success message page
            // router.push('/login') 
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
                        <h1 className="text-4xl font-bold tracking-tight">Unisciti a Entraco</h1>
                        <p className="text-lg text-white/90">
                            Crea il tuo account e inizia a gestire le tue utenze in modo intelligente e sostenibile.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Signup Form */}
            <div className="flex items-center justify-center bg-background p-8">
                <div className="w-full max-w-md space-y-6">
                    <div className="flex flex-col space-y-2 text-center lg:text-left">
                        {/* Mobile Logo */}
                        <div className="lg:hidden mx-auto mb-4">
                            <Image src="/logo.png" alt="Entraco Logo" width={180} height={60} className="h-auto w-auto" />
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight">Crea un Account</h2>
                        <p className="text-muted-foreground">
                            Inserisci i tuoi dati per registrarti.
                        </p>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Conferma Password</Label>
                            <Input id="confirmPassword" name="confirmPassword" type="password" required />
                        </div>
                        <Button type="submit" className="w-full font-semibold" disabled={loading}>
                            {loading ? 'Registrazione in corso...' : 'Registrati'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        <span className="text-muted-foreground">Hai già un account? </span>
                        <Link href="/login" className="text-primary hover:underline font-medium">
                            Accedi
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
