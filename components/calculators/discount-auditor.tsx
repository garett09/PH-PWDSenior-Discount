'use client'

import { useState } from 'react'
import { Calculator, CheckCircle, XCircle, AlertTriangle, PartyPopper, Users, HelpCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export function DiscountAuditor() {
    const [totalBill, setTotalBill] = useState<string>('')
    const [amountPaid, setAmountPaid] = useState<string>('')
    const [numPeople, setNumPeople] = useState<string>('1')
    const [result, setResult] = useState<any>(null)

    const audit = () => {
        const bill = parseFloat(totalBill)
        const paid = parseFloat(amountPaid)
        const people = Math.max(parseInt(numPeople) || 1, 1)

        if (isNaN(bill) || isNaN(paid)) return

        // Base calculations for 1 PWD in a group of N
        const baseAmount = bill / 1.12
        const vatAmount = bill - baseAmount

        // Per person shares
        const basePerPerson = baseAmount / people
        const vatPerPerson = vatAmount / people

        // Expected Discount (1 PWD)
        // 1. VAT Exemption on their share
        const vatDiscount = vatPerPerson
        // 2. 20% Discount on their share (net of VAT)
        const discount20 = basePerPerson * 0.20

        const totalExpectedDiscount = vatDiscount + discount20
        const expectedToPay = bill - totalExpectedDiscount

        const difference = paid - expectedToPay
        // Allow larger threshold for rounding differences in manual computations
        const threshold = 5.0

        let status = ''
        let message = ''
        let icon = null
        let colorClass = ''

        // Analysis Logic
        if (Math.abs(difference) <= threshold) {
            status = 'CORRECT'
            message = 'The discount matches the standard calculation perfectly.'
            icon = <CheckCircle className="w-6 h-6" />
            colorClass = 'bg-green-50 border-green-200 text-green-800'
        } else if (difference < -threshold) {
            status = 'GENEROUS'
            message = `Wow! You paid ₱${Math.abs(difference).toFixed(2)} LESS than expected. They might have waived service charges or given a flat discount!`
            icon = <PartyPopper className="w-6 h-6" />
            colorClass = 'bg-purple-50 border-purple-200 text-purple-800'
        } else {
            // It's HIGHER than expected. Let's diagnose.
            status = 'SHORTCHANGED?'
            colorClass = 'bg-amber-50 border-amber-200 text-amber-800'
            icon = <AlertTriangle className="w-6 h-6" />

            const actualDiscount = bill - paid

            // Check for Flat Discount (e.g. exactly 50, 100 off)
            // We check if the actual discount is a multiple of 50
            if (actualDiscount > 0 && actualDiscount % 50 === 0) {
                message = `Suspicious! They gave you a flat discount of ₱${actualDiscount}. The law requires a percentage-based discount (20% + VAT exemption).`
            }
            // Check for VAT Only (No 20%)
            // Expected Pay if VAT only = Bill - VAT Discount
            else if (Math.abs(paid - (bill - vatDiscount)) < threshold) {
                message = `It looks like they only removed the VAT but didn't give you the 20% discount.`
            }
            // Check for "One Item Policy" or severe under-discounting
            else if (actualDiscount < totalExpectedDiscount * 0.5) {
                message = `The discount is significantly lower than expected (less than half). They might be applying it to only one item instead of your full share.`
            }
            else {
                message = `You paid ₱${difference.toFixed(2)} MORE than expected. This could be due to service charges (which should also be discounted/exempted) or calculation errors.`
            }
        }

        setResult({
            status,
            message,
            icon,
            colorClass,
            expected: expectedToPay,
            difference,
            details: {
                bill, people, expectedDiscount: totalExpectedDiscount
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="grid gap-4">
                <div className="space-y-2">
                    <Label htmlFor="audit-bill">Total Bill Amount</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₱</span>
                        <Input
                            id="audit-bill"
                            type="number"
                            placeholder="0.00"
                            value={totalBill}
                            onChange={(e) => setTotalBill(e.target.value)}
                            className="pl-8 h-12 text-lg font-semibold"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="audit-paid">Amount Paid</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₱</span>
                            <Input
                                id="audit-paid"
                                type="number"
                                placeholder="0.00"
                                value={amountPaid}
                                onChange={(e) => setAmountPaid(e.target.value)}
                                className="pl-8 h-12 text-lg font-semibold"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="audit-people">Total People</Label>
                        <div className="relative">
                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <Input
                                id="audit-people"
                                type="number"
                                min="1"
                                placeholder="1"
                                value={numPeople}
                                onChange={(e) => setNumPeople(e.target.value)}
                                className="pl-9 h-12 text-lg font-semibold"
                            />
                        </div>
                    </div>
                </div>

                <Button
                    onClick={audit}
                    className="w-full h-12 text-lg font-bold bg-slate-800 hover:bg-slate-900 text-white"
                >
                    <Calculator className="w-5 h-5 mr-2" />
                    Audit Receipt
                </Button>
            </div>

            {result && (
                <Alert className={`mt-4 ${result.colorClass} animate-in fade-in slide-in-from-top-2`}>
                    <div className="flex items-start gap-3">
                        {result.icon}
                        <div className="flex-1">
                            <AlertTitle className="font-bold text-lg">{result.status}</AlertTitle>
                            <AlertDescription className="mt-1 text-base leading-relaxed">
                                {result.message}
                                <div className="mt-3 p-3 bg-white/50 rounded-lg text-sm border border-black/5">
                                    <div className="flex justify-between mb-1">
                                        <span>Expected Pay:</span>
                                        <span className="font-bold">₱{result.expected.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xs opacity-70">
                                        <span>Difference:</span>
                                        <span>{result.difference > 0 ? '+' : ''}₱{result.difference.toFixed(2)}</span>
                                    </div>
                                </div>
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>
            )}
        </div>
    )
}
