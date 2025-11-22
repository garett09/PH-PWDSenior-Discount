'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { TrendingUp, Award, RefreshCcw, Trash2, Utensils, ShoppingCart, Pill, Zap, Plane } from 'lucide-react'
import { getSavedCalculations, deleteAllCalculations, type SavedCalculation } from '@/lib/storage-utils'

export function SavingsDashboard() {
    const [calculations, setCalculations] = useState<SavedCalculation[]>([])
    const [totalSaved, setTotalSaved] = useState(0)
    const [savingsByCategory, setSavingsByCategory] = useState<Record<string, number>>({
        restaurant: 0,
        groceries: 0,
        medicine: 0,
        utilities: 0,
        transport: 0
    })
    const [rank, setRank] = useState({ title: 'Discount Rookie', color: 'bg-slate-500', nextThreshold: 1000 })

    const loadData = () => {
        const saved = getSavedCalculations()
        setCalculations(saved)

        let total = 0
        const byCategory: Record<string, number> = {
            restaurant: 0,
            groceries: 0,
            medicine: 0,
            utilities: 0,
            transport: 0
        }

        saved.forEach(calc => {
            const savedAmount = calc.results.totalSaved || calc.results.totalDiscount || calc.results.discount5 || 0
            total += savedAmount
            if (calc.type in byCategory) {
                byCategory[calc.type] += savedAmount
            }
        })

        setTotalSaved(total)
        setSavingsByCategory(byCategory)
        updateRank(total)
    }

    const updateRank = (total: number) => {
        if (total >= 50000) setRank({ title: 'Discount Legend', color: 'bg-yellow-500', nextThreshold: Infinity })
        else if (total >= 10000) setRank({ title: 'Savings Master', color: 'bg-purple-500', nextThreshold: 50000 })
        else if (total >= 5000) setRank({ title: 'Smart Spender', color: 'bg-blue-500', nextThreshold: 10000 })
        else if (total >= 1000) setRank({ title: 'Wise Saver', color: 'bg-green-500', nextThreshold: 5000 })
        else setRank({ title: 'Discount Rookie', color: 'bg-slate-500', nextThreshold: 1000 })
    }

    useEffect(() => {
        loadData()
        // Listen for storage updates (if we add an event listener in storage-utils later)
        // For now, we rely on the parent or manual refresh
        window.addEventListener('storage', loadData)
        return () => window.removeEventListener('storage', loadData)
    }, [])

    const handleClearData = () => {
        if (confirm('Are you sure you want to clear all savings history? This cannot be undone.')) {
            deleteAllCalculations()
            loadData()
        }
    }

    const formatCurrency = (val: number | undefined) => {
        const num = val || 0
        return '₱' + num.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    return (
        <div className="space-y-6">
            {/* Hero Card */}
            <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white border-0 shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 p-24 bg-indigo-900/20 rounded-full -ml-12 -mb-12 blur-2xl"></div>

                <CardContent className="p-6 relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 font-medium mb-1">Total Lifetime Savings</p>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">{formatCurrency(totalSaved)}</h2>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/30 flex items-center gap-2`}>
                            <Award className="w-4 h-4 text-yellow-300" />
                            {rank.title}
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex justify-between text-xs text-blue-100 mb-2">
                            <span>Next Rank: {rank.nextThreshold === Infinity ? 'Max Level!' : formatCurrency(rank.nextThreshold)}</span>
                            <span>{rank.nextThreshold === Infinity ? '100%' : Math.min(Math.round((totalSaved / rank.nextThreshold) * 100), 100) + '%'}</span>
                        </div>
                        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-1000 ease-out"
                                style={{ width: `${rank.nextThreshold === Infinity ? 100 : Math.min((totalSaved / rank.nextThreshold) * 100, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Breakdown Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-orange-50 border-orange-100">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="p-2 bg-orange-100 rounded-full mb-2">
                            <Utensils className="w-5 h-5 text-orange-600" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Dining</p>
                        <p className="text-lg font-bold text-slate-800">{formatCurrency(savingsByCategory.restaurant)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="p-2 bg-green-100 rounded-full mb-2">
                            <ShoppingCart className="w-5 h-5 text-green-600" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Groceries</p>
                        <p className="text-lg font-bold text-slate-800">{formatCurrency(savingsByCategory.groceries)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-red-50 border-red-100">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="p-2 bg-red-100 rounded-full mb-2">
                            <Pill className="w-5 h-5 text-red-600" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Medicine</p>
                        <p className="text-lg font-bold text-slate-800">{formatCurrency(savingsByCategory.medicine)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-50 border-yellow-100">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="p-2 bg-yellow-100 rounded-full mb-2">
                            <Zap className="w-5 h-5 text-yellow-600" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Utilities</p>
                        <p className="text-lg font-bold text-slate-800">{formatCurrency(savingsByCategory.utilities)}</p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-100">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="p-2 bg-blue-100 rounded-full mb-2">
                            <Plane className="w-5 h-5 text-blue-600" />
                        </div>
                        <p className="text-xs text-slate-500 font-medium uppercase">Travel</p>
                        <p className="text-lg font-bold text-slate-800">{formatCurrency(savingsByCategory.transport)}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button variant="outline" onClick={loadData} className="flex-1">
                    <RefreshCcw className="w-4 h-4 mr-2" />
                    Refresh Data
                </Button>
                <Button variant="ghost" onClick={handleClearData} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Reset History
                </Button>
            </div>

            <p className="text-xs text-center text-slate-400">
                *Data is stored securely on your device and is not shared with any server.
            </p>
        </div>
    )
}
