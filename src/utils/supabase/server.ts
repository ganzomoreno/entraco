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
        'http://localhost:3000/'

    try {
        const headersList = await headers()
        const origin = headersList.get('origin') || headersList.get('x-forwarded-host') || headersList.get('host')

        if (origin) {
            // If we have an origin/host from headers, use it as the source of truth
            // Check if it already has protocol, otherwise assume https for non-localhost
            if (origin.startsWith('http')) {
                url = origin
            } else {
                // Vercel and most production environments serve over HTTPS
                const protocol = origin.includes('localhost') ? 'http' : 'https'
                url = `${protocol}://${origin}`
            }
        }
    } catch (e) {
        // Fallback to env vars if headers are not available
        console.warn('Could not get headers for URL detection', e)
    }

    // Make sure to include `https://` when not localhost if it's missing (env var fallback case)
    if (!url.startsWith('http')) {
        url = `https://${url}`
    }

    // Make sure to include a trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`
    return url
}
