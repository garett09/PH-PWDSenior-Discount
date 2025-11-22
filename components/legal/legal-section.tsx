'use client'

import { useState } from 'react'
import { OfflineEmergencyCard } from '@/components/legal/offline-card'
import { RightsFlashcards } from '@/components/legal/rights-flashcards'
import { ComplaintGenerator } from '@/components/legal/complaint-generator'
import { Shield, BookOpen, AlertTriangle } from 'lucide-react'

export function LegalSection() {
    const [activeSection, setActiveSection] = useState('card')

    return (
        <div className="space-y-4">
            {/* Sub-navigation for Legal Tools */}
            <div className="flex p-1 bg-slate-100 rounded-xl overflow-x-auto">
                <button
                    onClick={() => setActiveSection('card')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeSection === 'card'
                        ? 'bg-white text-red-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <Shield className="w-4 h-4" />
                    Emergency Card
                </button>
                <button
                    onClick={() => setActiveSection('rights')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeSection === 'rights'
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <BookOpen className="w-4 h-4" />
                    Know Your Rights
                </button>
                <button
                    onClick={() => setActiveSection('complaint')}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap ${activeSection === 'complaint'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                        }`}
                >
                    <AlertTriangle className="w-4 h-4" />
                    File Complaint
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[400px]">
                {activeSection === 'card' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <OfflineEmergencyCard />
                    </div>
                )}

                {activeSection === 'rights' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <RightsFlashcards />
                    </div>
                )}

                {activeSection === 'complaint' && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <ComplaintGenerator />
                    </div>
                )}
            </div>
        </div>
    )
}
