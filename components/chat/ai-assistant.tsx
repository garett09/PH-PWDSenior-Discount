'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
You are the AI Assistant for "Karapat Discount", an app that helps Senior Citizens and Persons with Disabilities (PWDs) in the Philippines calculate their discounts.

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

interface ReceiptHistoryEntry {
    id: string
    savedAt: string
    data: ReceiptData
    note?: string
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
            { role: 'model', text: 'Hello! I\'m your Karapat Discount assistant. Ask me anything about PWD or Senior Citizen discounts, or upload a receipt for analysis!' }
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
    const [receiptHistory, setReceiptHistory] = useState<ReceiptHistoryEntry[]>([])
    const [isHistoryOpen, setIsHistoryOpen] = useState(false)
    const [isInsightsPanelOpen, setIsInsightsPanelOpen] = useState(false)
    const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(true)
    const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
    const [isHandoffOpen, setIsHandoffOpen] = useState(false)
    const [isResponseModeOpen, setIsResponseModeOpen] = useState(true)
    const [responseModeId, setResponseModeId] = useState<LawResponseMode['id']>(LAW_RESPONSE_MODES[0].id)
    const [isAnalyzingReceipt, setIsAnalyzingReceipt] = useState(false)
    useEffect(() => {
        const savedHistory = localStorage.getItem('receipt_history')
        if (savedHistory) {
            try {
                const parsed: ReceiptHistoryEntry[] = JSON.parse(savedHistory)
                if (Array.isArray(parsed)) {
                    setReceiptHistory(parsed)
                }
            } catch (error) {
                console.error('Failed to load receipt history', error)
            }
        }
    }, [])

    useEffect(() => {
        if (receiptHistory.length >= 0) {
            localStorage.setItem('receipt_history', JSON.stringify(receiptHistory.slice(0, 8)))
        }
    }, [receiptHistory])
    const [viewportHeight, setViewportHeight] = useState<number | null>(null)
    const [windowHeight, setWindowHeight] = useState<number | null>(null)
    const [isMobileViewport, setIsMobileViewport] = useState(false)
    const activeMode = useMemo(() => LAW_RESPONSE_MODES.find(mode => mode.id === responseModeId) ?? LAW_RESPONSE_MODES[0], [responseModeId])
    const hasUserMessage = useMemo(() => messages.some(msg => msg.role === 'user'), [messages])
    const shouldShowQuickActions = !hasUserMessage && !isLoading
    const insightHighlights = useMemo(() => COMMUNITY_INSIGHTS.slice(0, 3), [])
    const communityPromptSnippet = useMemo(
        () =>
            insightHighlights
                .map(insight => `- ${insight.summary} (Source: ${insight.sourceUrl})`)
                .join('\n'),
        [insightHighlights]
    )
    const transcriptForEmail = useMemo(() => {
        const recent = messages.slice(-6).map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.text}`).join('\n')
        return encodeURIComponent(recent)
    }, [messages])
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

    useEffect(() => {
        setIsResponseModeOpen(!isMobileViewport)
    }, [isMobileViewport])

    const keyboardOffset =
        !isMinimized &&
            isMobileViewport &&
            windowHeight !== null &&
            viewportHeight !== null
            ? Math.max(windowHeight - viewportHeight, 0)
            : 0
    const containerClasses = cn(
        'fixed z-50 transition-all duration-300 ease-in-out shadow-2xl',
        isMinimized
            ? 'bottom-6 right-6 w-72 rounded-xl'
            : isMobileViewport
                ? 'inset-0 w-full h-full rounded-none'
                : 'inset-0 md:inset-auto md:bottom-6 md:right-6 w-full h-full md:w-[400px] md:h-[600px] md:rounded-xl'
    )
    const footerPaddingStyle = isMobileViewport ? { paddingBottom: 12 + keyboardOffset } : undefined

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

    const handleQuickActionSelect = (action: QuickAction) => {
        setInput(action.prompt)
        if (action.modeId) {
            setResponseModeId(action.modeId)
        }
        setSelectedTemplateId(null)
    }

    const handleTemplateUse = (template: ScenarioTemplate) => {
        setInput(template.prompt)
        setSelectedTemplateId(template.id)
        setResponseModeId(template.recommendedMode)
    }

    const saveReceiptToHistory = (data: ReceiptData, note?: string) => {
        const randomId =
            typeof window !== 'undefined' && window.crypto?.randomUUID
                ? window.crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
        const entry: ReceiptHistoryEntry = {
            id: randomId,
            savedAt: new Date().toISOString(),
            data,
            note
        }
        setReceiptHistory(prev => [entry, ...prev].slice(0, 8))
    }

    const handleRestoreReceiptFromHistory = (entry: ReceiptHistoryEntry) => {
        setExtractedReceiptData(entry.data)
        setIsHistoryOpen(false)
        setMessages(prev => [
            ...prev,
            {
                role: 'model',
                text: `♻️ Loaded receipt saved on ${new Date(entry.savedAt).toLocaleString()}. Tap "Use This Receipt Data" to push it to the calculator or edit any fields before sending.`
            }
        ])
    }

    const handleClearHistory = () => {
        setReceiptHistory([])
        localStorage.removeItem('receipt_history')
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
        setIsAnalyzingReceipt(Boolean(imageToSend))

        try {
            const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''

            if (!API_KEY) {
                console.error('Gemini API Key is missing. Please check your .env.local file.')
                setMessages(prev => [...prev, { role: 'model', text: 'Error: API Key is missing. Please contact the administrator.' }])
                setIsLoading(false)
                return
            }

            const modeInstruction = `
### RESPONSE MODE: ${activeMode.label}
${activeMode.description}
Laws to cite: ${activeMode.laws.join(', ')}
Rules to emphasize:
${activeMode.rules.map(rule => `- ${rule}`).join('\n')}

${activeMode.promptAddendum}
`

            const recentConcernsSection = communityPromptSnippet
                ? `\n### Recent Community Concerns\n${communityPromptSnippet}\n`
                : ''

            // Build parts array
            const parts: any[] = []

            // Add receipt analysis prompt if image is attached
            if (imageToSend) {
                parts.push({
                    text:
                        SYSTEM_PROMPT +
                        `\n\n**IMPORTANT: The user has uploaded a receipt image.**\n\nAnalyze the receipt and extract:\n1. Receipt type (restaurant, grocery, medicine, utility, transport)\n2. Total bill amount (subtotal)\n3. Service charge (if present) - IMPORTANT: Note the exact amount shown\n4. VAT amount (if shown)\n5. Individual items (if visible)\n6. Establishment name\n7. Number of diners (if mentioned, e.g., "2 guests, 1 PWD")\n\n**SERVICE CHARGE PERCENTAGE ANALYSIS:**\n- If service charge is present, calculate what percentage it represents:\n  * On Subtotal (with VAT): (Service Charge / Subtotal) × 100\n  * On Base (without VAT): (Service Charge / (Subtotal / 1.12)) × 100\n- Most restaurants calculate at 10% on base amount (without VAT)\n- If percentage is much lower (4-5%), it may indicate group dining where only regular diners paid their share\n- Explain which calculation method is most likely based on the percentages\n\n**ADVANCED ANALYSIS:**\n- Look for specific meals that might be for the PWD/Senior (e.g., a single meal set vs shared platters).\n- If you see distinct individual meals, suggest 'exclusive' calculation method and estimate the PWD's exclusive amount.\n- If items look shared (platters, pizza, bulk), suggest 'prorated'.\n\n${modeInstruction}\n${recentConcernsSection}\nProvide a friendly summary including the service charge percentage analysis, then output the extracted data in this JSON format:\n\`\`\`json\n{\n  "type": "restaurant" | "grocery" | "medicine" | "utility" | "transport",\n  "totalAmount": number,\n  "serviceCharge": number | null,\n  "items": [{ "name": string, "price": number }],\n  "establishmentName": string,\n  "calculationMethod": "prorated" | "exclusive",\n  "exclusiveAmount": number (optional, if method is exclusive)\n}\n\`\`\`\n\nUser Question: ` + userMessage
                })
                parts.push({
                    inline_data: {
                        mime_type: imageToSend.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
                        data: imageToSend.split(',')[1] // Remove data:image/...;base64, prefix
                    }
                })
            } else {
                parts.push({
                    text:
                        SYSTEM_PROMPT +
                        '\n' +
                        modeInstruction +
                        '\n' +
                        recentConcernsSection +
                        '\nUser Question: ' +
                        userMessage
                })
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
                        saveReceiptToHistory(extractedData, userMessage)
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
            setIsAnalyzingReceipt(false)
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
                title="Scan receipts or ask Karapat Discount AI about RA 10754/RA 9994"
            >
                <MessageCircle className="h-7 w-7" />
                <span className="sr-only">Open Karapat Discount AI for receipt scans & legal help</span>
            </Button>
        )
    }

    return (
        <div
            className={containerClasses}
            style={!isMinimized ? { bottom: isMobileViewport ? 0 : keyboardOffset } : undefined}
        >
            <Card className="w-full h-full flex flex-col border-0 md:border border-blue-200 overflow-hidden rounded-none md:rounded-xl">
                <CardHeader className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex flex-row items-center justify-between space-y-0 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                        </div>
                        <div>
                            <CardTitle className="text-base font-bold">Karapat Discount AI</CardTitle>
                            <CardDescription className="text-blue-100 text-xs">Upload receipts • Cite RA 10754 & RA 9994</CardDescription>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                'h-8 w-8 text-blue-100 hover:text-white hover:bg-white/20',
                                isHistoryOpen && 'bg-white/20 text-white'
                            )}
                            onClick={() => setIsHistoryOpen(prev => !prev)}
                            title="View saved receipt data"
                        >
                            <History className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                'h-8 w-8 text-blue-100 hover:text-white hover:bg-white/20',
                                isInsightsPanelOpen && 'bg-white/20 text-white'
                            )}
                            onClick={() => setIsInsightsPanelOpen(prev => !prev)}
                            title="Show community concerns"
                        >
                            <Info className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                'h-8 w-8 text-blue-100 hover:text-white hover:bg-white/20',
                                isHandoffOpen && 'bg-white/20 text-white'
                            )}
                            onClick={() => setIsHandoffOpen(prev => !prev)}
                            title="Need OSCA/PDAO or 8888 help?"
                        >
                            <PhoneForwarded className="h-4 w-4" />
                        </Button>
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

                {isHistoryOpen && (
                    <div className="bg-white border-b border-blue-100 max-h-44 overflow-y-auto px-4 py-3 text-xs space-y-2">
                        {receiptHistory.length === 0 ? (
                            <p className="text-slate-500">No saved receipt data yet. Upload a receipt to build history.</p>
                        ) : (
                            receiptHistory.map(entry => (
                                <div
                                    key={entry.id}
                                    className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 p-2"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-700">{entry.data.establishmentName || 'Unnamed receipt'}</p>
                                        <p className="text-[11px] text-slate-500">
                                            Saved {new Date(entry.savedAt).toLocaleString()} • ₱{entry.data.totalAmount.toFixed(2)}
                                        </p>
                                        {entry.note && <p className="text-[11px] text-slate-500 line-clamp-1">Note: {entry.note}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="text-xs"
                                            onClick={() => handleRestoreReceiptFromHistory(entry)}
                                        >
                                            Reuse
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                        {receiptHistory.length > 0 && (
                            <div className="text-right">
                                <Button variant="ghost" size="sm" className="text-xs text-slate-500" onClick={handleClearHistory}>
                                    Clear history
                                </Button>
                            </div>
                        )}
                    </div>
                )}

                {isInsightsPanelOpen && (
                    <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-3 text-xs space-y-2">
                        {insightHighlights.map(insight => (
                            <div key={insight.id} className="rounded-lg border border-indigo-100 bg-white/70 p-2">
                                <p className="font-semibold text-indigo-700">{insight.title}</p>
                                <p className="text-slate-600">{insight.summary}</p>
                                <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-indigo-600">
                                    {insight.tags.map(tag => (
                                        <span key={tag} className="rounded-full bg-indigo-100 px-2 py-0.5">
                                            #{tag}
                                        </span>
                                    ))}
                                    <a
                                        href={insight.sourceUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-indigo-700 underline decoration-dotted"
                                    >
                                        Source
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="border-b border-blue-100 bg-blue-50 px-4 py-3 text-xs">
                    <button
                        className="flex w-full items-center justify-between text-left text-blue-900"
                        onClick={() => setIsResponseModeOpen(prev => !prev)}
                    >
                        <div className="flex items-center gap-2">
                            <ListChecks className="h-4 w-4" />
                            <span className="font-semibold">Response mode</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px]">
                            <span className="hidden md:inline">{isResponseModeOpen ? 'Hide' : 'Show'}</span>
                            {isResponseModeOpen ? (
                                <ChevronUp className="h-4 w-4" />
                            ) : (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </div>
                    </button>
                    {isResponseModeOpen && (
                        <div className="mt-3 space-y-2">
                            <div className="flex flex-wrap gap-2">
                                {LAW_RESPONSE_MODES.map(mode => (
                                    <button
                                        key={mode.id}
                                        className={cn(
                                            'rounded-full border px-3 py-1 text-[11px] transition',
                                            mode.id === responseModeId
                                                ? 'border-blue-600 bg-white text-blue-700 shadow-sm'
                                                : 'border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-white'
                                        )}
                                        onClick={() => setResponseModeId(mode.id)}
                                    >
                                        {mode.label}
                                    </button>
                                ))}
                            </div>
                            <p className="text-[11px] text-blue-800">{activeMode.description}</p>
                            <p className="text-[10px] text-blue-700">
                                Cite: {activeMode.laws.join(', ')} • Rules: {activeMode.rules.join('; ')}
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[11px] text-blue-700"
                                onClick={() => setIsResponseModeOpen(false)}
                            >
                                Exit response mode
                            </Button>
                        </div>
                    )}
                </div>

                {isHandoffOpen && (
                    <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-xs space-y-2">
                        <p className="font-semibold text-amber-900">Need human escalation?</p>
                        <p className="text-amber-900">
                            Contact your OSCA/PDAO or dial <span className="font-semibold">8888</span>. Attach a clear receipt photo, your ID, and a short summary.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <a
                                href={`mailto:osca@pdao.gov.ph?subject=Discount Concern&body=${transcriptForEmail}`}
                                className="rounded-full bg-amber-600 px-3 py-1 text-white hover:bg-amber-700"
                            >
                                Draft email with transcript
                            </a>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-amber-900"
                                onClick={() => setIsHandoffOpen(false)}
                            >
                                Hide panel
                            </Button>
                        </div>
                    </div>
                )}

                {!isMinimized && (
                    <>
                        <CardContent className="flex-1 p-0 overflow-hidden bg-slate-50 relative">
                            <div
                                ref={scrollRef}
                                className="h-full overflow-y-auto p-4 space-y-4 scroll-smooth"
                            >
                                {shouldShowQuickActions && (
                                    <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-3 text-xs shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="h-4 w-4 text-indigo-600" />
                                            <p className="font-semibold text-slate-700">Quick start</p>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {QUICK_ACTIONS.map(action => (
                                                <Button
                                                    key={action.id}
                                                    type="button"
                                                    variant="secondary"
                                                    size="sm"
                                                    className="text-xs"
                                                    onClick={() => handleQuickActionSelect(action)}
                                                >
                                                    {action.label}
                                                </Button>
                                            ))}
                                        </div>
                                        <p className="text-[11px] text-slate-500">
                                            These prompts reflect recent community pain points like under-applied discounts and missing receipts.
                                        </p>
                                    </div>
                                )}

                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 p-3 text-xs shadow-sm">
                                    <button
                                        onClick={() => setIsTemplatePanelOpen(prev => !prev)}
                                        className="flex w-full items-center justify-between text-slate-700"
                                    >
                                        <div className="flex items-center gap-2">
                                            <ClipboardList className="h-4 w-4 text-indigo-600" />
                                            <span className="font-semibold">Scenario templates</span>
                                        </div>
                                        {isTemplatePanelOpen ? (
                                            <ChevronUp className="h-4 w-4 text-slate-500" />
                                        ) : (
                                            <ChevronDown className="h-4 w-4 text-slate-500" />
                                        )}
                                    </button>
                                    {isTemplatePanelOpen && (
                                        <div className="mt-3 space-y-2">
                                            {SCENARIO_TEMPLATES.map(template => {
                                                const insight = template.insightId ? COMMUNITY_INSIGHT_MAP[template.insightId] : undefined
                                                return (
                                                    <div
                                                        key={template.id}
                                                        className={cn(
                                                            'rounded-xl border p-3 transition',
                                                            selectedTemplateId === template.id ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-white'
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div>
                                                                <p className="font-semibold text-slate-800">{template.title}</p>
                                                                <p className="text-[11px] text-slate-500">{template.summary}</p>
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-xs text-indigo-700"
                                                                onClick={() => handleTemplateUse(template)}
                                                            >
                                                                Use
                                                            </Button>
                                                        </div>
                                                        <p className="mt-2 text-[11px] text-slate-600">
                                                            Mode: {LAW_RESPONSE_MODES.find(mode => mode.id === template.recommendedMode)?.label}
                                                        </p>
                                                        {insight && (
                                                            <a
                                                                href={insight.sourceUrl}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-[11px] text-indigo-600 underline decoration-dotted"
                                                            >
                                                                Based on: {insight.title}
                                                            </a>
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

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

                        <CardFooter className="p-3 bg-white border-t" style={footerPaddingStyle}>
                            <div className="flex w-full flex-col gap-2">
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="space-y-2">
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
                                        <div className="rounded-lg border border-blue-100 bg-blue-50 p-2 text-[11px] text-blue-800">
                                            <p className="font-semibold">Receipt tip</p>
                                            <p>Snap the totals, VAT, and service charge lines clearly. Mention how many diners shared the bill.</p>
                                        </div>
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

                                {isAnalyzingReceipt && (
                                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 p-2 text-xs text-slate-600">
                                        <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                                        <span>Analyzing receipt with Gemini, hang tight…</span>
                                    </div>
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
