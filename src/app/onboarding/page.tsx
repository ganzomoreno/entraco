'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { updateProfile } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { privacyConfig } from '@/config/privacy'
import { toast } from "sonner"
import { Loader2, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'

export default function OnboardingPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        fiscal_code: '',
        phone: '',
    })
    const totalSteps = 3

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const submitData = new FormData(event.currentTarget)

        // Ensure state data is present (in case inputs were unmounted)
        // We can append them manually if not present, but using hidden inputs is cleaner for native FormData
        // especially combined with the on-screen form elements.

        const result = await updateProfile(submitData)
        setLoading(false)

        if (result?.error) {
            toast.error("Errore", { description: result.error })
        } else {
            toast.success("Profilo completato!", { description: "Benvenuto in Entraco." })
        }
    }

    const nextStep = () => {
        // Basic validation before moving next
        if (step === 1 && (!formData.first_name || !formData.last_name || !formData.fiscal_code)) {
            toast.error("Compila tutti i campi per proseguire.")
            return
        }
        if (step === 2 && !formData.phone) {
            toast.error("Inserisci un numero di telefono.")
            return
        }
        setStep(s => Math.min(s + 1, totalSteps))
    }
    const prevStep = () => setStep(s => Math.max(s - 1, 1))

    return (
        <div className="min-h-screen bg-gradient-to-br from-gradient-start to-gradient-end flex items-center justify-center p-4">
            <Card className="w-full max-w-lg shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                    <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        animate={{ width: `${(step / totalSteps) * 100}%` }}
                    />
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Hidden inputs to ensure all data is submitted in the final step */}
                    {step === 3 && (
                        <>
                            <input type="hidden" name="first_name" value={formData.first_name} />
                            <input type="hidden" name="last_name" value={formData.last_name} />
                            <input type="hidden" name="fiscal_code" value={formData.fiscal_code} />
                            <input type="hidden" name="phone" value={formData.phone} />
                        </>
                    )}

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CardHeader>
                                    <CardTitle>Benvenuto! 👋</CardTitle>
                                    <CardDescription>Iniziamo creando il tuo profilo personale.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="first_name">Nome</Label>
                                            <Input
                                                id="first_name"
                                                name="first_name"
                                                placeholder="Mario"
                                                required
                                                value={formData.first_name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="last_name">Cognome</Label>
                                            <Input
                                                id="last_name"
                                                name="last_name"
                                                placeholder="Rossi"
                                                required
                                                value={formData.last_name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fiscal_code">Codice Fiscale</Label>
                                        <Input
                                            id="fiscal_code"
                                            name="fiscal_code"
                                            placeholder="RSSMRA..."
                                            required
                                            value={formData.fiscal_code}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button type="button" onClick={nextStep}>
                                        Avanti <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CardHeader>
                                    <CardTitle>Contatti 📱</CardTitle>
                                    <CardDescription>Come possiamo rintracciarti?</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Numero di Telefono</Label>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            placeholder="+39 333..."
                                            required
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button type="button" variant="ghost" onClick={prevStep}>
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Indietro
                                    </Button>
                                    <Button type="button" onClick={nextStep}>
                                        Avanti <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CardHeader>
                                    <CardTitle>Privacy & Consensi 🔒</CardTitle>
                                    <CardDescription>Scegli come gestire i tuoi dati.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-start space-x-3 p-4 border rounded-lg bg-muted/50">
                                        <Checkbox id="terms" required />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                {privacyConfig.tos.title}
                                            </Label>
                                            <p className="text-xs text-muted-foreground">{privacyConfig.tos.description}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between space-x-2">
                                            <Label htmlFor="marketing" className="flex flex-col space-y-1">
                                                <span>{privacyConfig.marketing.title}</span>
                                                <span className="font-normal text-xs text-muted-foreground">{privacyConfig.marketing.description}</span>
                                            </Label>
                                            <Switch id="marketing" name="consent_marketing" />
                                        </div>
                                        <div className="flex items-center justify-between space-x-2">
                                            <Label htmlFor="profiling" className="flex flex-col space-y-1">
                                                <span>{privacyConfig.profiling.title}</span>
                                                <span className="font-normal text-xs text-muted-foreground">{privacyConfig.profiling.description}</span>
                                            </Label>
                                            <Switch id="profiling" name="consent_profiling" />
                                        </div>
                                        <div className="flex items-center justify-between space-x-2">
                                            <Label htmlFor="third_party" className="flex flex-col space-y-1">
                                                <span>{privacyConfig.third_party.title}</span>
                                                <span className="font-normal text-xs text-muted-foreground">{privacyConfig.third_party.description}</span>
                                            </Label>
                                            <Switch id="third_party" name="consent_third_party" />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button type="button" variant="ghost" onClick={prevStep}>
                                        <ChevronLeft className="mr-2 h-4 w-4" /> Indietro
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {loading ? 'Salvataggio...' : 'Completa Registrazione'}
                                    </Button>
                                </CardFooter>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </form>
            </Card>
        </div>
    )
}
