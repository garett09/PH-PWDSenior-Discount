'use client'

import { useState } from 'react'
import { Calculator, Pill, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function MedicineCalculator({ onResultChange }: { onResultChange?: (result: any) => void }) {
    const [amount, setAmount] = useState<string>('')

    const calculate = () => {
        const val = parseFloat(amount)
        if (!val || val <= 0) return

        // Logic:
        // 1. Remove VAT (12%)
        // 2. Apply 20% Discount on VAT-exclusive amount

        const baseAmount = val / 1.12
        const vatAmount = val - baseAmount

        // VAT Exemption
        const vatDiscount = vatAmount

        // 20% Discount
        const discount20 = baseAmount * 0.20

        const amountToPay = baseAmount - discount20
        const totalSaved = vatDiscount + discount20

        const result = {
            baseAmount,
            vatAmount,
            vatDiscount,
            discount20,
            amountToPay,
            totalSaved
        }

        if (onResultChange) {
            onResultChange(result)
        }
    }

    const formatCurrency = (val: number) =>
        val.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })

    return (
        <div className="space-y-6">
            <div className="p-4 rounded-xl bg-red-50 border-2 border-red-200 text-red-800 text-sm flex gap-3">
                <Info className="w-5 h-5 shrink-0 text-red-600 mt-0.5" />
                <p className="leading-relaxed">
                    <strong>Medicine Discount:</strong> 20% discount + VAT exemption applies to generic and branded medicines, vitamins, and supplements prescribed by a doctor.
                </p>
            </div>

            <div className="space-y-5">
                <div className="space-y-2.5">
                    <Label htmlFor="med-amount" className="text-base font-semibold text-slate-700">Total Bill Amount</Label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₱</span>
                        <Input
                            id="med-amount"
                            type="number"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="pl-10 h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-red-500 focus:ring-red-500/20 rounded-xl touch-manipulation"
                        />
                    </div>
                </div>

                <Button
                    onClick={calculate}
                    className="w-full h-14 text-base md:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 touch-manipulation min-h-[44px]"
                    size="lg"
                >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate Discount
                </Button>
            </div>
        </div>
    )
}
