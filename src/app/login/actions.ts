'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient, getURL } from '@/utils/supabase/server'

export async function loginWithOtp(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return { error: 'Inserisci un indirizzo email valido.' }
    }

    const redirectUrl = `${await getURL()}auth/callback`
    console.log('--- LOGIN ACTION DEBUG ---')
    console.log('Generated Redirect URL:', redirectUrl)

    const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
            shouldCreateUser: true,
            emailRedirectTo: redirectUrl,
        },
    })

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: 'Controlla la tua email per il link di accesso!' }
}

export async function loginWithPassword(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'Inserisci email e password.' }
    }

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (error) {
        return { error: 'Credenziali non valide.' }
    }

    revalidatePath('/', 'layout')
    redirect('/dashboard')
}

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!email || !password || !confirmPassword) {
        return { error: 'Compila tutti i campi.' }
    }

    if (password !== confirmPassword) {
        return { error: 'Le password non corrispondono.' }
    }

    const redirectUrl = `${await getURL()}auth/callback`
    console.log('--- SIGNUP ACTION DEBUG ---')
    console.log('Email:', email)
    console.log('Redirect URL:', redirectUrl)

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: redirectUrl,
        },
    })

    if (error) {
        console.error('Signup Error:', error)
        return { error: error.message }
    }

    console.log('Signup Success:', data)

    if (error) {
        return { error: error.message }
    }

    return { success: 'Registrazione completata! Controlla la tua email per confermare l\'account.' }
}
