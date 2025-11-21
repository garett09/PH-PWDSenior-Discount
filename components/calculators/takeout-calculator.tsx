'use client'

import { useState, useEffect } from 'react'
import { Calculator, Info, AlertTriangle, ShoppingBag } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function TakeoutCalculator({ onResultChange }: { onResultChange?: (result: any) => void }) {
    const [totalBill, setTotalBill] = useState<string>('')
    const [memcPrice, setMemcPrice] = useState<string>('')
    const [pwdCount, setPwdCount] = useState<string>('1')
    const [result, setResult] = useState<any>(null)

    const calculate = () => {
        const bill = parseFloat(totalBill)
        const memc = parseFloat(memcPrice)
        const pwds = parseInt(pwdCount) || 1

        if (isNaN(bill) || isNaN(memc)) return

        // MEMC Rule: Discount applies to the Most Expensive Meal Combination
        // Formula: (MEMC / 1.12) * 0.20

        // However, if the group consists ENTIRELY of PWDs, the discount applies to the total.
        // We'll assume mixed group for this specific calculator as that's the main use case.

        // Calculate VAT Exempt Amount for MEMC
        const memcVatExempt = memc / 1.12

        // Calculate 20% Discount on MEMC
        const discountPerPwd = memcVatExempt * 0.20

        // Total Discount (if multiple PWDs, usually capped at number of MEMCs ordered, but for simplicity we'll assume 1 MEMC per PWD if bill allows)
        // Actually, the rule is usually 1 MEMC per PWD.
        const totalDiscount = discountPerPwd * pwds

        // VAT Exemption on the MEMC portion
        const vatExemptAmount = memcVatExempt * pwds
        const vatAmountToRemove = (memc - memcVatExempt) * pwds

        // Total Deductions
        const totalDeduction = totalDiscount + vatAmountToRemove

        // Final Amount
        const finalAmount = bill - totalDeduction

        setResult({
            originalBill: bill,
            memcPrice: memc,
            discountAmount: totalDiscount,
            vatExemptAmount: vatAmountToRemove,
            totalDeduction: totalDeduction,
            finalAmount: finalAmount,
            isMemc: true
        })

        if (onResultChange) {
            onResultChange({
                discount: totalDiscount,
                finalAmount: finalAmount,
                breakdown: `MEMC Rule Applied: Discount based on ₱${memc} meal`
            })
        }
    }

    return (
        <div className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200 text-blue-800">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle>Takeout / Group Meal Rule (MEMC)</AlertTitle>
                <AlertDescription className="text-xs mt-1">
                    For takeout or group meals where individual shares are unclear, the 20% discount applies to the <strong>Most Expensive Meal Combination (MEMC)</strong>.
                </AlertDescription>
            </Alert>

            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="total-bill">Total Bill Amount</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₱</span>
                        <Input
                            id="total-bill"
                            type="number"
                            placeholder="0.00"
                            value={totalBill}
                            onChange={(e) => setTotalBill(e.target.value)}
                            className="pl-8 h-12 text-lg font-semibold"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="memc-price" className="flex items-center gap-2">
                        Most Expensive Meal Price
                        <span className="text-xs text-slate-500 font-normal">(e.g. 1pc Chicken w/ Drink)</span>
                    </Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₱</span>
                        <Input
                            id="memc-price"
                            type="number"
                            placeholder="0.00"
                            value={memcPrice}
                            onChange={(e) => setMemcPrice(e.target.value)}
                            className="pl-8 h-12 text-lg font-semibold"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="pwd-count">Number of PWDs/Seniors</Label>
                    <Input
                        id="pwd-count"
                        type="number"
                        value={pwdCount}
                        onChange={(e) => setPwdCount(e.target.value)}
                        className="h-12 text-lg font-semibold"
                    />
                </div>

                <Button
                    onClick={calculate}
                    className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Calculate Takeout Discount
                </Button>
            </div>

            {result && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600">Discountable Amount (MEMC):</span>
                        <span className="font-semibold">₱{parseFloat(memcPrice).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                        <span>Less VAT (12%):</span>
                        <span>-₱{result.vatExemptAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-600">
                        <span>Less 20% Discount:</span>
                        <span>-₱{result.discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                        <span className="font-bold text-slate-800">Amount to Pay:</span>
                        <span className="font-bold text-2xl text-blue-600">₱{result.finalAmount.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-2">
                        *Based on BIR RR 7-2010 (MEMC Rule)
                    </p>
                </div>
            )}
        </div>
    )
}
