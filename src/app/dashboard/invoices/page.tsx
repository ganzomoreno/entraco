import { getInvoices } from './actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, FileText, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { it } from 'date-fns/locale'

export default async function InvoicesPage() {
    const invoices = await getInvoices()

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">Fatture e Pagamenti</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-l-4 border-l-primary shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Ultima Fattura</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {invoices[0] ? `€ ${invoices[0].amount}` : '€ 0,00'}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {invoices[0] ? `Scadenza ${format(new Date(invoices[0].due_date), 'd MMM yyyy', { locale: it })}` : 'Nessuna fattura da pagare'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-md border-0">
                <CardHeader className="bg-gray-50/50 border-b">
                    <CardTitle>Storico Fatture</CardTitle>
                    <CardDescription>
                        Visualizza e scarica le tue fatture recenti.
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Numero</TableHead>
                                <TableHead>Data Emissione</TableHead>
                                <TableHead>Importo</TableHead>
                                <TableHead>Stato</TableHead>
                                <TableHead>Scadenza</TableHead>
                                <TableHead className="text-right">Azioni</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {invoices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                                        Nessuna fattura presente.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                invoices.map((invoice: any) => (
                                    <TableRow key={invoice.id} className="group hover:bg-orange-50/30 transition-colors">
                                        <TableCell className="font-medium text-primary">{invoice.number}</TableCell>
                                        <TableCell>{format(new Date(invoice.issue_date), 'd MMM yyyy', { locale: it })}</TableCell>
                                        <TableCell className="font-bold">€ {invoice.amount}</TableCell>
                                        <TableCell>
                                            {invoice.status === 'paid' ? (
                                                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">Pagata</Badge>
                                            ) : invoice.status === 'overdue' ? (
                                                <Badge variant="destructive">Scaduta</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">In Scadenza</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>{format(new Date(invoice.due_date), 'd MMM yyyy', { locale: it })}</TableCell>
                                        <TableCell className="text-right">
                                            {invoice.pdf_url ? (
                                                <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary hover:bg-orange-100">
                                                    <Link href={invoice.pdf_url} target="_blank" prefetch={false}>
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Scarica
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <span className="text-xs text-muted-foreground">Non disponibile</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
