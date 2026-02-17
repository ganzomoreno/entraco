import { getURL } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export default async function DebugPage() {
    const url = await getURL()
    const headersList = await headers()
    const host = headersList.get('host')
    const origin = headersList.get('origin')
    const referer = headersList.get('referer')
    const forwardedHost = headersList.get('x-forwarded-host')

    return (
        <div className="p-8 font-mono text-sm space-y-4">
            <h1 className="text-xl font-bold">Debug URL Detection</h1>

            <div className="p-4 border rounded bg-slate-100">
                <h2 className="font-bold mb-2">Detected URL (Result):</h2>
                <p className="text-green-600 text-lg break-all">{url}</p>
            </div>

            <div className="p-4 border rounded bg-slate-50">
                <h2 className="font-bold mb-2">Request Headers:</h2>
                <ul className="space-y-1">
                    <li><strong>Host:</strong> {host || 'null'}</li>
                    <li><strong>Origin:</strong> {origin || 'null'}</li>
                    <li><strong>Referer:</strong> {referer || 'null'}</li>
                    <li><strong>X-Forwarded-Host:</strong> {forwardedHost || 'null'}</li>
                </ul>
            </div>

            <div className="p-4 border rounded bg-orange-50">
                <h2 className="font-bold mb-2">Environment:</h2>
                <ul className="space-y-1">
                    <li><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</li>
                    <li><strong>NEXT_PUBLIC_SITE_URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL}</li>
                    <li><strong>Calculated Protocol:</strong> {url.startsWith('https') ? 'https' : 'http'}</li>
                </ul>
            </div>
        </div>
    )
}
