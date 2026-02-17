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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary to-orange-400 p-4">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-fit">
                        <Image src="/logo.png" alt="Entraco Logo" width={220} height={80} priority className="h-auto w-auto" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Crea un Account</CardTitle>
                    <CardDescription>Registrati per gestire le tue forniture Entraco.</CardDescription>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
    )
}
