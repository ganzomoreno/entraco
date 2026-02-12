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
                <div className="space-y-8">
                    <div className="flex items-center">
                        <div className="h-9 w-9 bg-red-100 text-red-600 rounded-full flex items-center justify-center border border-red-200">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Fattura n. 2024/001</p>
                            <p className="text-xs text-muted-foreground">
                                Scadenza: 15 Feb 2026 - Luce Casa
                            </p>
                        </div>
                        <div className="ml-auto font-medium text-red-600">€ 124,50</div>
                        <Button variant="ghost" size="icon" className="ml-2">
                            <ArrowDownToLine className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center">
                        <div className="h-9 w-9 bg-green-100 text-green-600 rounded-full flex items-center justify-center border border-green-200">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Fattura n. 2023/128</p>
                            <p className="text-xs text-muted-foreground">
                                Pagata il 10 Gen 2026 - Gas Cucina
                            </p>
                        </div>
                        <div className="ml-auto font-medium">€ 45,00</div>
                        <Button variant="ghost" size="icon" className="ml-2">
                            <ArrowDownToLine className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="flex items-center">
                        <div className="h-9 w-9 bg-green-100 text-green-600 rounded-full flex items-center justify-center border border-green-200">
                            <FileText className="h-5 w-5" />
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">Fattura n. 2023/112</p>
                            <p className="text-xs text-muted-foreground">
                                Pagata il 12 Dic 2025 - Luce Casa
                            </p>
                        </div>
                        <div className="ml-auto font-medium">€ 132,00</div>
                        <Button variant="ghost" size="icon" className="ml-2">
                            <ArrowDownToLine className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
