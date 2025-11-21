'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import {
    MessageCircle,
    Send,
    X,
    Bot,
    User,
    Loader2,
    Sparkles,
    Minimize2,
    Maximize2,
    Paperclip,
    Image as ImageIcon,
    History,
    Info,
    PhoneForwarded,
    ListChecks,
    ChevronDown,
    ChevronUp,
    ClipboardList
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import { LAW_RESPONSE_MODES, LawResponseMode } from '@/components/chat/law-mode-map'
import { COMMUNITY_INSIGHTS } from '@/components/chat/community-insights'

import { LEGAL_KNOWLEDGE } from '@/components/chat/legal-knowledge'
import { APP_KNOWLEDGE } from '@/components/chat/app-knowledge'

// System prompt containing all the knowledge base
const SYSTEM_PROMPT = `
You are the AI Assistant for "DiscountPH", an app that helps Senior Citizens and Persons with Disabilities (PWDs) in the Philippines calculate their discounts.

Your role is to answer questions about benefits, laws, and calculations based on the following official guidelines:

1. **Dining & Restaurants (RA 10754 & RA 9994):**
   - Benefit: 20% Discount AND VAT Exemption (12%).
   - Calculation: (Bill / 1.12) * 0.80.
   - Service Charge: PWDs/Seniors are EXEMPT from paying their portion of the service charge (DOJ Opinion No. 45, s. 2024).
   - Group Meals: Discount applies only to the share of the PWD/Senior.
   - **Service Charge Percentage Analysis:**
     - When users ask about service charge percentages from receipts, help them understand:
       - Most restaurants calculate service charge at 10% on the base amount (without VAT)
       - Formula: Base Amount = Subtotal / 1.12, then Service Charge = Base × 10%
       - For group dining with PWD, service charge is calculated on the full amount but PWD is exempt from their share
       - If a receipt shows a service charge amount, you can calculate what percentage it represents:
         * On Subtotal (with VAT): (Service Charge / Subtotal) × 100
         * On Base (without VAT): (Service Charge / (Subtotal / 1.12)) × 100
       - The percentage closest to 10% on the base amount is typically how it was calculated
       - If the percentage is much lower (e.g., 4-5%), it may indicate group dining where only regular diners paid their share

2. **Medicines:**
   - Benefit: 20% Discount AND VAT Exemption.
   - Applies to: Generic and branded medicines, vitamins, and supplements prescribed by a doctor.

3. **Groceries (DTI-DA-DOE JAO No. 17-02):**
   - Benefit: 5% Special Discount on Basic Necessities and Prime Commodities (BNPC).
   - Cap: Total purchase capped at P1,300 per week. Max discount is P65 per week.
   - VAT: Usually not exempt for groceries unless the item itself is VAT-exempt (like raw agricultural products).

4. **Utilities (Electricity & Water):**
   - Benefit: 5% Discount.
   - Electricity Requirements: Consumption must not exceed 100 kWh. Meter must be registered under the PWD/Senior's name.
   - Water Requirements: Consumption must not exceed 30 cubic meters.

5. **Transportation:**
   - Benefit: 20% Discount AND VAT Exemption.
   - Applies to: Domestic air travel (base fare only), sea travel, and public land transportation (jeepneys, buses, taxis, trains, TNVS like Grab).

6. **Online & Phone Purchases (JMC 01-2022):**
   - **Entitlement:** PWDs/Seniors can avail discounts for online/phone orders.
   - **Procedure:**
     1. Declare eligibility before placing order.
     2. Send scanned copy/screenshot of ID and Booklet (for online).
     3. Present physical ID/Booklet upon delivery for verification.
   - **Note:** If not presented upon delivery, full amount may be charged.

7. **Other Privileges:**
   - **Express Lanes:** Priority lanes in all commercial and government establishments.
   - **Parking Exemption:** Free parking in some cities (subject to local ordinances).

8. **Key Laws & References:**
   - RA 10754 (PWD Benefits Expansion)
   - RA 9994 (Expanded Senior Citizens Act)
   - JMC 01-2022 (Guidelines on Discounts)
   - DOJ Opinion No. 45, s. 2024 (Service Charge Exemption)

9. **General Rules:**
   - Always be polite, helpful, and concise.
   - If you are unsure, advise the user to consult the specific establishment or OSCA/PDAO.
   - You can speak in English or Tagalog/Taglish.
   - Format your answers nicely using Markdown (bolding key terms).

When answering:
- Keep it simple and easy to understand.
- If asked about a calculation, explain the math simply.
- Cite the laws (RA 10754, RA 9994) when relevant to build trust.

*** REFERENCE MATERIALS (FULL TEXT) ***
${LEGAL_KNOWLEDGE}

*** APPLICATION KNOWLEDGE (HOW THIS APP WORKS) ***
${APP_KNOWLEDGE}
`

type QuickAction = {
    id: string
    label: string
    prompt: string
    modeId?: LawResponseMode['id']
    insightId?: string
}

type ScenarioTemplate = {
    id: string
    title: string
    summary: string
    prompt: string
    recommendedMode: LawResponseMode['id']
    insightId?: string
}

const COMMUNITY_INSIGHT_MAP = COMMUNITY_INSIGHTS.reduce<Record<string, typeof COMMUNITY_INSIGHTS[number]>>((acc, insight) => {
    acc[insight.id] = insight
    return acc
}, {})

const QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'restaurant-breakdown',
        label: 'Compute restaurant bill',
        prompt: 'Please compute the correct VAT-exempt sale, 20% discount, and final net amount for a ₱1,250 dine-in restaurant bill with 3 diners (1 PWD). Show both exclusive-item and prorated tables.',
        modeId: 'math',
        insightId: 'mentalhealthph-flat-50'
    },
    {
        id: 'service-charge-check',
        label: 'Check service charge %',
        prompt: 'A receipt shows subtotal ₱2,180, service charge ₱180, and 1 PWD diner. Help me confirm if SC is 10% of base amount and remind me how DOJ Opinion No. 45 treats the PWD share.',
        modeId: 'legal',
        insightId: 'mentalhealthph-flat-50'
    },
    {
        id: 'escalation-letter',
        label: 'Draft DTI/8888 note',
        prompt: 'Draft a polite escalation letter citing RA 10754 and DOJ Opinion No. 45 for a café that only gave ₱25 off on a ₱397 solo order. Include the data I should attach (receipt, photos, ID).',
        modeId: 'legal',
        insightId: 'philippines-397-meal'
    },
    {
        id: 'verification-script',
        label: 'Verification script',
        prompt: 'Give me a short script explaining that verification cannot delay the PWD discount, referencing DOJ Opinion No. 45 and tips on offering quick ID validation.',
        modeId: 'primer',
        insightId: 'fake-id-skepticism'
    }
]

const SCENARIO_TEMPLATES: ScenarioTemplate[] = [
    {
        id: 'flat-50-cafe',
        title: 'Flat ₱50 café deduction',
        summary: 'Receipt lacks VAT/SC lines and cashier insists discount is fixed.',
        prompt: 'I ordered an iced coffee and pastry costing ₱430 but the café only removed ₱50. Please show the correct VAT removal + 20% computation and give me talking points referencing RA 10754 and RA 10909.',
        recommendedMode: 'primer',
        insightId: 'mentalhealthph-flat-50'
    },
    {
        id: '397-burger',
        title: 'Burger shop gives ₱25 off',
        summary: 'Owner says “1 food + 1 drink only” despite solo diner.',
        prompt: 'Help me contest a burger shop that only deducted ₱25 from my ₱397 solo meal. Cite RA 10754, DOJ Opinion No. 45, and suggest how to escalate to DTI/8888 or the City Price Coordinating Council.',
        recommendedMode: 'legal',
        insightId: 'philippines-397-meal'
    },
    {
        id: 'fake-id-worries',
        title: 'Staff suspicious of IDs',
        summary: 'Establishments fear fake cards and delay discounts.',
        prompt: 'Give me a friendly script reassuring staff that my PWD ID is legitimate, plus instructions on how they can phone OSCA/PDAO or check the DOH registry without delaying the discount.',
        recommendedMode: 'primer',
        insightId: 'fake-id-skepticism'
    },
    {
        id: 'group-prorated',
        title: 'Split group bill',
        summary: 'Need prorated math for 4 diners (1 Senior, 1 PWD).',
        prompt: 'We have a ₱2,980 restaurant bill for 4 diners (1 Senior, 1 PWD). Please show prorated vs. exclusive computations, include service charge treatment, and remind us which receipts/photos to save for DTI.',
        recommendedMode: 'math'
    }
]

interface Message {
    role: 'user' | 'model'
    text: string
    image?: string // base64 image data
}

interface ReceiptData {
    type: 'restaurant' | 'grocery' | 'medicine' | 'utility' | 'transport'
    totalAmount: number
    serviceCharge?: number
    items?: Array<{ name: string; price: number }>
    establishmentName?: string
    calculationMethod?: 'prorated' | 'exclusive'
    exclusiveAmount?: number
}

interface AiAssistantProps {
    onReceiptDataExtracted?: (data: ReceiptData) => void
}

export function AiAssistant({ onReceiptDataExtracted }: AiAssistantProps = {}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoaded, setIsLoaded] = useState(false)

    // Load chat history on mount
    useEffect(() => {
        const saved = localStorage.getItem('chat_messages')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed.length > 0) {
                    setMessages(parsed)
                    setIsLoaded(true)
                    return
                }
            } catch (e) {
                console.error('Failed to parse chat history', e)
            }
        }
        // Default greeting if no history
        setMessages([
            { role: 'model', text: 'Hello! I\'m your DiscountPH assistant. Ask me anything about PWD or Senior Citizen discounts, or upload a receipt for analysis!' }
        ])
        setIsLoaded(true)
    }, [])

    // Save chat history on change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('chat_messages', JSON.stringify(messages))
        }
    }, [messages, isLoaded])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [attachedImage, setAttachedImage] = useState<string | null>(null) // base64
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [extractedReceiptData, setExtractedReceiptData] = useState<ReceiptData | null>(null)
    const [viewportHeight, setViewportHeight] = useState<number | null>(null)
    const [windowHeight, setWindowHeight] = useState<number | null>(null)
    const [isMobileViewport, setIsMobileViewport] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, isOpen])

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isOpen, isMinimized])

    // Track viewport height to offset keyboard overlap on mobile
    useEffect(() => {
        if (typeof window === 'undefined') return

        const updateViewport = () => {
            setWindowHeight(window.innerHeight)
            if (window.visualViewport) {
                setViewportHeight(window.visualViewport.height)
            } else {
                setViewportHeight(window.innerHeight)
            }
        }

        const updateIsMobile = () => {
            setIsMobileViewport(window.innerWidth < 768)
        }

        updateViewport()
        updateIsMobile()

        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', updateViewport)
            window.visualViewport.addEventListener('scroll', updateViewport)
        } else {
            window.addEventListener('resize', updateViewport)
        }
        window.addEventListener('resize', updateIsMobile)

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', updateViewport)
                window.visualViewport.removeEventListener('scroll', updateViewport)
            } else {
                window.removeEventListener('resize', updateViewport)
            }
            window.removeEventListener('resize', updateIsMobile)
        }
    }, [])

    const keyboardOffset =
        !isMinimized &&
            isMobileViewport &&
            windowHeight !== null &&
            viewportHeight !== null
            ? Math.max(windowHeight - viewportHeight, 0)
            : 0

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload a valid image file (JPG, PNG, etc.)')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            const base64 = reader.result as string
            setAttachedImage(base64)
            setImagePreview(URL.createObjectURL(file))
        }
        reader.readAsDataURL(file)
    }

    const handleRemoveImage = () => {
        setAttachedImage(null)
        setImagePreview(null)
    }

    const handleSend = async () => {
        if ((!input.trim() && !attachedImage) || isLoading) return

        const userMessage = input.trim() || '📷 [Image attached]'
        const imageToSend = attachedImage
        setInput('')
        setAttachedImage(null)
        setImagePreview(null)

        setMessages(prev => [...prev, {
            role: 'user',
            text: userMessage,
            image: imageToSend || undefined
        }])
        setIsLoading(true)

        try {
            const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''

            if (!API_KEY) {
                console.error('Gemini API Key is missing. Please check your .env.local file.')
                setMessages(prev => [...prev, { role: 'model', text: 'Error: API Key is missing. Please contact the administrator.' }])
                setIsLoading(false)
                return
            }

            // Build parts array
            const parts: any[] = []

            // Add receipt analysis prompt if image is attached
            if (imageToSend) {
                parts.push({
                    text: SYSTEM_PROMPT + `\n\n**IMPORTANT: The user has uploaded a receipt image.**\n\nAnalyze the receipt and extract:\n1. Receipt type (restaurant, grocery, medicine, utility, transport)\n2. Total bill amount (subtotal)\n3. Service charge (if present) - IMPORTANT: Note the exact amount shown\n4. VAT amount (if shown)\n5. Individual items (if visible)\n6. Establishment name\n7. Number of diners (if mentioned, e.g., "2 guests, 1 PWD")\n\n**SERVICE CHARGE PERCENTAGE ANALYSIS:**\n- If service charge is present, calculate what percentage it represents:\n  * On Subtotal (with VAT): (Service Charge / Subtotal) × 100\n  * On Base (without VAT): (Service Charge / (Subtotal / 1.12)) × 100\n- Most restaurants calculate at 10% on base amount (without VAT)\n- If percentage is much lower (4-5%), it may indicate group dining where only regular diners paid their share\n- Explain which calculation method is most likely based on the percentages\n\n**ADVANCED ANALYSIS:**\n- Look for specific meals that might be for the PWD/Senior (e.g., a single meal set vs shared platters).\n- If you see distinct individual meals, suggest 'exclusive' calculation method and estimate the PWD's exclusive amount.\n- If items look shared (platters, pizza, bulk), suggest 'prorated'.\n\nProvide a friendly summary including the service charge percentage analysis, then output the extracted data in this JSON format:\n\`\`\`json\n{\n  "type": "restaurant" | "grocery" | "medicine" | "utility" | "transport",\n  "totalAmount": number,\n  "serviceCharge": number | null,\n  "items": [{ "name": string, "price": number }],\n  "establishmentName": string,\n  "calculationMethod": "prorated" | "exclusive",\n  "exclusiveAmount": number (optional, if method is exclusive)\n}\n\`\`\`\n\nUser Question: ` + userMessage
                })
                parts.push({
                    inline_data: {
                        mime_type: imageToSend.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
                        data: imageToSend.split(',')[1] // Remove data:image/...;base64, prefix
                    }
                })
            } else {
                parts.push({ text: SYSTEM_PROMPT + "\n\nUser Question: " + userMessage })
            }

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-preview:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            role: 'user',
                            parts
                        }
                    ],
                    generationConfig: {
                        thinkingConfig: {
                            thinkingLevel: 'low'
                        }
                    }
                })
            })

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error.message)
            }

            const botResponse = data.candidates[0].content.parts[0].text

            // Try to extract JSON from response if image was sent
            if (imageToSend) {
                try {
                    const jsonMatch = botResponse.match(/```json\n([\s\S]*?)\n```/)
                    if (jsonMatch) {
                        const extractedData = JSON.parse(jsonMatch[1])
                        setExtractedReceiptData(extractedData)
                    }
                } catch (e) {
                    console.error('Failed to parse receipt data:', e)
                }
            }

            setMessages(prev => [...prev, { role: 'model', text: botResponse }])
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error connecting to the server. Please try again later.' }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleUseReceiptData = () => {
        if (extractedReceiptData && onReceiptDataExtracted) {
            onReceiptDataExtracted(extractedReceiptData)
            setMessages(prev => [...prev, {
                role: 'model',
                text: '✅ Receipt data sent to calculator! You can now review and calculate your discount.'
            }])
            setExtractedReceiptData(null)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white z-50 transition-all hover:scale-105"
            >
                <MessageCircle className="h-7 w-7" />
                <span className="sr-only">Open AI Assistant</span>
            </Button>
        )
    }

    return (
        <div className={cn(
            "fixed z-50 transition-all duration-300 ease-in-out shadow-2xl",
            isMinimized
                ? "bottom-6 right-6 w-72 rounded-xl"
                : "inset-0 md:inset-auto md:bottom-6 md:right-6 w-full h-full md:w-[400px] md:h-[600px] md:rounded-xl"
        )} style={!isMinimized ? { bottom: keyboardOffset } : undefined}>
            <Card className="w-full h-full flex flex-col border-0 md:border border-blue-200 overflow-hidden rounded-none md:rounded-xl">
                <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-row items-center justify-between space-y-0 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-bold">DiscountPH AI</CardTitle>
                            <CardDescription className="text-blue-100 text-xs">Ask about laws & benefits</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-100 hover:text-white hover:bg-white/20"
                            onClick={() => setIsMinimized(!isMinimized)}
                        >
                            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-100 hover:text-white hover:bg-white/20"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>

                {!isMinimized && (
                    <>
                        <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50 relative">
                            <div
                                ref={scrollRef}
                                className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth"
                            >
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={cn(
                                            "flex w-full gap-2 max-w-[85%]",
                                            msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                                            msg.role === 'user' ? "bg-blue-600 text-white" : "bg-indigo-100 text-indigo-600"
                                        )}>
                                            {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-white text-slate-700 border border-slate-200 rounded-tl-none"
                                        )}>
                                            {msg.role === 'model' ? (
                                                <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-100 prose-pre:p-2 prose-pre:rounded-lg">
                                                    <ReactMarkdown
                                                        components={{
                                                            p: ({ ...props }) => <p className="mb-1 last:mb-0" {...props} />,
                                                            ul: ({ ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
                                                            ol: ({ ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                                                            li: ({ ...props }) => <li className="mb-0.5" {...props} />,
                                                            strong: ({ ...props }) => <strong className="font-bold" {...props} />,
                                                        }}
                                                    >
                                                        {msg.text}
                                                    </ReactMarkdown>
                                                </div>
                                            ) : (
                                                <div>
                                                    {msg.image && (
                                                        <img
                                                            src={msg.image}
                                                            alt="Uploaded receipt"
                                                            className="w-full rounded-lg mb-2 max-w-[200px]"
                                                        />
                                                    )}
                                                    <p>{msg.text}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex w-full gap-2 mr-auto max-w-[85%]">
                                        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                                            <Bot className="h-5 w-5" />
                                        </div>
                                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                                            <span className="text-xs text-slate-500">Thinking...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <CardFooter className="p-3 bg-white border-t">
                            <div className="flex w-full flex-col gap-2">
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="relative inline-block">
                                        <img
                                            src={imagePreview}
                                            alt="Receipt preview"
                                            className="w-20 h-20 object-cover rounded-lg border-2 border-blue-200"
                                        />
                                        <button
                                            onClick={handleRemoveImage}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}

                                {/* Use Receipt Data Button */}
                                {extractedReceiptData && (
                                    <Button
                                        onClick={handleUseReceiptData}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                                        size="sm"
                                    >
                                        <ImageIcon className="h-4 w-4 mr-2" />
                                        Use This Receipt Data
                                    </Button>
                                )}

                                {/* Input Row */}
                                <div className="flex w-full items-center gap-2">
                                    {/* Hidden File Input */}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="receipt-upload"
                                    />

                                    {/* Paperclip Button */}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => document.getElementById('receipt-upload')?.click()}
                                        disabled={isLoading}
                                        className="shrink-0 text-slate-600 hover:text-indigo-600"
                                        title="Upload receipt"
                                    >
                                        <Paperclip className="h-5 w-5" />
                                    </Button>

                                    <Input
                                        ref={inputRef}
                                        placeholder="Ask about discounts or upload receipt..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        disabled={isLoading}
                                        className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                                    />
                                    <Button
                                        onClick={handleSend}
                                        disabled={(!input.trim() && !attachedImage) || isLoading}
                                        size="icon"
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    )
}
