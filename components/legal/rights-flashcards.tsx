'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { BookOpen, Gavel, AlertCircle, Percent, Receipt, Users, ExternalLink } from 'lucide-react'

const RIGHTS = [
    {
        id: 'vat-exempt',
        title: 'VAT Exemption',
        icon: Receipt,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        shortDesc: 'Exempt from 12% VAT on goods & services.',
        fullText: `
      **Republic Act No. 10754, Section 1:**
      
      "At least twenty percent (20%) discount and exemption from the value-added tax (VAT), if applicable, on the sale of the following goods and services..."
      
      **Explanation:**
      The 20% discount is applied to the amount AFTER the 12% VAT is removed. You should not be paying VAT on the portion of the bill that you are consuming.
    `,
        sourceUrl: 'https://ncda.gov.ph/disability-laws/republic-acts/republic-act-no-10754-an-act-expanding-the-benefits-and-privileges-of-persons-with-disability-pwd/'
    },
    {
        id: 'no-service-charge',
        title: 'No Service Charge',
        icon: AlertCircle,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        shortDesc: 'Fully exempt from service charges.',
        fullText: `
      **Republic Act No. 10754, Section 32:**
      
      PWDs are entitled to discounts and exemptions on "fees and charges relative to the utilization of all services in hotels and similar lodging establishments; restaurants and recreation centers."
      
      **DOJ Opinion No. 45, Series of 2024:**
      
      PWDs and Senior Citizens are exempt from service charges on their proportional share of consumption.
      
      **What is a Service Charge?**
      
      An additional fee (typically 10%) that restaurants and hotels add to your bill for service. This is separate from tips and is usually mandatory.
      
      **How the Exemption Works:**
      
      • **Single Purchase:** You are FULLY EXEMPT—no service charge should be charged.
      
      • **Group Dining:** Service charge is divided among all diners. Your share is FULLY EXEMPT. Only regular diners pay their share.
      
      **Important:** This is a complete exemption, not a discount. You should not pay any service charge on your portion.
    `,
        sourceUrl: 'https://ncda.gov.ph/disability-laws/republic-acts/republic-act-no-10754-an-act-expanding-the-benefits-and-privileges-of-persons-with-disability-pwd/'
    },
    {
        id: '20-percent',
        title: '20% Discount',
        icon: Percent,
        color: 'text-green-600',
        bgColor: 'bg-green-100',
        shortDesc: '20% off on VAT-exclusive price.',
        fullText: `
      **Republic Act No. 9994 (Senior Citizens) & RA 10754 (PWDs):**
      
      Grants a 20% discount on the purchase of medicines, professional fees of physicians, medical/dental services, diagnostic and laboratory fees, fares for domestic air and sea travel, and public land transportation fares.
    `,
        sourceUrl: 'https://ncda.gov.ph/disability-laws/republic-acts/republic-act-no-10754-an-act-expanding-the-benefits-and-privileges-of-persons-with-disability-pwd/'
    },
    {
        id: 'express-lane',
        title: 'Express Lane',
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        shortDesc: 'Priority lanes in all establishments.',
        fullText: `
      **Republic Act No. 9994 & RA 10754:**
      
      "Provision of express lanes for senior citizens and persons with disability in all commercial and government establishments; in the absence thereof, priority shall be given to them."
    `,
        sourceUrl: 'https://ncda.gov.ph/disability-laws/republic-acts/republic-act-no-10754-an-act-expanding-the-benefits-and-privileges-of-persons-with-disability-pwd/'
    },
    {
        id: 'city-parking',
        title: 'Parking Exemption',
        icon: Gavel,
        color: 'text-slate-600',
        bgColor: 'bg-slate-100',
        shortDesc: 'Free parking in some cities (Check local ordinance).',
        fullText: `
      **Local Ordinances (Varies by City):**
      
      Many cities like Makati, Quezon City, Manila, and Cebu have ordinances granting free parking for the first 3-4 hours or flat rates for Senior Citizens and PWDs.
      
      *Note: This is not a national law but a local privilege. Always check with the specific city ordinance.*
    `,
        sourceUrl: null
    },
    {
        id: 'grocery-cap',
        title: 'Grocery Cap',
        icon: BookOpen,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-100',
        shortDesc: '5% off up to ₱1,300/week (₱65 discount).',
        fullText: `
      **DTI-DA-DOE Joint Administrative Order No. 17-02:**
      
      "Senior Citizens and PWDs are entitled to a special discount of 5% of the regular retail price of Basic Necessities and Prime Commodities (BNPC), without carryover of the unused amount."
      
      **Cap:**
      The total amount of purchase shall not exceed ₱1,300 per week. The maximum discount is ₱65 per week.
    `,
        sourceUrl: null
    },
    {
        id: 'takeout-memc',
        title: 'Takeout & Delivery',
        icon: Receipt,
        color: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        shortDesc: '20% off on Most Expensive Meal (MEMC).',
        fullText: `
      **BIR Revenue Regulations No. 7-2010 & RMC 71-2022:**
      
      For takeout, delivery, and drive-thru orders where the PWD/Senior is not present or individual consumption cannot be determined, the **Most Expensive Meal Combination (MEMC)** rule applies.
      
      **The Rule:**
      The 20% discount and VAT exemption shall apply to the **Most Expensive Meal Combination (MEMC)** composed of a single serving of food with beverage.
      
      **Example:**
      If you order a Family Bundle (₱1,500) and a separate Burger Meal (₱200), the discount applies to the Burger Meal (if it's the biggest single serving) or a prorated portion of the bundle equivalent to one person's meal.
      
      **Exclusive Use:**
      The discount is for the exclusive use of the PWD/Senior Citizen. Group meals are not fully discounted, only the share of the PWD/Senior.
    `,
        sourceUrl: 'https://www.bir.gov.ph/images/bir_files/internal_communications_2/RMC%20No%2071-2022.pdf'
    }
]

export function RightsFlashcards() {
    const [selectedRight, setSelectedRight] = useState<typeof RIGHTS[0] | null>(null)

    return (
        <div className="grid grid-cols-2 gap-4">
            {RIGHTS.map((right) => (
                <Card
                    key={right.id}
                    className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-blue-300 active:scale-95"
                    onClick={() => setSelectedRight(right)}
                >
                    <CardContent className="p-4 flex flex-col items-center text-center space-y-3">
                        <div className={`p-3 rounded-full ${right.bgColor}`}>
                            <right.icon className={`w-6 h-6 ${right.color}`} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-sm md:text-base">{right.title}</h3>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{right.shortDesc}</p>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Dialog open={!!selectedRight} onOpenChange={(open) => !open && setSelectedRight(null)}>
                <DialogContent className="max-w-md rounded-xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            {selectedRight && (
                                <div className={`p-2 rounded-lg ${selectedRight.bgColor}`}>
                                    <selectedRight.icon className={`w-5 h-5 ${selectedRight.color}`} />
                                </div>
                            )}
                            <DialogTitle>{selectedRight?.title}</DialogTitle>
                        </div>
                        <DialogDescription>
                            Know your rights under the law.
                        </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[60vh] mt-2">
                        <div className="text-slate-700 text-sm leading-relaxed pr-6">
                            {selectedRight?.fullText.split('\n').map((line, lineIndex) => {
                                const trimmedLine = line.trim()

                                // Skip empty lines
                                if (!trimmedLine) return <div key={lineIndex} className="h-2" />

                                // Handle bold headings (lines starting with **)
                                if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
                                    const heading = trimmedLine.replace(/\*\*/g, '')
                                    return (
                                        <h4 key={lineIndex} className="font-bold text-slate-900 text-base mt-4 mb-2 first:mt-0">
                                            {heading}
                                        </h4>
                                    )
                                }

                                // Handle bullet points
                                if (trimmedLine.startsWith('•')) {
                                    const bulletContent = trimmedLine.substring(1).trim()
                                    // Check if it contains bold text
                                    const parts = bulletContent.split('**')
                                    return (
                                        <div key={lineIndex} className="flex gap-2 mb-1.5">
                                            <span className="text-slate-900 mt-0.5">•</span>
                                            <div className="flex-1">
                                                {parts.map((part, partIndex) =>
                                                    partIndex % 2 === 1 ? (
                                                        <strong key={partIndex} className="text-slate-900">{part}</strong>
                                                    ) : (
                                                        <span key={partIndex}>{part}</span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
                                }

                                // Regular paragraph text
                                const parts = trimmedLine.split('**')
                                return (
                                    <p key={lineIndex} className="mb-2 text-slate-700">
                                        {parts.map((part, partIndex) =>
                                            partIndex % 2 === 1 ? (
                                                <strong key={partIndex} className="text-slate-900">{part}</strong>
                                            ) : (
                                                <span key={partIndex}>{part}</span>
                                            )
                                        )}
                                    </p>
                                )
                            })}

                            {selectedRight?.sourceUrl && (
                                <div className="mt-6 pt-4 border-t border-slate-200">
                                    <a
                                        href={selectedRight.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        View Official Source
                                    </a>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
