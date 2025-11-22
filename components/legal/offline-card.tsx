'use client'

import { useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Phone, Shield, AlertTriangle } from 'lucide-react'

export function OfflineEmergencyCard() {
    const cardRef = useRef<HTMLDivElement>(null)

    const handleDownload = () => {
        // Since we can't easily use html2canvas without installing it, 
        // we'll use a print-based approach for now, or just encourage screenshots.
        // A simple "Print" that targets just this card is effective.

        const printContent = cardRef.current
        if (!printContent) return

        const originalContents = document.body.innerHTML
        document.body.innerHTML = printContent.outerHTML
        window.print()
        document.body.innerHTML = originalContents
        window.location.reload() // Reload to restore event listeners
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Emergency Rights Card</h3>
                    <p className="text-sm text-slate-500">Save this for offline use when you have no data.</p>
                </div>
                <Button onClick={handleDownload} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Save / Print
                </Button>
            </div>

            {/* The Card Itself */}
            <div ref={cardRef} className="w-full max-w-md mx-auto bg-slate-900 text-white rounded-xl overflow-hidden shadow-2xl print:shadow-none print:w-full print:max-w-none">
                {/* Header */}
                <div className="bg-red-600 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-6 h-6 text-white" />
                        <span className="font-bold text-lg uppercase tracking-wider">Rights & Emergency</span>
                    </div>
                    <div className="text-xs font-mono bg-red-700 px-2 py-1 rounded">
                        RA 10754 / RA 9994
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest">Mandatory Privileges</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <p className="text-2xl font-bold text-white">20%</p>
                                <p className="text-xs text-slate-400">Discount on VAT-exempt sales</p>
                            </div>
                            <div className="bg-slate-800 p-3 rounded-lg border border-slate-700">
                                <p className="text-2xl font-bold text-white">0%</p>
                                <p className="text-xs text-slate-400">VAT (Value Added Tax)</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest">Key Rights</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                <span><strong>No Service Charge:</strong> 100% exempt in restaurants.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                <span><strong>Priority Lane:</strong> Express lanes in all establishments.</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                <span><strong>Any Valid ID:</strong> Government ID with birthdate is sufficient.</span>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-red-400 text-xs font-bold uppercase tracking-widest">Emergency Hotlines</h4>
                        <div className="bg-slate-800 rounded-lg divide-y divide-slate-700">
                            <div className="p-3 flex justify-between items-center">
                                <span className="text-sm font-medium">DTI (Complaints)</span>
                                <span className="font-mono font-bold text-yellow-400">1-384</span>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                                <span className="text-sm font-medium">NCDA (Disability)</span>
                                <span className="font-mono font-bold text-yellow-400">(02) 8932-6422</span>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                                <span className="text-sm font-medium">NCSC (Seniors)</span>
                                <span className="font-mono font-bold text-yellow-400">(02) 8249-8310</span>
                            </div>
                            <div className="p-3 flex justify-between items-center">
                                <span className="text-sm font-medium">Citizen Complaint</span>
                                <span className="font-mono font-bold text-yellow-400">8888</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-slate-950 p-3 text-center">
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Powered by Karapat Discount</p>
                </div>
            </div>
        </div>
    )
}
