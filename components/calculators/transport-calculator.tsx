'use client'

import { useState } from 'react'
import { Calculator, Plane, Bus, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function TransportCalculator({ onResultChange }: { onResultChange?: (result: any) => void }) {
    const [mode, setMode] = useState<'airsea' | 'land'>('airsea')

    // Air/Sea State
    const [baseFare, setBaseFare] = useState<string>('')
    const [taxesFees, setTaxesFees] = useState<string>('')

    // Land State
    const [landFare, setLandFare] = useState<string>('')

    const calculate = () => {
        let result;

        if (mode === 'airsea') {
            const base = parseFloat(baseFare) || 0
            const taxes = parseFloat(taxesFees) || 0

            if (base <= 0) return

            // Air/Sea Logic:
            // 1. Discount applies to Base Fare only
            // 2. Base Fare is usually VAT inclusive for domestic
            // 3. Remove VAT from Base Fare -> Apply 20% -> Add Taxes back

            const baseExVat = base / 1.12
            const vatAmount = base - baseExVat
            const vatDiscount = vatAmount // Exempt
            const discount20 = baseExVat * 0.20

            const amountToPay = (baseExVat - discount20) + taxes
            const totalSaved = vatDiscount + discount20

            result = {
                baseAmount: baseExVat,
                vatAmount,
                vatDiscount,
                discount20,
                taxesFees: taxes,
                amountToPay,
                totalSaved
            }
        } else {
            const fare = parseFloat(landFare) || 0
            if (fare <= 0) return

            // Land Logic:
            // 1. 20% off the fare.
            // 2. VAT usually not itemized or already exempt/inclusive in a way that 
            //    the discount is just straight 20% off the fare price.
            //    For simplicity and common practice: Straight 20% off.

            const discount20 = fare * 0.20
            const amountToPay = fare - discount20

            result = {
                baseAmount: fare,
                vatAmount: 0,
                vatDiscount: 0,
                discount20,
                taxesFees: 0,
                amountToPay,
                totalSaved: discount20
            }
        }

        if (onResultChange) {
            onResultChange(result)
        }
    }

    const formatCurrency = (val: number) =>
        val.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })

    return (
        <div className="space-y-6">
            <Tabs defaultValue="airsea" onValueChange={(v) => {
                setMode(v as any)
                if (onResultChange) onResultChange(null)
            }}>
                <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-100 p-1.5 rounded-xl mb-6">
                    <TabsTrigger value="airsea" className="rounded-lg text-sm font-semibold transition-all min-h-[44px]">
                        <div className="flex items-center gap-2">
                            <Plane className="w-4 h-4" />
                            Air & Sea
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="land" className="rounded-lg text-sm font-semibold transition-all min-h-[44px]">
                        <div className="flex items-center gap-2">
                            <Bus className="w-4 h-4" />
                            Land (Bus/Train)
                        </div>
                    </TabsTrigger>
                </TabsList>

                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200 text-blue-800 text-sm flex gap-3">
                        <Info className="w-5 h-5 shrink-0 text-blue-600 mt-0.5" />
                        <p className="leading-relaxed">
                            <strong>Transport Discount:</strong>
                            <br />
                            • Air/Sea: 20% discount + VAT exemption applies to the <strong>Base Fare</strong> only. Fuel surcharge, terminal fees, and other taxes are not discounted.
                            <br />
                            • Land: 20% discount on the regular fare.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {mode === 'airsea' ? (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="trans-base" className="text-base font-semibold text-slate-700">
                                        Base Fare Amount
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₱</span>
                                        <Input
                                            id="trans-base"
                                            type="number"
                                            inputMode="decimal"
                                            placeholder="0.00"
                                            value={baseFare}
                                            onChange={(e) => setBaseFare(e.target.value)}
                                            className="pl-10 h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500">Check your ticket breakdown for "Base Fare"</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="trans-taxes" className="text-base font-semibold text-slate-700">
                                        Taxes, Fees & Surcharges
                                    </Label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₱</span>
                                        <Input
                                            id="trans-taxes"
                                            type="number"
                                            inputMode="decimal"
                                            placeholder="0.00"
                                            value={taxesFees}
                                            onChange={(e) => setTaxesFees(e.target.value)}
                                            className="pl-10 h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <Label htmlFor="trans-land" className="text-base font-semibold text-slate-700">
                                    Regular Fare Amount
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₱</span>
                                    <Input
                                        id="trans-land"
                                        type="number"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        value={landFare}
                                        onChange={(e) => setLandFare(e.target.value)}
                                        className="pl-10 h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={calculate}
                        className="w-full h-14 text-base md:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 min-h-[44px]"
                        size="lg"
                    >
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculate Discount
                    </Button>
                </div>
            </Tabs>
        </div>
    )
}
