'use client'

import { useState } from 'react'
import { Percent, Info } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export function ServiceChargeReverseCalculator() {
  const [subtotal, setSubtotal] = useState<string>('716.00')
  const [serviceCharge, setServiceCharge] = useState<string>('28.77')

  const formatCurrency = (val: number) =>
    val.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })

  const subtotalVal = parseFloat(subtotal) || 0
  const scVal = parseFloat(serviceCharge) || 0

  // Calculate different scenarios
  const rateOnGross = subtotalVal > 0 ? (scVal / subtotalVal) * 100 : 0
  const baseAmount = subtotalVal / 1.12
  const rateOnNet = baseAmount > 0 ? (scVal / baseAmount) * 100 : 0

  return (
    <div className="space-y-6">
      <Card className="border-2 border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Percent className="w-5 h-5" />
            Service Charge Percentage Finder
          </CardTitle>
          <CardDescription className="text-blue-700">
            Find out what percentage the service charge was calculated at
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-amber-50 border-amber-200">
            <Info className="w-4 h-4 text-amber-600" />
            <AlertDescription className="text-amber-800 text-sm">
              Enter your receipt amounts to see what percentage the service charge was calculated at.
            </AlertDescription>
          </Alert>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sc-subtotal" className="text-base font-semibold text-slate-700">
                Subtotal (Total Bill)
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₱</span>
                <Input
                  id="sc-subtotal"
                  type="number"
                  inputMode="decimal"
                  placeholder="716.00"
                  value={subtotal}
                  onChange={(e) => setSubtotal(e.target.value)}
                  className="pl-10 h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sc-amount" className="text-base font-semibold text-slate-700">
                Service Charge Amount
              </Label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₱</span>
                <Input
                  id="sc-amount"
                  type="number"
                  inputMode="decimal"
                  placeholder="28.77"
                  value={serviceCharge}
                  onChange={(e) => setServiceCharge(e.target.value)}
                  className="pl-10 h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl"
                />
              </div>
            </div>
          </div>

          {subtotalVal > 0 && scVal > 0 && (
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-white rounded-xl border-2 border-blue-200">
                <p className="text-sm font-semibold text-slate-600 mb-3">Service Charge Percentage:</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">If calculated on Subtotal (with VAT):</p>
                      <p className="text-xs text-slate-500">₱{subtotalVal.toFixed(2)} × ?% = ₱{scVal.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-700">{rateOnGross.toFixed(2)}%</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-semibold text-slate-700">If calculated on Base (without VAT):</p>
                      <p className="text-xs text-slate-500">₱{baseAmount.toFixed(2)} × ?% = ₱{scVal.toFixed(2)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-700">{rateOnNet.toFixed(2)}%</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Tip:</strong> Most restaurants calculate service charge on the base amount (without VAT), which is typically 10%. 
                  If you see a rate close to 10% in the "Base (without VAT)" option, that's likely how it was calculated.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
