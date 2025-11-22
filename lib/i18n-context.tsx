'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { translations, Language } from './translations'

type I18nContextType = {
    language: Language
    setLanguage: (lang: Language) => void
    t: (key: string) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>('en')

    useEffect(() => {
        const saved = localStorage.getItem('app-language') as Language
        if (saved && ['en', 'fil', 'ceb'].includes(saved)) {
            setLanguage(saved)
        }
    }, [])

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem('app-language', lang)
    }

    const t = (path: string) => {
        const keys = path.split('.')
        let current: any = translations[language]

        for (const key of keys) {
            if (current[key] === undefined) {
                // Fallback to English
                let fallback: any = translations['en']
                for (const k of keys) {
                    if (fallback[k] === undefined) return path
                    fallback = fallback[k]
                }
                return fallback
            }
            current = current[key]
        }

        return current as string
    }

    return (
        <I18nContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </I18nContext.Provider>
    )
}

export function useI18n() {
    const context = useContext(I18nContext)
    if (context === undefined) {
        throw new Error('useI18n must be used within an I18nProvider')
    }
    return context
}
