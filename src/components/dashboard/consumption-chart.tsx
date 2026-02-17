"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const dataEnergy = [
    { name: "Gen", total: 150 },
    { name: "Feb", total: 120 },
    { name: "Mar", total: 170 },
    { name: "Apr", total: 110 },
    { name: "Mag", total: 90 },
    { name: "Giu", total: 130 },
    { name: "Lug", total: 200 },
    { name: "Ago", total: 240 },
    { name: "Set", total: 180 },
    { name: "Ott", total: 140 },
    { name: "Nov", total: 160 },
    { name: "Dic", total: 571 },
]

const dataGas = [
    { name: "Gen", total: 80 },
    { name: "Feb", total: 75 },
    { name: "Mar", total: 60 },
    { name: "Apr", total: 40 },
    { name: "Mag", total: 20 },
    { name: "Giu", total: 10 },
    { name: "Lug", total: 5 },
    { name: "Ago", total: 5 },
    { name: "Set", total: 10 },
    { name: "Ott", total: 30 },
    { name: "Nov", total: 60 },
    { name: "Dic", total: 90 },
]

export function ConsumptionChart() {
    return (
        <Card className="col-span-4">
            <CardHeader>
                <CardTitle>Statistiche Consumi</CardTitle>
                <CardDescription>
                    Andamento mensile dei consumi energetici per le tue utenze.
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <Tabs defaultValue="energy" className="space-y-4">
                    <div className="flex justify-end">
                        <TabsList>
                            <TabsTrigger value="energy">Energia (kWh)</TabsTrigger>
                            <TabsTrigger value="gas">Gas (Smc)</TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="energy" className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataEnergy}>
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
                                    tickFormatter={(value) => `${value} kWh`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </TabsContent>
                    <TabsContent value="gas" className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataGas}>
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
                                    tickFormatter={(value) => `${value} Smc`}
                                />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="total" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
