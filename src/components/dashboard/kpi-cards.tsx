import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Zap, FileText, ArrowUpRight, ArrowDownRight, Flame } from "lucide-react"
import { getKpiData } from "@/app/dashboard/actions"

export async function KpiCards() {
    const data = await getKpiData()

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Totale Utenze
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{data.suppliesCount}</div>
                    <p className="text-xs text-muted-foreground">
                        {data.suppliesCount > 0 ? 'Forniture attive' : 'Nessuna utenza attiva'}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ultimi Consumi
                    </CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-sm">
                        <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            {data.elecConsumption} kWh
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            {data.gasConsumption} Smc
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Fatture da Pagare
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className={`text-2xl font-bold ${data.unpaidInvoicesCount > 0 ? 'text-red-500' : ''}`}>
                        {data.unpaidInvoicesCount}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {data.unpaidInvoicesCount > 0 ? 'Scadenzario attivo' : 'Tutto in regola'}
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Ultima Bolletta
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">€ {data.lastBillAmount.toFixed(2).replace('.', ',')}</div>
                    <p className="text-xs text-muted-foreground flex items-center">
                        Totale ultimo avviso
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
