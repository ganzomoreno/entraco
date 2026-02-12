'use client'

import { useState, useEffect } from 'react'
import { getConsumptionData } from './actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"
import { Download, Zap, Flame, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

interface Supply {
    id: string
    pod: string
    nickname: string | null
    service_type: 'electricity' | 'gas'
}

interface Reading {
    id: string
    reading_date: string
    value_total: number
    value_f1: number
    value_f2: number
    value_f3: number
    is_estimated: boolean
}

export function ConsumptionClient({ supplies }: { supplies: Supply[] }) {
    const [selectedSupplyId, setSelectedSupplyId] = useState<string>(supplies[0]?.id || '')
    const [year, setYear] = useState<string>(new Date().getFullYear().toString())
    const [readings, setReadings] = useState<Reading[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selectedSupplyId) {
            loadReadings(selectedSupplyId, parseInt(year))
        }
    }, [selectedSupplyId, year])

    async function loadReadings(id: string, y: number) {
        setLoading(true)
        const result = await getConsumptionData(id, y)
        if (result.error) {
            toast.error("Errore nel caricamento dei consumi")
        } else {
            setReadings(result.readings || [])
        }
        setLoading(false)
    }

    const selectedSupply = supplies.find(s => s.id === selectedSupplyId)

    // Format data for chart
    const chartData = readings.map(r => ({
        name: format(new Date(r.reading_date), 'MMM', { locale: it }),
        fullDate: format(new Date(r.reading_date), 'dd MMM yyyy', { locale: it }),
        F1: r.value_f1,
        F2: r.value_f2,
        F3: r.value_f3,
        total: r.value_total,
        type: r.is_estimated ? 'Stimato' : 'Reale'
    }))

    const handleDownloadCsv = () => {
        if (!readings.length) return;

        const headers = ['Data', 'Totale', 'F1', 'F2', 'F3', 'Tipo', 'POD'];
        const rows = readings.map(r => [
            r.reading_date,
            r.value_total,
            r.value_f1,
            r.value_f2,
            r.value_f3,
            r.is_estimated ? 'Stimato' : 'Reale',
            selectedSupply?.pod
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `consumi_${selectedSupply?.pod}_${year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Download avviato")
    }

    if (!supplies.length) {
        return (
            <div className="text-center py-10">
                <p className="text-muted-foreground">Nessuna utenza trovata. Aggiungine una dal profilo.</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="flex gap-4 items-center">
                    <Select value={selectedSupplyId} onValueChange={setSelectedSupplyId}>
                        <SelectTrigger className="w-[280px]">
                            <SelectValue placeholder="Seleziona Utenza" />
                        </SelectTrigger>
                        <SelectContent>
                            {supplies.map((s) => (
                                <SelectItem key={s.id} value={s.id}>
                                    <div className="flex items-center gap-2">
                                        {s.service_type === 'electricity' ? <Zap className="h-4 w-4 text-yellow-500" /> : <Flame className="h-4 w-4 text-orange-500" />}
                                        <span>{s.nickname || s.pod}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={year} onValueChange={setYear}>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Anno" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2026">2026</SelectItem>
                            <SelectItem value="2025">2025</SelectItem>
                            <SelectItem value="2024">2024</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Button variant="outline" onClick={handleDownloadCsv} disabled={!readings.length}>
                    <Download className="mr-2 h-4 w-4" />
                    Esporta CSV
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Consumo Totale {year}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {readings.reduce((acc, curr) => acc + curr.value_total, 0).toLocaleString('it-IT')}
                            <span className="text-sm font-normal text-muted-foreground ml-1">
                                {selectedSupply?.service_type === 'electricity' ? 'kWh' : 'Smc'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Media Mensile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {readings.length > 0
                                ? Math.round(readings.reduce((acc, curr) => acc + curr.value_total, 0) / readings.length).toLocaleString('it-IT')
                                : 0}
                            <span className="text-sm font-normal text-muted-foreground ml-1">
                                {selectedSupply?.service_type === 'electricity' ? 'kWh' : 'Smc'}
                            </span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Letture Stimate</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {readings.filter(r => r.is_estimated).length}
                            <span className="text-sm font-normal text-muted-foreground ml-1">su {readings.length}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Andamento Consumi per Fasce</CardTitle>
                    <CardDescription>
                        Ripartizione F1, F2, F3 dei consumi mensili.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        {loading ? (
                            <div className="h-full w-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : readings.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                    />
                                    <YAxis
                                        stroke="#888888"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(value) => `${value}`}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="rounded-lg border bg-background p-2 shadow-sm text-sm">
                                                        <div className="mb-2 font-bold text-muted-foreground">
                                                            {data.fullDate}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                                            <span className="text-orange-500 font-medium">F1:</span> <span>{data.F1}</span>
                                                            <span className="text-yellow-500 font-medium">F2:</span> <span>{data.F2}</span>
                                                            <span className="text-green-500 font-medium">F3:</span> <span>{data.F3}</span>
                                                            <div className="col-span-2 border-t mt-1 pt-1 font-bold flex justify-between">
                                                                <span>Totale:</span> <span>{data.total}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            return null
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="F1" stackId="a" fill="#f97316" radius={[0, 0, 0, 0]} name="F1 (Ore di Punta)" />
                                    <Bar dataKey="F2" stackId="a" fill="#eab308" radius={[0, 0, 0, 0]} name="F2 (Ore Intermedie)" />
                                    <Bar dataKey="F3" stackId="a" fill="#22c55e" radius={[4, 4, 0, 0]} name="F3 (Ore Fuori Punta)" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                                Nessun dato disponibile per questo periodo.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
