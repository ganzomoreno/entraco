'use client'

import { useState } from 'react'
import { addSupply, deleteSupply } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Trash2, Plus, Zap, Flame } from 'lucide-react'

interface Supply {
    id: string
    pod: string
    nickname: string | null
    service_type: 'electricity' | 'gas'
    address: string | null
}

export function SuppliesList({ supplies }: { supplies: Supply[] }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleAddSupply(formData: FormData) {
        setLoading(true)
        try {
            const result = await addSupply(formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Fornitura aggiunta!')
                setOpen(false)
            }
        } finally {
            setLoading(false)
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Sei sicuro di voler rimuovere questa fornitura?')) return
        const result = await deleteSupply(id)
        if (result?.error) toast.error(result.error)
        else toast.success('Fornitura rimossa')
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Le tue Utenze</h3>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" /> Aggiungi
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Nuova Fornitura</DialogTitle>
                            <DialogDescription>
                                Inserisci i dati della tua utenza (Luce o Gas).
                            </DialogDescription>
                        </DialogHeader>
                        <form action={handleAddSupply} className="space-y-4">
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="service_type">Tipo Servizio</Label>
                                    <Select name="service_type" defaultValue="electricity">
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="electricity">⚡ Luce</SelectItem>
                                            <SelectItem value="gas">🔥 Gas</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="nickname">Nome (Opzionale)</Label>
                                    <Input id="nickname" name="nickname" placeholder="Es. Casa al mare" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="pod">POD / PDR</Label>
                                    <Input id="pod" name="pod" placeholder="IT001E..." required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Indirizzo Fornitura</Label>
                                    <Input id="address" name="address" placeholder="Via Roma 1, Milano" />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Salvataggio...' : 'Salva Fornitura'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {supplies.map((supply) => (
                    <div
                        key={supply.id}
                        className="flex items-center justify-between p-4 border rounded-lg bg-card text-card-foreground shadow-sm"
                    >
                        <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${supply.service_type === 'electricity' ? 'bg-yellow-100 text-yellow-600' : 'bg-orange-100 text-orange-600'}`}>
                                {supply.service_type === 'electricity' ? <Zap className="h-5 w-5" /> : <Flame className="h-5 w-5" />}
                            </div>
                            <div>
                                <h4 className="font-semibold">{supply.nickname || (supply.service_type === 'electricity' ? 'Utenza Luce' : 'Utenza Gas')}</h4>
                                <p className="text-xs text-muted-foreground font-mono">{supply.pod}</p>
                                {supply.address && <p className="text-xs text-muted-foreground mt-1">{supply.address}</p>}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(supply.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
                {supplies.length === 0 && (
                    <div className="col-span-full text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-dashed border-2">
                        Non hai ancora aggiunto nessuna fornitura.
                    </div>
                )}
            </div>
        </div>
    )
}
