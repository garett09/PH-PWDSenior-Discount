'use client'

import { useState } from 'react'
import { Calculator, Zap, Droplets, Info } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export function UtilitiesCalculator({ onResultChange }: { onResultChange?: (result: any) => void }) {
    const [type, setType] = useState<'electricity' | 'water'>('electricity')
    const [consumption, setConsumption] = useState<string>('')
    const [amount, setAmount] = useState<string>('')

    const calculate = () => {
        const cons = parseFloat(consumption)
        const amt = parseFloat(amount)

        if (isNaN(cons) || isNaN(amt)) return

        let eligible = false
        let reason = ''

        if (type === 'electricity') {
            // RA 9994/10754: 5% discount if consumption <= 100 kWh
            if (cons <= 100) {
                eligible = true
            } else {
                reason = 'Consumption exceeds 100 kWh limit'
            }
        } else {
            // RA 9994/10754: 5% discount if consumption <= 30 cu.m.
            if (cons <= 30) {
                eligible = true
            } else {
                reason = 'Consumption exceeds 30 cu.m. limit'
            }
        }

        let result;
        if (eligible) {
            const discount5 = amt * 0.05
            result = {
                eligible: true,
                discount5,
                amountToPay: amt - discount5
            }
        } else {
            result = {
                eligible: false,
                discount5: 0,
                amountToPay: amt,
                reason
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
            <Tabs defaultValue="electricity" onValueChange={(v) => {
                setType(v as any)
                if (onResultChange) onResultChange(null)
            }}>
                <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-100 p-1.5 rounded-xl mb-6">
                    <TabsTrigger value="electricity" className="rounded-lg text-sm font-semibold transition-all min-h-[44px]">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Electricity
                        </div>
                    </TabsTrigger>
                    <TabsTrigger value="water" className="rounded-lg text-sm font-semibold transition-all min-h-[44px]">
                        <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4" />
                            Water
                        </div>
                    </TabsTrigger>
                </TabsList>

                <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-200 text-amber-800 text-sm flex gap-3">
                        <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                        <p className="leading-relaxed">
                            <strong>5% Discount Requirements:</strong>
                            <br />
                            • Electricity: Consumption must not exceed <strong>100 kWh</strong>
                            <br />
                            • Water: Consumption must not exceed <strong>30 cu.m.</strong>
                            <br />
                            • Meter must be registered in the name of the PWD/Senior Citizen
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="util-consumption" className="text-base font-semibold text-slate-700">
                                Consumption ({type === 'electricity' ? 'kWh' : 'cu.m.'})
                            </Label>
                            <Input
                                id="util-consumption"
                                type="number"
                                inputMode="decimal"
                                placeholder={type === 'electricity' ? '95' : '25'}
                                value={consumption}
                                onChange={(e) => setConsumption(e.target.value)}
                                className="h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="util-amount" className="text-base font-semibold text-slate-700">
                                Bill Amount
                            </Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₱</span>
                                <Input
                                    id="util-amount"
                                    type="number"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-10 h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl"
                                />
                            </div>
                        </div>
                    </div>

                    <Button
                        type="button"
                        onClick={calculate}
                        className="w-full h-14 text-base md:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 min-h-[44px]"
                        size="lg"
                    >
                        <Calculator className="w-5 h-5 mr-2" />
                        Check Eligibility & Calculate
                    </Button>
                </div>
            </Tabs>
        </div>
    )
}
