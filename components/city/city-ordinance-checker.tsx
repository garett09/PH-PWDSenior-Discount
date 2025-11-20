'use client'

import { useState } from 'react'
import { MapPin, Gift, Car, Film, Heart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CITY_DATA } from '@/lib/city-data'

export function CityOrdinanceChecker() {
    const [selectedCityId, setSelectedCityId] = useState<string>('')

    const selectedCity = CITY_DATA.find(c => c.id === selectedCityId)

    const getIcon = (title: string) => {
        const t = title.toLowerCase()
        if (t.includes('movie')) return Film
        if (t.includes('parking')) return Car
        if (t.includes('cash') || t.includes('allowance')) return Gift
        return Heart
    }

    return (
        <div className="space-y-6">
            <div className="p-4 rounded-xl bg-indigo-50 border-2 border-indigo-200 text-indigo-800 text-sm flex gap-3">
                <MapPin className="w-5 h-5 shrink-0 text-indigo-600 mt-0.5" />
                <p className="leading-relaxed">
                    <strong>Local Benefits:</strong> Many cities offer additional privileges beyond the national law, such as free movies, birthday cash gifts, and parking exemptions.
                </p>
            </div>

            <div className="space-y-2">
                <Select value={selectedCityId} onValueChange={setSelectedCityId}>
                    <SelectTrigger className="h-14 text-lg font-semibold bg-white border-2 border-slate-200 rounded-xl">
                        <SelectValue placeholder="Select your city" />
                    </SelectTrigger>
                    <SelectContent>
                        {CITY_DATA.map((city) => (
                            <SelectItem key={city.id} value={city.id} className="text-base py-3">
                                {city.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedCity ? (
                <div className="grid gap-4 animate-in fade-in slide-in-from-top-4">
                    {selectedCity.benefits.map((benefit, index) => {
                        const Icon = getIcon(benefit.title)
                        return (
                            <Card key={index} className="border-l-4 border-l-indigo-500 shadow-sm hover:shadow-md transition-shadow">
                                <CardContent className="p-4 flex items-start gap-4">
                                    <div className="p-3 rounded-full bg-indigo-100 shrink-0">
                                        <Icon className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base mb-1">{benefit.title}</h4>
                                        <p className="text-sm text-slate-600 leading-relaxed">{benefit.desc}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Select a city to view local ordinances and benefits</p>
                </div>
            )}

            <p className="text-xs text-center text-slate-400 mt-4 px-4 leading-relaxed">
                *This list features selected major cities with significant additional benefits and is not exhaustive. Data is based on the latest available ordinances (2024-2025) and may be subject to change. Please verify with your local OSCA.
            </p>
        </div>
    )
}
