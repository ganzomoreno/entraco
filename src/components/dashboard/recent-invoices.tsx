import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownToLine, FileText } from "lucide-react"

export function RecentInvoices() {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Ultime Fatture</CardTitle>
                <CardDescription>
                    Hai 1 fattura in scadenza questo mese.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="h-12 w-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                        <FileText className="h-6 w-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Nessuna fattura recente</p>
                    <p className="text-xs text-muted-foreground mt-1">Le tue fatture appariranno qui.</p>
                </div>
            </CardContent>
        </Card>
    )
}
