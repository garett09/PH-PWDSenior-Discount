'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PenTool, Upload, Printer, RefreshCw, Eraser, FileSignature } from 'lucide-react'
import { cn } from '@/lib/utils'

export function AuthorizationLetterGenerator() {
    const [formData, setFormData] = useState({
        seniorName: '',
        seniorId: '',
        repName: '',
        repId: '',
        relation: 'child',
        purpose: 'medicine',
        date: new Date().toISOString().split('T')[0]
    })

    const [signature, setSignature] = useState<string | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDrawing, setIsDrawing] = useState(false)

    // Canvas drawing logic
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight

        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.lineCap = 'round'
    }, [])

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true)
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top

        ctx.beginPath()
        ctx.moveTo(x, y)
    }

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing) return
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const rect = canvas.getBoundingClientRect()
        const x = ('touches' in e ? e.touches[0].clientX : e.clientX) - rect.left
        const y = ('touches' in e ? e.touches[0].clientY : e.clientY) - rect.top

        ctx.lineTo(x, y)
        ctx.stroke()
    }

    const stopDrawing = () => {
        setIsDrawing(false)
        const canvas = canvasRef.current
        if (canvas) {
            setSignature(canvas.toDataURL())
        }
    }

    const clearSignature = () => {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        setSignature(null)
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                setSignature(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handlePrint = () => {
        window.print()
    }

    const getPurposeText = () => {
        switch (formData.purpose) {
            case 'medicine': return 'purchase medicines and sign the purchase booklet'
            case 'grocery': return 'purchase basic necessities and prime commodities'
            case 'id-application': return 'apply for/claim my PWD/Senior Citizen ID'
            default: return 'transact'
        }
    }

    return (
        <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section - Hidden on Print */}
            <div className="space-y-6 print:hidden">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileSignature className="w-5 h-5 text-indigo-600" />
                            Letter Details
                        </CardTitle>
                        <CardDescription>
                            Fill in the details to generate your authorization letter.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Senior/PWD Name</Label>
                                <Input
                                    value={formData.seniorName}
                                    onChange={(e) => setFormData({ ...formData, seniorName: e.target.value })}
                                    placeholder="Juan Dela Cruz"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>ID Number</Label>
                                <Input
                                    value={formData.seniorId}
                                    onChange={(e) => setFormData({ ...formData, seniorId: e.target.value })}
                                    placeholder="123-456-789"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Representative Name</Label>
                                <Input
                                    value={formData.repName}
                                    onChange={(e) => setFormData({ ...formData, repName: e.target.value })}
                                    placeholder="Maria Dela Cruz"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Relationship</Label>
                                <Select
                                    value={formData.relation}
                                    onValueChange={(val) => setFormData({ ...formData, relation: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="child">Child</SelectItem>
                                        <SelectItem value="spouse">Spouse</SelectItem>
                                        <SelectItem value="sibling">Sibling</SelectItem>
                                        <SelectItem value="caregiver">Caregiver</SelectItem>
                                        <SelectItem value="relative">Relative</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Purpose</Label>
                            <Select
                                value={formData.purpose}
                                onValueChange={(val) => setFormData({ ...formData, purpose: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="medicine">Buy Medicines (Booklet)</SelectItem>
                                    <SelectItem value="grocery">Buy Groceries (5% Discount)</SelectItem>
                                    <SelectItem value="id-application">Claim/Apply ID</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Signature</Label>
                            <Tabs defaultValue="draw" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="draw">Draw</TabsTrigger>
                                    <TabsTrigger value="upload">Upload</TabsTrigger>
                                </TabsList>
                                <TabsContent value="draw" className="space-y-2">
                                    <div className="border rounded-md p-2 bg-white">
                                        <canvas
                                            ref={canvasRef}
                                            className="w-full h-32 touch-none cursor-crosshair"
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                        />
                                    </div>
                                    <Button variant="outline" size="sm" onClick={clearSignature} className="w-full">
                                        <Eraser className="w-4 h-4 mr-2" />
                                        Clear Signature
                                    </Button>
                                </TabsContent>
                                <TabsContent value="upload">
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                                <p className="text-sm text-gray-500">Click to upload signature image</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                        </label>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </CardContent>
                </Card>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
                    <p className="font-semibold flex items-center gap-2">
                        <Printer className="w-4 h-4" />
                        Printing Tip
                    </p>
                    <p className="mt-1">
                        Click "Print Letter" below. The app interface will be hidden, and only the formal letter will be printed.
                        <br />
                        <strong>Note:</strong> Some establishments may still require a "wet signature" (pen on paper).
                    </p>
                </div>

                <Button onClick={handlePrint} className="w-full h-12 text-lg bg-indigo-600 hover:bg-indigo-700">
                    <Printer className="w-5 h-5 mr-2" />
                    Print Authorization Letter
                </Button>
            </div>

            {/* Letter Preview - Visible on Print */}
            <div className="bg-white p-8 shadow-lg rounded-xl print:shadow-none print:p-0 print:w-full print:absolute print:top-0 print:left-0 print:m-0">
                <div className="max-w-[21cm] mx-auto space-y-8 text-slate-900 font-serif">
                    {/* Header */}
                    <div className="text-center space-y-1 border-b pb-6">
                        <h1 className="text-2xl font-bold uppercase tracking-wide">Authorization Letter</h1>
                        <p className="text-sm text-slate-500 italic">Generated via Karapat Discount App</p>
                    </div>

                    {/* Date */}
                    <div className="text-right">
                        <p>{new Date(formData.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>

                    {/* Salutation */}
                    <div>
                        <p>To Whom It May Concern:</p>
                    </div>

                    {/* Body */}
                    <div className="space-y-4 leading-relaxed text-justify">
                        <p>
                            I, <span className="font-bold border-b border-slate-400 px-1">{formData.seniorName || '________________'}</span>,
                            a holder of PWD/Senior Citizen ID No. <span className="font-bold border-b border-slate-400 px-1">{formData.seniorId || '________________'}</span>,
                            do hereby authorize my <span className="font-bold border-b border-slate-400 px-1">{formData.relation}</span>,
                            <span className="font-bold border-b border-slate-400 px-1">{formData.repName || '________________'}</span>,
                            to {getPurposeText()} on my behalf.
                        </p>
                        <p>
                            This authorization is made in accordance with the provisions of <strong>Republic Act No. 10754</strong> (An Act Expanding the Benefits and Privileges of Persons with Disability)
                            and/or <strong>Republic Act No. 9994</strong> (Expanded Senior Citizens Act of 2010), which allows representatives to claim privileges for the principal beneficiary.
                        </p>
                        <p>
                            Attached herewith is my PWD/Senior Citizen ID and my Purchase Booklet (if applicable) for your verification.
                        </p>
                    </div>

                    {/* Closing */}
                    <div className="pt-12 space-y-12">
                        <div className="w-64">
                            <p className="mb-4">Sincerely,</p>

                            <div className="relative h-20 mb-2">
                                {signature ? (
                                    <img src={signature} alt="Signature" className="absolute bottom-0 left-0 h-full object-contain" />
                                ) : (
                                    <div className="absolute bottom-0 left-0 w-full border-b border-slate-900"></div>
                                )}
                            </div>

                            <p className="font-bold uppercase">{formData.seniorName || 'Signature over Printed Name'}</p>
                            <p className="text-sm text-slate-600">Principal / ID Holder</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-12 border-t mt-12 text-xs text-slate-400 text-center print:fixed print:bottom-8 print:left-0 print:w-full">
                        <p>This document was generated to facilitate the claiming of legal privileges under Philippine Law.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
