import { loginWithOtp, loginWithPassword } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Zap } from 'lucide-react'
import Link from 'next/link'

import Image from 'next/image'

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 w-fit">
                        <Image src="/logo.png" alt="Entraco Logo" width={220} height={80} priority className="h-auto w-auto" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Area Riservata</CardTitle>
                    <CardDescription>Accedi per gestire le tue forniture.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="password" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="password">Password</TabsTrigger>
                            <TabsTrigger value="otp">Codice Rapido</TabsTrigger>
                        </TabsList>

                        <TabsContent value="password">
                            <form action={loginWithPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-pass">Email</Label>
                                    <Input id="email-pass" name="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" name="password" type="password" required />
                                </div>
                                <Button type="submit" className="w-full font-semibold">
                                    Accedi
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
                            <form action={loginWithOtp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email-otp">Email</Label>
                                    <Input id="email-otp" name="email" type="email" placeholder="m@example.com" required />
                                </div>
                                <Button type="submit" variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                                    Invia Codice di Accesso
                                </Button>
                            </form>
                            <div className="mt-4 text-center text-xs text-muted-foreground">
                                Ti invieremo un link magico via email per accedere senza password.
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
