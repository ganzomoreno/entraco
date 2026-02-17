import Link from 'next/link'

export default function AuthCodeErrorPage({
    searchParams,
}: {
    searchParams: { error?: string }
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-md text-center">
                <div className="text-red-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-16 h-16 mx-auto"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Autenticazione Fallita</h1>

                <p className="text-gray-600">
                    C'è stato un problema durante l'accesso. Il link potrebbe essere scaduto o già utilizzato.
                </p>

                {searchParams.error && (
                    <div className="p-3 my-4 text-sm text-left text-red-700 bg-red-100 rounded border border-red-200 break-all">
                        <strong>Errore:</strong> {searchParams.error}
                    </div>
                )}

                <div className="pt-4">
                    <Link
                        href="/login"
                        className="inline-block w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                    >
                        Torna al Login
                    </Link>
                </div>
            </div>
        </div>
    )
}
