'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { MessageCircle, Send, X, Bot, User, Loader2, Sparkles, Minimize2, Maximize2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

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

interface Message {
    role: 'user' | 'model'
    text: string
}

export function AiAssistant() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Hello! I\'m your DiscountPH assistant. Ask me anything about PWD or Senior Citizen discounts!' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
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

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMessage = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', text: userMessage }])
        setIsLoading(true)

        try {
            const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''

            if (!API_KEY) {
                console.error('Gemini API Key is missing. Please check your .env.local file.')
                setMessages(prev => [...prev, { role: 'model', text: 'Error: API Key is missing. Please contact the administrator.' }])
                setIsLoading(false)
                return
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
                            parts: [{ text: SYSTEM_PROMPT + "\n\nUser Question: " + userMessage }]
                        }
                    ]
                })
            })

            const data = await response.json()

            if (data.error) {
                throw new Error(data.error.message)
            }

            const botResponse = data.candidates[0].content.parts[0].text
            setMessages(prev => [...prev, { role: 'model', text: botResponse }])
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error connecting to the server. Please try again later.' }])
        } finally {
            setIsLoading(false)
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
            "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out",
            isMinimized ? "w-72" : "w-[90vw] md:w-[400px] h-[80vh] md:h-[600px]"
        )}>
            <Card className="w-full h-full flex flex-col shadow-2xl border-blue-200 overflow-hidden">
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
                                                <p>{msg.text}</p>
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
                            <div className="flex w-full items-center gap-2">
                                <Input
                                    ref={inputRef}
                                    placeholder="Ask about discounts..."
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    disabled={isLoading}
                                    className="flex-1 bg-slate-50 border-slate-200 focus-visible:ring-indigo-500"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    size="icon"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardFooter>
                    </>
                )}
            </Card>
        </div>
    )
}
