'use client'

import { useState } from 'react'
import { updateCadastralData } from './actions'
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from 'sonner'
import { Edit2, Zap, Flame, CheckCircle2, AlertCircle } from 'lucide-react'

interface Supply {
    id: string
    pod: string
    nickname: string | null
    service_type: 'electricity' | 'gas'
    address: string | null
    cadastral_section: string | null
    cadastral_sheet: string | null
    cadastral_parcel: string | null
    cadastral_subordinate: string | null
    cadastral_type: string | null
    cadastral_category: string | null
}

export function CadastralList({ supplies }: { supplies: Supply[] }) {
    const [open, setOpen] = useState(false)
    const [selectedSupply, setSelectedSupply] = useState<Supply | null>(null)
    const [loading, setLoading] = useState(false)

    function handleEdit(supply: Supply) {
        setSelectedSupply(supply)
        setOpen(true)
    }

    async function handleSubmit(formData: FormData) {
        setLoading(true)
        try {
            const result = await updateCadastralData(formData)
            if (result.error) {
                toast.error(result.error)
            } else {
                toast.success('Dati salvati!')
                setOpen(false)
            }
        } finally {
            setLoading(false)
        }
    }

    const hasData = (s: Supply) => s.cadastral_sheet && s.cadastral_parcel;

    return (
        <>
            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tipo</TableHead>
                            <TableHead>POD / PDR</TableHead>
                            <TableHead>Indirizzo</TableHead>
                            <TableHead>Stato Dati</TableHead>
                            <TableHead className="text-right">Azioni</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {supplies.map((supply) => (
                            <TableRow key={supply.id}>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        {supply.service_type === 'electricity' ? (
                                            <Zap className="h-4 w-4 text-yellow-600" />
                                        ) : (
                                            <Flame className="h-4 w-4 text-orange-600" />
                                        )}
                                        <span className="capitalize">{supply.service_type === 'electricity' ? 'Luce' : 'Gas'}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="font-mono">{supply.pod}</TableCell>
                                <TableCell>{supply.address || '-'}</TableCell>
                                <TableCell>
                                    {hasData(supply) ? (
                                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Completi
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                                            <AlertCircle className="h-3 w-3 mr-1" /> Mancanti
                                        </Badge>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(supply)}>
                                        <Edit2 className="h-4 w-4 mr-2" /> Modifica
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {supplies.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                    Nessuna fornitura trovata. Aggiungile dal tuo Profilo.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Dati Catastali - {selectedSupply?.pod}</DialogTitle>
                        <DialogDescription>
                            Inserisci i dati catastali per questa fornitura.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSupply && (
                        <form action={handleSubmit} className="space-y-4">
                            <input type="hidden" name="id" value={selectedSupply.id} />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cadastral_type">Tipo Catasto</Label>
                                    <Input id="cadastral_type" name="cadastral_type" defaultValue={selectedSupply.cadastral_type || 'Urbano'} placeholder="Es. Urbano" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cadastral_category">Categoria</Label>
                                    <Input id="cadastral_category" name="cadastral_category" defaultValue={selectedSupply.cadastral_category || ''} placeholder="Es. A/2" />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cadastral_section">Sezione</Label>
                                    <Input id="cadastral_section" name="cadastral_section" defaultValue={selectedSupply.cadastral_section || ''} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cadastral_sheet">Foglio</Label>
                                    <Input id="cadastral_sheet" name="cadastral_sheet" defaultValue={selectedSupply.cadastral_sheet || ''} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cadastral_parcel">Particella</Label>
                                    <Input id="cadastral_parcel" name="cadastral_parcel" defaultValue={selectedSupply.cadastral_parcel || ''} required />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cadastral_subordinate">Subalterno</Label>
                                    <Input id="cadastral_subordinate" name="cadastral_subordinate" defaultValue={selectedSupply.cadastral_subordinate || ''} />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Salvataggio...' : 'Salva Dati'}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}
