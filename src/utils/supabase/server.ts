import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

export const getURL = async () => {
    let url = process.env.NEXT_PUBLIC_SITE_URL ??
        process.env.NEXT_PUBLIC_VERCEL_URL ??
        process.env.VERCEL_URL ??
        'http://localhost:3000/'

    url = url.includes('http') ? url : `https://${url}`
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

    try {
        const headersList = await headers()
        const host = headersList.get('x-forwarded-host') || headersList.get('host')
        const origin = headersList.get('origin')

        console.log('--- DEBUG getURL ---')
        console.log('Origin:', origin)
        console.log('Host:', host)

        // Prefer origin if available (CORS), otherwise host
        const effectiveHost = origin || host

        if (effectiveHost) {
            if (effectiveHost.startsWith('http')) {
                url = effectiveHost
            } else {
                // Determine protocol
                const isLocal = effectiveHost.includes('localhost') || effectiveHost.includes('127.0.0.1') || effectiveHost.startsWith('192.168.')
                const protocol = isLocal ? 'http' : 'https'
                url = `${protocol}://${effectiveHost}`
            }
        }
    } catch (e) {
        console.warn('URL detection failed, falling back to env vars', e)
    }

    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`

    console.log('Final URL:', url)
    return url
}
