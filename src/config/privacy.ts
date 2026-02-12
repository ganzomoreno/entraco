export const privacyConfig = {
    marketing: {
        id: "consent_marketing",
        title: "Marketing e Comunicazioni Commerciali",
        description: "Acconsento al trattamento dei miei dati per ricevere comunicazioni promozionali, offerte e newsletter da parte di Entraco.",
        required: false,
    },
    profiling: {
        id: "consent_profiling",
        title: "Profilazione e Analisi delle Abitudini",
        description: "Acconsento all'analisi delle mie abitudini di consumo per ricevere offerte personalizzate e migliorare i servizi offerti.",
        required: false,
    },
    third_party: {
        id: "consent_third_party",
        title: "Cessione Dati a Terze Parti",
        description: "Acconsento alla comunicazione dei miei dati a partner commerciali di Entraco per loro finalità di marketing.",
        required: false,
    },
    tos: {
        id: "terms_accepted",
        title: "Termini e Condizioni di Servizio",
        description: "Dichiaro di aver letto e accettato i Termini e Condizioni e la Privacy Policy di Entraco.",
        required: true,
    }
}
