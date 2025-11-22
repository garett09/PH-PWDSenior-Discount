'use client'

import { useState } from 'react'
import { FileText, Copy, Check, Send } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function ComplaintGenerator() {
    const [merchant, setMerchant] = useState('')
    const [date, setDate] = useState('')
    const [violation, setViolation] = useState('refusal')
    const [details, setDetails] = useState('')
    const [generated, setGenerated] = useState('')
    const [copied, setCopied] = useState(false)

    const generateComplaint = () => {
        const violationText = {
            refusal: 'refusal to grant the mandated 20% discount and/or VAT exemption',
            memc_refusal: 'refusal to apply the 20% discount on the Most Expensive Meal Combination (MEMC) for takeout/delivery orders as mandated by RR 7-2010',
            service_charge: 'illegal collection of service charge despite exemption',
            express_lane: 'failure to provide an express lane or priority service',
            id_rejection: 'refusal to honor my valid PWD/Senior Citizen ID',
            flat_discount: 'application of a flat discount amount instead of the mandated 20% discount and VAT exemption',
            one_item_policy: 'application of discount to only one item despite the order being for personal consumption',
            vat_only: 'granting of VAT exemption only without the corresponding 20% discount'
        }[violation]

        const law = 'Republic Act No. 10754 (An Act Expanding the Benefits and Privileges of Persons with Disability) and/or Republic Act No. 9994 (Expanded Senior Citizens Act of 2010)'

        const letter = `Subject: Formal Complaint Against ${merchant || '[Merchant Name]'} for Violation of ${law}

To the Office for Senior Citizens Affairs (OSCA) / Persons with Disability Affairs Office (PDAO) / Department of Trade and Industry (DTI):

I am writing to formally file a complaint against ${merchant || '[Merchant Name]'} located at [Merchant Address] regarding an incident that occurred on ${date || '[Date]'}.

The nature of the violation is the ${violationText}.

Details of the Incident:
${details || '[Describe what happened here...]'}

This action is a clear violation of ${law}, specifically the provisions mandating privileges for Senior Citizens and Persons with Disability.

I have attached copies of the receipt and my ID as proof of this transaction and my eligibility.

I respectfully request your office to investigate this matter and take appropriate action to ensure this establishment complies with the law.

Sincerely,

[Your Name]
[Your Contact Number]
[Your ID Number]`

        setGenerated(letter)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generated)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="comp-merchant">Merchant Name</Label>
                        <Input
                            id="comp-merchant"
                            placeholder="e.g. Jollibee, Mercury Drug"
                            value={merchant}
                            onChange={(e) => setMerchant(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="comp-date">Date of Incident</Label>
                        <Input
                            id="comp-date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="comp-violation">Violation Type</Label>
                    <Select value={violation} onValueChange={setViolation}>
                        <SelectTrigger id="comp-violation">
                            <SelectValue placeholder="Select violation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="refusal">Refused Discount/VAT Exemption</SelectItem>
                            <SelectItem value="memc_refusal">Refused MEMC Rule (Takeout)</SelectItem>
                            <SelectItem value="service_charge">Charged Service Charge</SelectItem>
                            <SelectItem value="express_lane">No Express Lane/Priority</SelectItem>
                            <SelectItem value="id_rejection">Refused Valid ID</SelectItem>
                            <SelectItem value="flat_discount">Flat Discount Applied (e.g. ₱50 off)</SelectItem>
                            <SelectItem value="one_item_policy">One Item Policy (Personal Meal)</SelectItem>
                            <SelectItem value="vat_only">VAT Exemption Only (No 20%)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="comp-details">Incident Details</Label>
                    <Textarea
                        id="comp-details"
                        placeholder="Briefly describe what happened..."
                        value={details}
                        onChange={(e) => setDetails(e.target.value)}
                        className="h-24"
                    />
                </div>

                <Button onClick={generateComplaint} className="w-full bg-slate-800 hover:bg-slate-900">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Complaint Letter
                </Button>
            </div>

            {generated && (
                <Card className="bg-slate-50 border-2 border-slate-200 animate-in fade-in slide-in-from-top-4">
                    <CardHeader className="pb-2 border-b border-slate-200 bg-white rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-bold text-slate-800">Generated Letter</CardTitle>
                            <Button variant="outline" size="sm" onClick={copyToClipboard} className="h-8">
                                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                                {copied ? 'Copied' : 'Copy Text'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <pre className="whitespace-pre-wrap text-xs sm:text-sm font-mono text-slate-700 leading-relaxed">
                            {generated}
                        </pre>
                        <div className="mt-4 flex gap-2">
                            <Button variant="default" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => {
                                const subject = `Complaint: Violation of RA 10754 - ${merchant || '[Merchant Name]'}`
                                window.open(`mailto:consumer@dti.gov.ph?cc=8888@gov.ph&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(generated)}`)
                            }}>
                                <Send className="w-4 h-4 mr-2" />
                                Send to DTI & 8888
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
