'use client'

import { useState, useEffect } from 'react'
import { Calculator, ShoppingCart, Utensils, Pill, Zap, Plane, Scale, Info, Receipt, Users, Percent, Sparkles, ExternalLink, FileText, X, RotateCcw, Copy, Check, ChevronDown, ChevronUp, Save, Clock, Share2, TrendingUp, MapPin } from 'lucide-react'
import { saveCalculation, getSavedCalculations, deleteCalculation, formatCalculationForSharing, type SavedCalculation } from '@/lib/storage-utils'
import { MedicineCalculator } from '@/components/calculators/medicine-calculator'
import { UtilitiesCalculator } from '@/components/calculators/utilities-calculator'
import { TransportCalculator } from '@/components/calculators/transport-calculator'
import { TakeoutCalculator } from '@/components/calculators/takeout-calculator'
import { DiscountAuditor } from '@/components/calculators/discount-auditor'
import { RightsFlashcards } from '@/components/legal/rights-flashcards'
import { ComplaintGenerator } from '@/components/legal/complaint-generator'
import { CityOrdinanceChecker } from '@/components/city/city-ordinance-checker'
import { AiAssistant } from '@/components/chat/ai-assistant'
import { AuthorizationLetterGenerator } from '@/components/legal/authorization-letter-generator'
import { SavingsDashboard } from '@/components/dashboard/savings-dashboard'
import { OfflineEmergencyCard } from '@/components/legal/offline-card'
import { GroceryOptimizer } from '@/components/calculators/grocery-optimizer'
import { EstablishmentTracker } from '@/components/dashboard/establishment-tracker'
import { LegalSection } from '@/components/legal/legal-section'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useI18n } from '@/lib/i18n-context'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

// Modern Switch component - Polished and works great on mobile and web
// Optimized for mobile touch targets (44x44pt minimum)
function CustomSwitch({ checked, onCheckedChange, id }: { checked: boolean; onCheckedChange: (c: boolean) => void; id: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onCheckedChange(!checked)}
      className={`
        relative inline-flex items-center cursor-pointer rounded-full transition-all duration-300 ease-in-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50 touch-manipulation
        active:scale-95
        min-w-[56px] min-h-[32px] w-[56px] h-[32px] p-1
        ${checked
          ? 'bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 shadow-md shadow-blue-500/40'
          : 'bg-slate-300 dark:bg-slate-600 shadow-inner'
        }
      `}
    >
      <span
        className={`
          absolute block rounded-full bg-white transition-all duration-300 ease-in-out
          ${checked ? 'translate-x-6' : 'translate-x-0'}
          w-[24px] h-[24px] top-1
          shadow-md
          ${checked
            ? 'shadow-blue-600/50'
            : 'shadow-slate-400/40'
          }
        `}
      />
    </button>
  )
}

const SERVICE_CHARGE_BASE_OPTIONS = [
  {
    value: 'gross',
    label: 'Menu Price',
    helper: 'Standard. 10% of the total bill amount.'
  },
  {
    value: 'net',
    label: 'Price without VAT',
    helper: '10% of the amount before tax is added.'
  },
  {
    value: 'post',
    label: 'Discounted Price',
    helper: '10% of the amount after discounts are removed.'
  }
] as const

const CoverageLegalContent = () => (
  <div className="space-y-6">
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge className="bg-blue-100 text-blue-700 font-semibold">20% + VAT</Badge>
        <h4 className="font-bold text-slate-900 text-base">Restaurant & Services</h4>
      </div>
      <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
        <li>Hotels, restaurants, and recreation centers</li>
        <li>Theaters, cinema houses, concert halls</li>
        <li>Medicines and drugstores</li>
        <li>Medical and dental services (diagnostic, lab fees, professional fees)</li>
        <li>Domestic air and sea travel</li>
        <li>Land transportation (Jeepneys, Buses, Taxis, Trains)</li>
        <li>Funeral and burial services</li>
      </ul>
    </div>

    <Separator />

    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge className="bg-green-100 text-green-700 font-semibold">5%</Badge>
        <h4 className="font-bold text-slate-900 text-base">Groceries (Capped at ₱2,500/week)</h4>
      </div>
      <ul className="space-y-1.5 text-sm text-slate-700 list-disc pl-5">
        <li>Basic necessities (rice, bread, milk, coffee, laundry soap, etc.)</li>
        <li>Prime commodities (fresh fruits, flour, canned goods, etc.)</li>
      </ul>
      <div className="rounded-lg bg-red-50 border-l-4 border-red-500 px-3 py-2">
        <p className="text-sm text-red-800 font-semibold">
          No VAT discount except for agricultural/marine products in original state
        </p>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-t border-slate-200 pt-4 text-xs sm:text-sm text-slate-600">
      <p className="font-medium text-blue-600">Sources: RA 10754, RA 9994, RA 7581</p>
      <a
        href="https://www.officialgazette.gov.ph/2016/03/23/republic-act-no-10754/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold group"
      >
        <span>View Official Law</span>
        <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </a>
    </div>
  </div>
)

type CoverageCardProps = {
  isExpanded: boolean
  onToggle: () => void
  className?: string
}

function CoverageCard({ isExpanded, onToggle, className }: CoverageCardProps) {
  return (
    <div className={cn('w-full bg-white rounded-xl border-2 border-slate-200 shadow-lg overflow-hidden', className)}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 sm:px-6 py-4 sm:py-5 text-slate-700 hover:text-blue-600 font-semibold text-sm sm:text-base"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-100">
            <Info className="w-4 h-4 text-blue-600" />
          </div>
          <span>Coverage & Legal Information</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <CoverageLegalContent />
        </div>
      )}
    </div>
  )
}

export function DiscountCalculator() {
  const { t, language, setLanguage } = useI18n()
  const [activeCategory, setActiveCategory] = useState<'calculators' | 'tools'>('calculators')
  const [activeTab, setActiveTab] = useState('restaurant')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])



  // Restaurant/Medicine State
  const [rmAmount, setRmAmount] = useState<string>('')
  const [isRestaurant, setIsRestaurant] = useState(false)
  const [billAmount, setBillAmount] = useState('')
  const [diners, setDiners] = useState('1')
  const [pwdCount, setPwdCount] = useState('1')
  const [hasServiceCharge, setHasServiceCharge] = useState(false)
  const [serviceChargeRate, setServiceChargeRate] = useState<string>('10')
  const [serviceChargeBase, setServiceChargeBase] = useState<'gross' | 'net' | 'post'>('gross')
  const [serviceChargeAmount, setServiceChargeAmount] = useState<string>('')
  const [serviceChargeExcluded, setServiceChargeExcluded] = useState<string>('0')
  const [manualScMode, setManualScMode] = useState(false)
  const [manualScAmount, setManualScAmount] = useState<string>('')
  const [numPwdSenior, setNumPwdSenior] = useState<string>('1')
  const [numRegular, setNumRegular] = useState<string>('0')
  const [diningMode, setDiningMode] = useState<'dine-in' | 'takeout'>('dine-in')
  const [useMemcForDineIn, setUseMemcForDineIn] = useState(false)
  const [memcPriceForDineIn, setMemcPriceForDineIn] = useState<string>('')

  const [calculationMode, setCalculationMode] = useState<'prorated' | 'exclusive'>('prorated')
  const [exclusiveAmount, setExclusiveAmount] = useState<string>('')
  const [vatExemptSales, setVatExemptSales] = useState<number>(0)
  const [discountAmount, setDiscountAmount] = useState<number>(0)
  const [netPayable, setNetPayable] = useState<number>(0)
  const [individualShare, setIndividualShare] = useState<number>(0)
  const [showResults, setShowResults] = useState(false)

  // Grocery State
  const [gAmount, setGAmount] = useState<string>('')
  const [gRemaining, setGRemaining] = useState<string>('1300')
  const [gDiscount, setGDiscount] = useState<number>(0)
  const [gPayable, setGPayable] = useState<number>(0)
  const [gShowResults, setGShowResults] = useState(false)

  // Utilities State
  const [uAmount, setUAmount] = useState<string>('')
  const [uType, setUType] = useState<'electricity' | 'water'>('electricity')
  const [uConsumption, setUConsumption] = useState<string>('')
  const [uDiscount, setUDiscount] = useState<number>(0)
  const [uPayable, setUPayable] = useState<number>(0)
  const [uShowResults, setUShowResults] = useState(false)

  // Transport State
  const [tFare, setTFare] = useState<string>('')
  const [tType, setTType] = useState<'land' | 'air' | 'sea'>('land')
  const [tDiscount, setTDiscount] = useState<number>(0)
  const [tPayable, setTPayable] = useState<number>(0)
  const [tShowResults, setTShowResults] = useState(false)

  // Effect to update isRestaurant based on activeTab
  useEffect(() => {
    setIsRestaurant(activeTab === 'restaurant')
  }, [activeTab])

  // Results
  const [rmResult, setRmResult] = useState<{
    baseAmount: number
    vatAmount: number
    serviceChargeTotal: number
    serviceChargeSource: 'auto' | 'manual'
    serviceChargeBase: 'gross' | 'net' | 'post'
    vatDiscount: number
    discount20: number
    serviceChargeExemption: number
    totalDiscount: number
    amountToPay: number
    exclusiveItemsDiscount?: number
    sharedItemsDiscount?: number
    methodUsed?: 'prorated' | 'exclusive' | 'mixed'
    exclusiveAmount?: number
    sharedAmount?: number
  } | null>(null)

  const [gResult, setGResult] = useState<{
    discount5: number
    amountToPay: number
  } | null>(null)

  const [medResult, setMedResult] = useState<{
    baseAmount: number
    vatAmount: number
    vatDiscount: number
    discount20: number
    amountToPay: number
    totalSaved: number
  } | null>(null)

  const [utilResult, setUtilResult] = useState<{
    eligible: boolean
    discount5: number
    amountToPay: number
    reason?: string
  } | null>(null)

  const [transResult, setTransResult] = useState<{
    baseAmount: number
    vatAmount: number
    vatDiscount: number
    discount20: number
    taxesFees: number
    amountToPay: number
    totalSaved: number
  } | null>(null)

  // UI State for enhancements
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [expandedPersonId, setExpandedPersonId] = useState<string | null>(null)
  const [showSaveSuccess, setShowSaveSuccess] = useState(false)
  const [showRecentCalcs, setShowRecentCalcs] = useState(false)

  // Simple/Advanced Mode
  const [isAdvancedMode, setIsAdvancedMode] = useState(false)


  // Receipt Matching State
  const [receiptMatchMode, setReceiptMatchMode] = useState(false)
  const [receiptActualTotal, setReceiptActualTotal] = useState<string>('')

  // Mobile Optimization State
  const [groupSummaryExpanded, setGroupSummaryExpanded] = useState(true)
  const [perPersonExpanded, setPerPersonExpanded] = useState(true)

  // Exclusive PWD Orders State (Mixed Transactions)
  const [exclusivePwdAmount, setExclusivePwdAmount] = useState<string>('')
  const [calculationMethod, setCalculationMethod] = useState<'prorated' | 'exclusive'>('prorated')

  // Receipt Scanner Data from Chatbot
  const [chatbotReceiptData, setChatbotReceiptData] = useState<any>(null)
  const [isCoverageExpanded, setIsCoverageExpanded] = useState(false)
  // Handle receipt data from chatbot
  useEffect(() => {
    if (!chatbotReceiptData) return

    const data = chatbotReceiptData

    // Switch to appropriate tab and pre-fill fields
    if (data.type === 'restaurant') {
      setActiveTab('restaurant')
      setRmAmount(data.totalAmount.toString())
      setIsRestaurant(true)

      // Handle Service Charge
      if (data.serviceCharge) {
        setHasServiceCharge(true)
        setManualScMode(true)
        setManualScAmount(data.serviceCharge.toString())
      }

      // Handle Advanced Mode / Exclusive Calculation
      if (data.calculationMethod === 'exclusive' && data.exclusiveAmount) {
        setIsAdvancedMode(true)
        setCalculationMethod('exclusive')
        setExclusivePwdAmount(data.exclusiveAmount.toString())
      } else {
        // Default to simple/prorated if not specified or if prorated
        setCalculationMethod('prorated')
        // Optional: Switch to simple mode if it's definitely prorated? 
        // For now, let's only force Advanced if it's exclusive.
      }

    } else if (data.type === 'grocery') {
      setActiveTab('groceries')
      setGAmount(data.totalAmount.toString())
    } else if (data.type === 'medicine') {
      setActiveTab('medicine')
      setRmAmount(data.totalAmount.toString())
      setIsRestaurant(false)
    }

    // Clear the data after processing
    setChatbotReceiptData(null)
  }, [chatbotReceiptData])

  if (!mounted) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50" />
  }

  const formatCurrency = (value: number) => {
    return value.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })
  }


  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleSaveCalculation = () => {
    if (!rmResult && !gResult && !medResult && !utilResult && !transResult) return

    let calcToSave: Omit<SavedCalculation, 'id' | 'timestamp'>

    if (rmResult) {
      calcToSave = {
        type: 'restaurant' as const,
        inputs: {
          amount: rmAmount,
          pwdCount: numPwdSenior,
          regCount: numRegular,
          isRestaurant,
          hasServiceCharge,
          serviceChargeRate,
          serviceChargeBase,
          serviceChargeExcluded,
          manualScAmount
        },
        results: rmResult
      }
    } else if (gResult) {
      calcToSave = {
        type: 'groceries' as const,
        inputs: {
          amount: gAmount,
          gRemaining
        },
        results: gResult
      }
    } else if (medResult) {
      calcToSave = {
        type: 'medicine' as const,
        inputs: {
          amount: rmAmount // Medicine uses the same amount input
        },
        results: medResult
      }
    } else if (utilResult) {
      calcToSave = {
        type: 'utilities' as const,
        inputs: {
          // Note: Utilities calculator has its own internal state
          // We'll save what we can from the result
        },
        results: utilResult
      }
    } else if (transResult) {
      calcToSave = {
        type: 'transport' as const,
        inputs: {
          // Note: Transport calculator has its own internal state
          // We'll save what we can from the result
        },
        results: transResult
      }
    } else {
      return
    }

    if (saveCalculation(calcToSave)) {
      setShowSaveSuccess(true)
      setTimeout(() => setShowSaveSuccess(false), 2000)
    }
  }

  const shareBreakdown = async () => {
    if (!rmResult) return

    let text = `Karapat Discount - Bill Summary\n`
    text += `━━━━━━━━━━━━━━━━━━━━━━\n`
    text += `Base Amount: ${formatCurrency(rmResult.baseAmount)}\n`
    text += `VAT (12%): +${formatCurrency(rmResult.vatAmount)}\n`

    if (rmResult.serviceChargeTotal > 0) {
      text += `Service Charge: +${formatCurrency(rmResult.serviceChargeTotal)}\n`
    }

    text += `\n`
    text += `VAT Exemption: -${formatCurrency(rmResult.vatDiscount)}\n`
    text += `20% Discount: -${formatCurrency(rmResult.discount20)}\n`

    if (rmResult.serviceChargeExemption > 0) {
      text += `SC Exemption: -${formatCurrency(rmResult.serviceChargeExemption)}\n`
    }

    text += `━━━━━━━━━━━━━━━━━━━━━━\n`
    text += `TOTAL: ${formatCurrency(rmResult.amountToPay)}\n`
    text += `Saved: ${formatCurrency(rmResult.totalDiscount)}\n`

    if (isRestaurant && (parseInt(numPwdSenior) + parseInt(numRegular) > 1)) {
      text += `\nPer Person:\n`
      const totalGroup = Math.max(parseInt(numPwdSenior) + parseInt(numRegular), 1)
      const baseAmountPerPerson = rmResult.baseAmount / totalGroup

      if (parseInt(numPwdSenior) > 0) {
        const pwdDiscount = baseAmountPerPerson * 0.20
        const pwdTotal = baseAmountPerPerson - pwdDiscount
        text += `PWD/Senior: ${formatCurrency(pwdTotal)}\n`
      }

      if (parseInt(numRegular) > 0) {
        const vatAmountPerPerson = rmResult.vatAmount / totalGroup
        const regCount = parseInt(numRegular) || 1
        const serviceChargePerReg =
          rmResult.serviceChargeTotal > 0
            ? Math.max(rmResult.serviceChargeTotal - rmResult.serviceChargeExemption, 0) / regCount
            : 0
        const regTotal = baseAmountPerPerson + vatAmountPerPerson + serviceChargePerReg
        text += `Regular: ${formatCurrency(regTotal)}\n`
      }
    }

    // Try Web Share API first (works on mobile)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Karapat Discount - Bill Summary',
          text: text
        })
        return
      } catch (err) {
        // User cancelled or share failed, fall back to clipboard
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err)
        }
      }
    }

    // Fallback to clipboard
    await copyToClipboard(text, 'share-breakdown')
  }

  const clearBill = () => {
    setRmAmount('')
    setIsRestaurant(false)
    setHasServiceCharge(false)
    setServiceChargeRate('10')
    setServiceChargeBase('gross')
    setServiceChargeExcluded('0')
    setManualScMode(false)
    setManualScAmount('')
    setNumPwdSenior('1')
    setNumRegular('0')
    setExclusivePwdAmount('')
    setCalculationMethod('prorated')
    setRmResult(null)
    setGAmount('')
    setGRemaining('2500.00')
    setGResult(null)
    setMedResult(null)
    setUtilResult(null)
    setTransResult(null)
  }

  const computeRestaurantMedicine = () => {
    const amount = parseFloat(rmAmount) || 0
    if (amount <= 0) return

    const pwdCount = Math.max(parseInt(numPwdSenior) || 0, 0)
    const regCount = Math.max(parseInt(numRegular) || 0, 0)
    const totalDiners = isRestaurant ? Math.max(pwdCount + regCount, 0) : Math.max(pwdCount || 1, 1)

    // Check if we're using exclusive PWD orders (mixed transaction)
    const exclusiveAmount = calculationMethod === 'exclusive' && exclusivePwdAmount ? parseFloat(exclusivePwdAmount) || 0 : 0
    const usingMixedTransaction = isRestaurant && exclusiveAmount > 0 && exclusiveAmount < amount

    let vatDiscount = 0
    let discount20 = 0
    let exclusiveItemsDiscount = 0
    let sharedItemsDiscount = 0
    let methodUsed: 'prorated' | 'exclusive' | 'mixed' = calculationMethod === 'exclusive' && exclusiveAmount > 0 ? 'exclusive' : 'prorated'

    if (usingMixedTransaction) {
      // Mixed Transaction: Split into Exclusive and Shared
      methodUsed = 'mixed'

      // 1. Calculate discount on Exclusive PWD Items (100% eligibility)
      const exclusiveBase = exclusiveAmount / 1.12
      const exclusiveVat = exclusiveAmount - exclusiveBase
      const exclusiveDiscount20 = exclusiveBase * 0.20
      exclusiveItemsDiscount = exclusiveVat + exclusiveDiscount20

      // 2. Calculate discount on Shared Items (Prorated eligibility)
      const sharedAmount = amount - exclusiveAmount
      const sharedBase = sharedAmount / 1.12
      const sharedVat = sharedAmount - sharedBase

      const sharedBasePerPerson = totalDiners > 0 ? sharedBase / totalDiners : 0
      const sharedVatPerPerson = totalDiners > 0 ? sharedVat / totalDiners : 0

      const eligibleCount = Math.min(pwdCount, totalDiners)
      const sharedVatDiscount = sharedVatPerPerson * eligibleCount
      const sharedDiscount20 = sharedBasePerPerson * eligibleCount * 0.20
      sharedItemsDiscount = sharedVatDiscount + sharedDiscount20

      // Total discounts
      vatDiscount = exclusiveVat + sharedVatDiscount
      discount20 = exclusiveDiscount20 + sharedDiscount20
    } else if (isRestaurant && useMemcForDineIn && memcPriceForDineIn && parseFloat(memcPriceForDineIn) > 0) {
      // MEMC Rule for Dine-in (when individual shares unclear)
      const memc = parseFloat(memcPriceForDineIn)
      const memcBase = memc / 1.12
      const memcVat = memc - memcBase

      // MEMC discount applies per PWD/Senior
      const eligibleCount = Math.min(pwdCount, totalDiners || pwdCount)
      vatDiscount = memcVat * eligibleCount
      discount20 = memcBase * 0.20 * eligibleCount
      methodUsed = 'prorated' // Still considered prorated in method tracking
    } else if (isRestaurant) {
      // Standard Prorated (everyone shares equally)
      const baseAmount = amount / 1.12
      const vatAmount = amount - baseAmount
      const baseAmountPerPerson = totalDiners > 0 ? baseAmount / totalDiners : 0
      const vatAmountPerPerson = totalDiners > 0 ? vatAmount / totalDiners : 0

      const eligibleCount = Math.min(pwdCount, totalDiners)
      vatDiscount = vatAmountPerPerson * eligibleCount
      discount20 = baseAmountPerPerson * eligibleCount * 0.20
    } else {
      // Solo PWD/Senior (not restaurant)
      const baseAmount = amount / 1.12
      const vatAmount = amount - baseAmount
      vatDiscount = vatAmount
      discount20 = baseAmount * 0.20
    }

    // Service Charge Calculation (unchanged)
    const baseAmount = amount / 1.12
    const vatAmount = amount - baseAmount
    const excludedAmountValue = Math.max(parseFloat(serviceChargeExcluded) || 0, 0)
    const scRate = hasServiceCharge ? (parseFloat(serviceChargeRate) || 0) / 100 : 0
    const manualScValue = manualScMode && manualScAmount.trim() !== '' ? Math.max(parseFloat(manualScAmount) || 0, 0) : null

    let autoServiceChargeBase = amount
    if (serviceChargeBase === 'net') {
      autoServiceChargeBase = baseAmount
    } else if (serviceChargeBase === 'post') {
      const discountImpact = discount20 + vatDiscount
      autoServiceChargeBase = Math.max(amount - discountImpact, 0)
    }
    autoServiceChargeBase = Math.max(autoServiceChargeBase - excludedAmountValue, 0)

    const autoServiceChargeTotal = hasServiceCharge ? autoServiceChargeBase * scRate : 0
    const serviceChargeTotal = manualScValue !== null ? manualScValue : autoServiceChargeTotal
    const serviceChargeSource: 'auto' | 'manual' = manualScValue !== null ? 'manual' : 'auto'

    // Service Charge Exemption Calculation
    let serviceChargeExemption = 0

    if (hasServiceCharge) {
      if (usingMixedTransaction) {
        // Mixed Transaction: Calculate SC exemption based on actual consumption
        // SC on exclusive items (100% PWD consumption)
        const exclusiveScExemption = exclusiveAmount * scRate

        // SC on shared items (prorated by headcount)
        const sharedAmount = amount - exclusiveAmount
        const sharedScTotal = sharedAmount * scRate
        const sharedScPerPerson = totalDiners > 0 ? sharedScTotal / totalDiners : 0
        const sharedScExemption = sharedScPerPerson * Math.min(pwdCount, totalDiners)

        // Total exemption
        serviceChargeExemption = exclusiveScExemption + sharedScExemption
      } else if (isRestaurant) {
        // Standard Prorated: Divide SC equally by headcount
        const serviceChargePerPerson = totalDiners > 0 ? serviceChargeTotal / totalDiners : 0
        serviceChargeExemption = serviceChargePerPerson * Math.min(pwdCount, totalDiners)
      } else {
        // Solo PWD/Senior: Full exemption
        serviceChargeExemption = serviceChargeTotal
      }

      // Cap exemption at total SC
      serviceChargeExemption = Math.min(serviceChargeExemption, serviceChargeTotal)
    }

    const totalBeforeDiscounts = baseAmount + vatAmount + serviceChargeTotal
    const totalDiscounts = vatDiscount + discount20 + serviceChargeExemption
    const amountToPay = Math.max(totalBeforeDiscounts - totalDiscounts, 0)

    setRmResult({
      baseAmount,
      vatAmount,
      serviceChargeTotal,
      serviceChargeSource,
      serviceChargeBase: serviceChargeBase,
      vatDiscount,
      discount20,
      serviceChargeExemption,
      totalDiscount: totalDiscounts,
      amountToPay,
      exclusiveItemsDiscount: usingMixedTransaction ? exclusiveItemsDiscount : undefined,
      sharedItemsDiscount: usingMixedTransaction ? sharedItemsDiscount : undefined,
      methodUsed,
      exclusiveAmount: usingMixedTransaction ? exclusiveAmount : undefined,
      sharedAmount: usingMixedTransaction ? (amount - exclusiveAmount) : undefined
    })
  }

  const computeGroceries = () => {
    const amount = parseFloat(gAmount) || 0
    const remaining = parseFloat(gRemaining) || 0

    if (amount <= 0) return

    const discountableAmount = Math.min(amount, remaining)
    const discount5 = discountableAmount * 0.05
    const amountToPay = amount - discount5

    setGResult({
      discount5,
      amountToPay
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6 lg:space-y-8 lg:px-4 xl:px-8">

        {/* Header Section */}
        <div className="text-center space-y-4 py-4 md:py-6">

          {/* Language Toggle */}
          <div className="flex justify-center items-center gap-2 mb-2">
            <div className="flex bg-white rounded-full p-1 shadow-sm border border-slate-200">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('fil')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'fil' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                FIL
              </button>
              <button
                onClick={() => setLanguage('ceb')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'ceb' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                CEB
              </button>
            </div>
          </div>

          {/* Main App Title */}
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
              Karapat Discount
            </h1>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-700 text-xs md:text-sm font-bold">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              <span>{t('appTitle')}</span>
            </div>
          </div>

          <h2 className="text-xl md:text-2xl font-bold text-slate-700 tracking-tight">
            Senior Citizen & PWD <span className="text-blue-600">Discount Calculator</span>
          </h2>

          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto">
            {t('appSubtitle')}
          </p>

          {/* Law Reference Banner */}
          <div className="max-w-4xl mx-auto px-4 mt-4">
            <a
              href="https://www.officialgazette.gov.ph/2016/03/23/republic-act-no-10754/"
              target="_blank"
              rel="noopener noreferrer"
              className="group block p-4 md:p-6 lg:p-8 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all border-2 border-blue-700 hover:border-blue-500"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex-shrink-0 p-2.5 sm:p-3 rounded-lg bg-white/20 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                  <Scale className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-base sm:text-lg">Republic Act No. 10754</h3>
                    <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 opacity-80 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                  <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                    View the official law that grants PWDs and Senior Citizens their discount privileges
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Main Content - Mobile First: Single Column, Desktop: Split View */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-4 md:gap-6 lg:gap-8">
          {/* Input Section - Mobile First */}
          <div className="w-full lg:col-span-7 space-y-4 md:space-y-6 lg:space-y-6">
            <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm lg:h-fit">
              <CardHeader className="pb-4 pt-4 border-b bg-gradient-to-r from-slate-50 to-blue-50/50">
                <CardTitle className="text-2xl font-bold flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Calculator className="w-5 h-5 text-blue-600" />
                  </div>
                  Calculate Your Discount
                </CardTitle>
                <CardDescription className="text-base">
                  Select category and enter your bill details
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4 md:pt-6">
                {/* Category Switcher */}
                <div className="flex p-1 bg-slate-100 rounded-xl mb-4">
                  <button
                    onClick={() => {
                      setActiveCategory('calculators')
                      setActiveTab('restaurant')
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeCategory === 'calculators'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {t('categories.calculators')}
                  </button>
                  <button
                    onClick={() => {
                      setActiveCategory('tools')
                      setActiveTab('auth-letter')
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeCategory === 'tools'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                      }`}
                  >
                    {t('categories.tools')}
                  </button>
                </div>

                <Tabs defaultValue="restaurant" value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="flex flex-wrap w-full mb-4 md:mb-6 lg:mb-8 h-auto bg-slate-100 p-1 md:p-1.5 rounded-xl gap-1">
                    {activeCategory === 'calculators' ? (
                      <>
                        <TabsTrigger
                          value="restaurant"
                          className="flex-1 min-w-[90px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                            <Utensils className="w-4 h-4" />
                            <span>{t('tabs.dining')}</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="medicine"
                          className="flex-1 min-w-[90px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                            <Pill className="w-4 h-4" />
                            <span>{t('tabs.medicine')}</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="groceries"
                          className="flex-1 min-w-[90px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                            <ShoppingCart className="w-4 h-4" />
                            <span>{t('tabs.groceries')}</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="utilities"
                          className="flex-1 min-w-[90px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                            <Zap className="w-4 h-4" />
                            <span>{t('tabs.utilities')}</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="transport"
                          className="flex-1 min-w-[90px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                            <Plane className="w-4 h-4" />
                            <span>{t('tabs.transport')}</span>
                          </div>
                        </TabsTrigger>
                      </>
                    ) : (
                      <>
                        <TabsTrigger
                          value="auth-letter"
                          className="flex-1 min-w-[90px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                            <FileText className="w-4 h-4" />
                            <span>{t('tabs.letter')}</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="savings"
                          className="flex-1 min-w-[90px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>{t('tabs.savings')}</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="places"
                          className="flex-1 min-w-[90px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{t('tabs.places')}</span>
                          </div>
                        </TabsTrigger>
                        <TabsTrigger
                          value="legal"
                          className="flex-1 min-w-[90px] data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg text-xs md:text-sm font-semibold transition-all min-h-[44px] touch-manipulation"
                        >
                          <div className="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                            <Scale className="w-4 h-4" />
                            <span>{t('tabs.legal')}</span>
                          </div>
                        </TabsTrigger>
                      </>
                    )}
                  </TabsList>

                  <TabsContent value="auth-letter" className="mt-0">
                    <AuthorizationLetterGenerator />
                  </TabsContent>

                  <TabsContent value="savings" className="mt-0">
                    <SavingsDashboard />
                  </TabsContent>
                  <TabsContent value="places" className="mt-0">
                    <EstablishmentTracker />
                  </TabsContent>

                  <TabsContent value="legal" className="mt-0">
                    <LegalSection />
                  </TabsContent>

                  <TabsContent value="restaurant" className="space-y-4 md:space-y-6 mt-0">
                    {/* Dining Mode Toggle */}
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                      <button
                        type="button"
                        onClick={() => setDiningMode('dine-in')}
                        className={cn(
                          'py-2.5 text-sm font-bold rounded-lg transition-all',
                          diningMode === 'dine-in'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        )}
                      >
                        Dine-in
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiningMode('takeout')}
                        className={cn(
                          'py-2.5 text-sm font-bold rounded-lg transition-all',
                          diningMode === 'takeout'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                        )}
                      >
                        Takeout
                      </button>
                    </div>

                    <div className={cn("space-y-4 md:space-y-5", diningMode !== 'dine-in' && "hidden")}>
                      {/* Simple/Advanced Mode Toggle */}
                      <div className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200">
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-700">Calculator Mode</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {isAdvancedMode ? 'All features visible' : 'Essential features only'}
                          </p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            type="button"
                            onClick={() => setIsAdvancedMode(false)}
                            className={cn(
                              'px-4 py-2 rounded-lg text-sm font-semibold transition-all touch-manipulation min-h-[44px]',
                              !isAdvancedMode
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'bg-white text-slate-600 hover:bg-slate-100'
                            )}
                          >
                            Simple
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAdvancedMode(true)}
                            className={cn(
                              'px-4 py-2 rounded-lg text-sm font-semibold transition-all touch-manipulation min-h-[44px]',
                              isAdvancedMode
                                ? 'bg-indigo-600 text-white shadow-md'
                                : 'bg-white text-slate-600 hover:bg-slate-100'
                            )}
                          >
                            Advanced
                          </button>
                        </div>
                      </div>

                      {/* Amount Input */}
                      <div className="space-y-2.5">
                        <Label htmlFor="rm-amount" className="text-base font-semibold text-slate-700">Bill Amount</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₱</span>
                          <Input
                            id="rm-amount"
                            type="number"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={rmAmount}
                            onChange={(e) => setRmAmount(e.target.value)}
                            className="pl-10 h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl touch-manipulation"
                          />
                        </div>
                      </div>

                      {/* Toggle */}
                      <div className="flex items-center justify-between p-4 rounded-xl border-2 border-slate-200 bg-gradient-to-br from-white to-slate-50 hover:border-blue-300 transition-all min-h-[60px]">
                        <div className="space-y-0.5 flex-1">
                          <Label className="text-sm font-bold cursor-pointer text-slate-700" htmlFor="rm-restaurant-toggle">Group Dining</Label>
                          <p className="text-xs text-slate-500">Split bill with others?</p>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <CustomSwitch
                            id="rm-restaurant-toggle"
                            checked={isRestaurant}
                            onCheckedChange={setIsRestaurant}
                          />
                        </div>
                      </div>

                      {/* MEMC Option for Dine-in */}


                      {/* Advanced Options for Mixed Transactions */}
                      {isRestaurant && isAdvancedMode && (
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="advanced" className="border-0 border-b-0">
                            <div className="border-2 border-indigo-400 rounded-xl bg-gradient-to-br from-white to-indigo-50/30 shadow-sm overflow-hidden">
                              <AccordionTrigger className="px-4 md:px-6 py-4 hover:bg-indigo-50 hover:no-underline">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 rounded-lg bg-indigo-100">
                                    <Sparkles className="w-5 h-5 text-indigo-600" />
                                  </div>
                                  <span className="font-bold text-slate-900 text-base md:text-lg">Advanced Options</span>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-4 md:px-6 pb-5">
                                <div className="space-y-4 pt-2 pb-1">
                                  {/* Calculation Method Selection */}
                                  <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">Calculation Method</Label>
                                    <div className="grid grid-cols-2 gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setCalculationMethod('prorated')}
                                        className={cn(
                                          'rounded-xl border-2 px-4 py-3 text-left transition-all touch-manipulation min-h-[44px]',
                                          calculationMethod === 'prorated'
                                            ? 'border-blue-600 bg-blue-50 shadow-sm'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                        )}
                                      >
                                        <p className="text-sm font-semibold text-slate-800">Prorated</p>
                                        <p className="text-[11px] text-slate-500">Divide whole bill</p>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setCalculationMethod('exclusive')}
                                        className={cn(
                                          'rounded-xl border-2 px-4 py-3 text-left transition-all touch-manipulation min-h-[44px]',
                                          calculationMethod === 'exclusive'
                                            ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                                            : 'border-slate-200 bg-white hover:border-slate-300'
                                        )}
                                      >
                                        <p className="text-sm font-semibold text-slate-800">Exclusive</p>
                                        <p className="text-[11px] text-slate-500">Separate PWD orders</p>
                                      </button>
                                    </div>
                                  </div>

                                  {/* Exclusive PWD Amount Input */}
                                  {calculationMethod === 'exclusive' && (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                      <Label htmlFor="exclusive-pwd-amount" className="text-sm font-semibold text-slate-700">
                                        Exclusive PWD/Senior Orders (Optional)
                                      </Label>
                                      <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₱</span>
                                        <Input
                                          id="exclusive-pwd-amount"
                                          type="number"
                                          inputMode="decimal"
                                          placeholder="0.00"
                                          value={exclusivePwdAmount}
                                          onChange={(e) => setExclusivePwdAmount(e.target.value)}
                                          className="pl-10 h-14 text-base font-semibold bg-white border-2 touch-manipulation"
                                        />
                                      </div>
                                      <p className="text-xs text-slate-600 leading-relaxed">
                                        Enter the total amount of items consumed <strong>ONLY</strong> by PWD/Senior diners.
                                        <br />
                                        <strong>Example:</strong> If PWD ordered a ₱2,000 steak while others shared cheaper items,
                                        enter ₱2,000 here for maximum discount accuracy.
                                      </p>
                                    </div>
                                  )}

                                  {/* Instructions */}
                                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg text-xs">
                                    <p className="font-semibold text-blue-900 mb-2">When to use each method:</p>
                                    <ul className="space-y-1.5 text-slate-700">
                                      <li className="flex items-start gap-2">
                                        <span className="text-blue-600 mt-0.5">•</span>
                                        <span><strong>Prorated:</strong> Use when everyone shared all food equally (most common scenario)</span>
                                      </li>
                                      <li className="flex items-start gap-2">
                                        <span className="text-indigo-600 mt-0.5">•</span>
                                        <span><strong>Exclusive:</strong> Use when PWD/Senior ordered expensive items separately that others didn't share</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </AccordionContent>
                            </div>
                          </AccordionItem>
                        </Accordion>
                      )}

                      {/* Spacer between Advanced Options and Service Charge */}
                      <div className="h-4"></div>

                      <div className="p-4 md:p-6 lg:p-8 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200 space-y-4">
                        <div className="flex items-center justify-between min-h-[60px]">
                          <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2 text-orange-700 font-bold">
                              <Percent className="w-5 h-5" />
                              <span>Service Charge</span>
                            </div>
                            <p className="text-xs text-orange-600 font-medium">PWD/Senior share is always exempt (DTI/BIR)</p>
                          </div>
                          <div className="flex-shrink-0 ml-4">
                            <CustomSwitch
                              id="rm-sc-toggle"
                              checked={hasServiceCharge}
                              onCheckedChange={setHasServiceCharge}
                            />
                          </div>
                        </div>

                        {isAdvancedMode && (
                          <div className="rounded-xl border border-dashed border-orange-300 bg-white/70 p-3 text-xs text-slate-600 animate-in fade-in">
                            <p className="font-semibold text-slate-800">Quick guide</p>
                            <ol className="mt-1 list-decimal space-y-1 pl-4">
                              <li>Enter your bill and the Service Charge rate (10% is typical).</li>
                              <li>Select how the restaurant calculated the Service Charge, or switch to Manual Service Charge Audit if you have the printed amount.</li>
                              <li>Run the calculation to verify the receipt and the PWD/Senior exemption.</li>
                            </ol>
                          </div>
                        )}

                        {hasServiceCharge && (
                          <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                            <div>
                              <Label htmlFor="rm-sc-rate" className="text-sm font-semibold text-slate-700">Rate (%)</Label>
                              <div className="relative mt-2">
                                <Input
                                  id="rm-sc-rate"
                                  type="number"
                                  inputMode="decimal"
                                  value={serviceChargeRate}
                                  onChange={(e) => setServiceChargeRate(e.target.value)}
                                  className="bg-white border-2 pr-10 h-14 text-base font-semibold touch-manipulation"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">%</span>
                              </div>
                            </div>

                            {isAdvancedMode && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-sm font-semibold text-slate-700">Service Charge Base</Label>
                                  <div className="grid sm:grid-cols-3 gap-2">
                                    {SERVICE_CHARGE_BASE_OPTIONS.map((option) => (
                                      <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => setServiceChargeBase(option.value)}
                                        className={cn(
                                          'rounded-xl border px-3 py-3 text-left transition-colors',
                                          serviceChargeBase === option.value
                                            ? 'border-blue-600 bg-white shadow-sm'
                                            : 'border-slate-200 bg-white/80'
                                        )}
                                      >
                                        <p className="text-sm font-semibold text-slate-800">{option.label}</p>
                                        <p className="text-[11px] text-slate-500">{option.helper}</p>
                                      </button>
                                    ))}
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="rm-sc-excluded" className="text-sm font-semibold text-slate-700">Exclude from Service Charge (retail goods, corkage, etc.)</Label>
                                  <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₱</span>
                                    <Input
                                      id="rm-sc-excluded"
                                      type="number"
                                      inputMode="decimal"
                                      value={serviceChargeExcluded}
                                      onChange={(e) => setServiceChargeExcluded(e.target.value)}
                                      className="pl-10 h-14 text-base font-semibold bg-white border-2 touch-manipulation"
                                    />
                                  </div>
                                  <p className="text-[11px] text-slate-500">
                                    Enter the total value of items that should not be charged a service fee (for example: bottled goods, retail products, or corkage).
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        )}

                        {isAdvancedMode && (
                          <div className="pt-4 border-t border-orange-200">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                              <div>
                                <p className="text-sm font-semibold text-slate-800">Manual Service Charge Audit</p>
                                <p className="text-xs text-slate-600">Enter the exact Service Charge printed on the receipt for instant verification.</p>
                              </div>
                              <Button
                                type="button"
                                variant={manualScMode ? 'default' : 'outline'}
                                className={cn('w-full md:w-auto', manualScMode ? 'bg-orange-500 hover:bg-orange-600' : '')}
                                onClick={() => setManualScMode((prev) => !prev)}
                              >
                                {manualScMode ? 'Hide Manual Audit' : 'Enter Manual Service Charge'}
                              </Button>
                            </div>

                            {manualScMode && (
                              <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="rm-sc-manual" className="text-sm font-semibold text-slate-700">Printed Service Charge (₱)</Label>
                                <Input
                                  id="rm-sc-manual"
                                  type="number"
                                  inputMode="decimal"
                                  value={manualScAmount}
                                  onChange={(e) => setManualScAmount(e.target.value)}
                                  className="h-14 text-base font-semibold bg-white border-2 touch-manipulation"
                                  placeholder="217.71"
                                />
                                <p className="text-xs text-slate-600">
                                  Tip: Copy the amount exactly as shown on the official receipt. We'll handle the exemption math automatically.
                                </p>

                                {/* Service Charge Percentage Finder */}
                                {manualScAmount && parseFloat(manualScAmount) > 0 && rmAmount && parseFloat(rmAmount) > 0 && (
                                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="text-xs font-semibold text-blue-900 mb-2">Service Charge Percentage:</p>
                                    <div className="space-y-1.5">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-600">On Subtotal (with VAT):</span>
                                        <span className="font-bold text-blue-700">
                                          {((parseFloat(manualScAmount) / parseFloat(rmAmount)) * 100).toFixed(2)}%
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-slate-600">On Base (without VAT):</span>
                                        <span className="font-bold text-blue-700">
                                          {((parseFloat(manualScAmount) / (parseFloat(rmAmount) / 1.12)) * 100).toFixed(2)}%
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            <Accordion type="single" collapsible className="mt-4 rounded-xl border border-orange-200 bg-white/70">
                              <AccordionItem value="sc-guide" className="border-none">
                                <AccordionTrigger className="text-sm font-semibold text-slate-800 px-4">
                                  Service Charge Guide
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4 text-xs text-slate-600 space-y-2">
                                  <p><strong>Menu Price:</strong> Standard method. 10% of the total bill amount. Use this for most restaurants.</p>
                                  <p><strong>Price without VAT:</strong> Some hotels remove VAT first before applying the Service Charge. 10% of the amount before tax is added.</p>
                                  <p><strong>Discounted Price:</strong> Rare receipts subtract discounts before calculating the Service Charge. 10% of the amount after discounts are removed.</p>
                                  <p><strong>Manual Service Charge Audit:</strong> When in doubt, open Manual Service Charge Audit and type the amount printed on the receipt—this keeps the exemption accurate.</p>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </div>
                        )}
                      </div>

                      {/* Restaurant Group Options */}
                      {isRestaurant && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                          {/* Group Details */}
                          <div className="p-4 md:p-6 lg:p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 space-y-4">
                            <div className="flex items-center gap-2 text-blue-700 font-bold pb-2">
                              <Users className="w-5 h-5" />
                              <span>Group Details</span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="rm-pwd-count" className="text-sm font-semibold text-slate-700">Senior/PWD Count</Label>
                                <Input
                                  id="rm-pwd-count"
                                  type="number"
                                  inputMode="numeric"
                                  min="1"
                                  value={numPwdSenior}
                                  onChange={(e) => setNumPwdSenior(e.target.value)}
                                  className="bg-white border-2 h-14 text-base font-semibold touch-manipulation"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="rm-reg-count" className="text-sm font-semibold text-slate-700">Regular Diners</Label>
                                <Input
                                  id="rm-reg-count"
                                  type="number"
                                  inputMode="numeric"
                                  min="0"
                                  value={numRegular}
                                  onChange={(e) => setNumRegular(e.target.value)}
                                  className="bg-white border-2 h-14 text-base font-semibold touch-manipulation"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={computeRestaurantMedicine}
                        className="w-full h-14 text-base md:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 touch-manipulation min-h-[44px]"
                        size="lg"
                      >
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculate Discount
                      </Button>
                    </div>

                    {diningMode === 'takeout' && (
                      <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                        <TakeoutCalculator />
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="groceries" className="space-y-4 md:space-y-6 mt-0">
                    <div className="p-4 rounded-xl bg-green-50 border-2 border-green-200 text-green-800 text-sm flex gap-3">
                      <Info className="w-5 h-5 shrink-0 text-green-600 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong>Weekly Cap:</strong> 5% discount limited to ₱2,500 per week (max ₱125 discount).
                        VAT exemption applies to basic necessities and prime commodities.
                      </p>
                    </div>

                    <div className="space-y-4 md:space-y-5">
                      <div className="space-y-2.5">
                        <Label htmlFor="g-amount" className="text-base font-semibold text-slate-700">Grocery Bill Amount</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₱</span>
                          <Input
                            id="g-amount"
                            type="number"
                            inputMode="decimal"
                            placeholder="0.00"
                            value={gAmount}
                            onChange={(e) => setGAmount(e.target.value)}
                            className="pl-10 h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl touch-manipulation"
                          />
                        </div>
                      </div>

                      <div className="space-y-2.5">
                        <Label htmlFor="g-remaining" className="text-base font-semibold text-slate-700">Remaining Weekly Allowance</Label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">₱</span>
                          <Input
                            id="g-remaining"
                            type="number"
                            inputMode="decimal"
                            value={gRemaining}
                            onChange={(e) => setGRemaining(e.target.value)}
                            className="pl-10 h-14 text-lg font-semibold bg-slate-50 border-2 border-slate-200 focus:border-green-500 focus:ring-green-500/20 rounded-xl touch-manipulation"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={computeGroceries}
                        className="w-full h-14 text-base md:text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 touch-manipulation min-h-[44px]"
                        size="lg"
                      >
                        <Calculator className="w-5 h-5 mr-2" />
                        Calculate Discount
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="medicine">
                    <MedicineCalculator onResultChange={setMedResult} />
                  </TabsContent>

                  <TabsContent value="utilities">
                    <UtilitiesCalculator onResultChange={setUtilResult} />
                  </TabsContent>

                  <TabsContent value="transport">
                    <TransportCalculator onResultChange={setTransResult} />
                  </TabsContent>

                  <TabsContent value="more" className="mt-0 space-y-6">
                    <Tabs defaultValue="legal" className="w-full">
                      <TabsList className="w-full grid grid-cols-4 bg-slate-100 p-1 rounded-lg mb-4">
                        <TabsTrigger value="legal" className="text-xs sm:text-sm">Rights</TabsTrigger>
                        <TabsTrigger value="complaint" className="text-xs sm:text-sm">Complaint</TabsTrigger>
                        <TabsTrigger value="audit" className="text-xs sm:text-sm">Audit</TabsTrigger>
                        <TabsTrigger value="city" className="text-xs sm:text-sm">City Perks</TabsTrigger>
                      </TabsList>

                      <TabsContent value="legal" className="mt-0">
                        <RightsFlashcards />
                      </TabsContent>

                      <TabsContent value="complaint" className="mt-0">
                        <ComplaintGenerator />
                      </TabsContent>

                      <TabsContent value="audit" className="mt-0">
                        <DiscountAuditor />
                      </TabsContent>

                      <TabsContent value="city" className="mt-0">
                        <CityOrdinanceChecker />
                      </TabsContent>
                    </Tabs>

                    <Separator />

                    {/* About Section moved here */}
                    <div className="space-y-4 text-slate-600 pt-4">
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />
                        About Karapat Discount
                      </h3>
                      <p className="text-sm leading-relaxed">
                        This calculator helps Senior Citizens and Persons with Disability (PWD) in the Philippines compute their entitled discounts for medicines, restaurants, groceries, utilities, and travel.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="bg-slate-50">RA 10754</Badge>
                        <Badge variant="outline" className="bg-slate-50">RA 9994</Badge>
                        <Badge variant="outline" className="bg-slate-50">JMC 01-2022</Badge>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="about" className="mt-0">
                    <div className="space-y-4 md:space-y-5 lg:space-y-6 text-slate-600">
                      <p className="text-base md:text-lg leading-relaxed">
                        This calculator helps Senior Citizens and Persons with Disability (PWD) in the Philippines compute their entitled discounts for medicines, restaurants, and groceries.
                      </p>

                      {/* Coverage & Legal Information */}
                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="coverage" className="border-2 border-slate-200 rounded-xl overflow-hidden">
                          <AccordionTrigger className="px-4 md:px-6 py-4 hover:bg-slate-50 hover:no-underline">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-blue-100">
                                <Info className="w-5 h-5 text-blue-600" />
                              </div>
                              <span className="font-bold text-slate-900 text-base md:text-lg">Coverage & Legal Information</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 md:px-6 pb-4">
                            <div className="pt-2">
                              <CoverageLegalContent />
                            </div>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="complaint" className="border-b-0">
                          <AccordionTrigger className="hover:no-underline hover:bg-slate-50 px-4 rounded-lg">
                            <div className="flex items-center gap-3 text-left">
                              <div className="p-2 bg-red-100 rounded-lg">
                                <FileText className="w-5 h-5 text-red-600" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">File a Complaint</p>
                                <p className="text-xs text-slate-500 font-normal">Generate a formal letter for violations</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-2 pb-6">
                            <ComplaintGenerator />
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="offline-card" className="border-b-0">
                          <AccordionTrigger className="hover:no-underline hover:bg-slate-50 px-4 rounded-lg">
                            <div className="flex items-center gap-3 text-left">
                              <div className="p-2 bg-slate-800 rounded-lg">
                                <Zap className="w-5 h-5 text-yellow-400" />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">Offline Emergency Card</p>
                                <p className="text-xs text-slate-500 font-normal">Save your rights for offline use</p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-4 pt-2 pb-6">
                            <OfflineEmergencyCard />
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>

                      {/* Official Tax Computation Guidelines - The Bible */}
                      <div className="p-4 md:p-6 lg:p-8 rounded-xl bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-2 border-purple-300 shadow-lg">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2.5 rounded-lg bg-purple-100 flex-shrink-0">
                            <Scale className="w-6 h-6 text-purple-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-lg sm:text-xl mb-1">Official Tax Computation Guidelines</h4>
                            <p className="text-sm sm:text-base text-slate-700 font-semibold mb-3">
                              The authoritative sources for discount and tax calculations (applicable to both PWDs and Senior Citizens)
                            </p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          {/* JMC No. 01-2022 */}
                          <div className="p-4 rounded-lg bg-white border-2 border-purple-200 hover:border-purple-400 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="p-1.5 rounded bg-purple-100 flex-shrink-0 mt-0.5">
                                <FileText className="w-4 h-4 text-purple-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-purple-900 text-sm sm:text-base mb-1">
                                  Joint Memorandum Circular No. 01, Series of 2022
                                </h5>
                                <p className="text-xs sm:text-sm text-slate-600 mb-2 leading-relaxed">
                                  Guidelines on the Provision of Mandatory Statutory Benefits and Privileges for Senior Citizens and PWDs.
                                  <strong className="text-purple-700"> This is the primary reference for tax computation in both single and group dining scenarios.</strong>
                                </p>
                                <p className="text-xs text-slate-500 mb-2">
                                  Issued by: DTI, DSWD, NCSC, NCDA, DOH, BIR, DILG
                                </p>
                                <a
                                  href="https://drive.google.com/file/d/1gcAkuBmMyUR9-8wqM_bijfbIKOCfxmRG/view"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-purple-600 hover:text-purple-700 font-semibold text-xs sm:text-sm group"
                                >
                                  <span>View Joint Memorandum Circular No. 01-2022</span>
                                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* Revenue Regulations No. 5-2017 */}
                          <div className="p-4 rounded-lg bg-white border-2 border-blue-200 hover:border-blue-400 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="p-1.5 rounded bg-blue-100 flex-shrink-0 mt-0.5">
                                <FileText className="w-4 h-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-blue-900 text-sm sm:text-base mb-1">
                                  Revenue Regulations No. 5-2017
                                </h5>
                                <p className="text-xs sm:text-sm text-slate-600 mb-2 leading-relaxed">
                                  Rules and Regulations Implementing RA 10754 relative to Tax Privileges of PWDs and Tax Incentives for Establishments.
                                </p>
                                <p className="text-xs text-slate-500 mb-2">
                                  Issued by: Bureau of Internal Revenue (BIR)
                                </p>
                                <a
                                  href="https://ncda.gov.ph/disability-laws/implementing-rules-and-regulations-irr/revenue-regulations-no-5-2017-rules-and-regulations-implementing-republic-act-no-10754/"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-semibold text-xs sm:text-sm group"
                                >
                                  <span>View Revenue Regulations No. 5-2017</span>
                                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </a>
                              </div>
                            </div>
                          </div>

                          {/* DOJ Opinion No. 45-2024 */}
                          <div className="p-4 rounded-lg bg-white border-2 border-green-200 hover:border-green-400 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="p-1.5 rounded bg-green-100 flex-shrink-0 mt-0.5">
                                <FileText className="w-4 h-4 text-green-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h5 className="font-bold text-green-900 text-sm sm:text-base mb-1">
                                  DOJ Opinion No. 45, Series of 2024
                                </h5>
                                <p className="text-xs sm:text-sm text-slate-600 mb-2 leading-relaxed">
                                  Department of Justice Opinion clarifying PWD entitlements including service charge exemptions and group dining scenarios.
                                </p>
                                <p className="text-xs text-slate-500 mb-2">
                                  Issued by: Department of Justice (DOJ)
                                </p>
                                <p className="text-xs text-green-700 font-medium">
                                  Available in official DOJ records and NCDA documentation
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* RA 10754 Link */}
                      <div className="p-4 md:p-6 lg:p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-blue-100 flex-shrink-0">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-900 text-base sm:text-lg mb-2">Republic Act No. 10754</h4>
                            <a
                              href="https://www.officialgazette.gov.ph/2016/03/23/republic-act-no-10754/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base group"
                            >
                              <span>View RA 10754 - Official Gazette</span>
                              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1">
                              Enacted March 23, 2016 - An Act Expanding the Benefits and Privileges of Persons with Disability
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Key Provisions Highlight */}
                      <div className="space-y-4">
                        <h4 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Key Provisions</Badge>
                          Important Benefits Under RA 10754
                        </h4>
                        <div className="space-y-3">
                          <div className="p-4 rounded-lg bg-green-50 border-l-4 border-green-500">
                            <div className="flex items-start gap-3">
                              <div className="p-1.5 rounded bg-green-100 flex-shrink-0 mt-0.5">
                                <Percent className="w-4 h-4 text-green-600" />
                              </div>
                              <div>
                                <h5 className="font-bold text-green-900 text-sm sm:text-base mb-1">20% Discount on Goods & Services</h5>
                                <p className="text-xs sm:text-sm text-green-800 leading-relaxed">
                                  PWDs and Senior Citizens are entitled to a <strong>20% discount</strong> on the VAT-exclusive selling price of goods and services for their exclusive use and enjoyment.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-blue-50 border-l-4 border-blue-500">
                            <div className="flex items-start gap-3">
                              <div className="p-1.5 rounded bg-blue-100 flex-shrink-0 mt-0.5">
                                <Receipt className="w-4 h-4 text-blue-600" />
                              </div>
                              <div>
                                <h5 className="font-bold text-blue-900 text-sm sm:text-base mb-1">VAT Exemption</h5>
                                <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                                  <strong>Exemption from Value-Added Tax (VAT)</strong> on the sale of goods and services. The discount is applied to the price <strong>net of VAT</strong>.
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-amber-50 border-l-4 border-amber-500">
                            <div className="flex items-start gap-3">
                              <div className="p-1.5 rounded bg-amber-100 flex-shrink-0 mt-0.5">
                                <Info className="w-4 h-4 text-amber-600" />
                              </div>
                              <div>
                                <h5 className="font-bold text-amber-900 text-sm sm:text-base mb-1">Calculation Method</h5>
                                <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
                                  According to BIR Revenue Regulations: <strong>1)</strong> Remove 12% VAT from total amount, <strong>2)</strong> Apply 20% discount on VAT-excluded amount. This ensures the discount is applied correctly per the law.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-bold text-slate-900 text-base sm:text-lg">Related Philippine Laws:</h4>
                        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base">
                          <li><strong>RA 10754</strong> - An Act Expanding the Benefits and Privileges of Persons with Disability (2016)</li>
                          <li><strong>RA 9994</strong> - Expanded Senior Citizens Act of 2010</li>
                          <li><strong>RA 7581</strong> - The Price Act (Groceries - 5% discount)</li>
                        </ul>
                        <p className="text-xs text-slate-500 mt-2 italic">
                          Note: The tax computation guidelines above apply to both PWDs (RA 10754) and Senior Citizens (RA 9994) as confirmed by the Joint Memorandum Circular No. 01-2022.
                        </p>
                      </div>

                      <div className="p-4 md:p-6 bg-orange-50 border-2 border-orange-200 rounded-lg space-y-3">
                        <h5 className="font-bold text-orange-900 text-base sm:text-lg">Service Charge Exemption</h5>

                        <div>
                          <p className="text-sm text-orange-800 font-semibold mb-1">Republic Act No. 10754, Section 32:</p>
                          <p className="text-sm text-orange-700 leading-relaxed pl-4 border-l-2 border-orange-300">
                            PWDs are entitled to discounts and exemptions on "fees and charges relative to the utilization of all services in hotels and similar lodging establishments; restaurants and recreation centers."
                          </p>
                        </div>

                        <div className="pt-2 border-t border-orange-200">
                          <p className="text-sm text-orange-800 font-semibold mb-1">DOJ Opinion No. 45, Series of 2024:</p>
                          <p className="text-sm text-orange-700 leading-relaxed">
                            PWDs and Senior Citizens are exempt from service charges on their proportional share of consumption.
                          </p>
                        </div>

                        <div className="pt-2 border-t border-orange-200">
                          <p className="text-sm text-orange-800 font-semibold mb-1">What is a Service Charge?</p>
                          <p className="text-sm text-orange-700 leading-relaxed">
                            An additional fee (typically 10%) that restaurants and hotels add to your bill for service. This is separate from tips and is usually mandatory.
                          </p>
                        </div>

                        <div className="pt-2 border-t border-orange-200">
                          <p className="text-sm text-orange-800 font-semibold mb-2">How the Exemption Works:</p>
                          <ul className="text-sm text-orange-700 space-y-1.5 list-disc pl-5">
                            <li><strong>Single Purchase:</strong> You are <strong>FULLY EXEMPT</strong>—no service charge should be charged.</li>
                            <li><strong>Group Dining:</strong> Service charge is divided among all diners. Your share is <strong>FULLY EXEMPT</strong>. Only regular diners pay their share.</li>
                          </ul>
                          <p className="text-sm text-orange-800 font-semibold mt-2">
                            <strong>Important:</strong> This is a complete exemption, not a discount. You should not pay any service charge on your portion.
                          </p>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-500 italic pt-2">
                        Note: This tool is for estimation purposes. Actual discounts may vary slightly due to rounding. Always refer to the official law for complete details.
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <CoverageCard
              isExpanded={isCoverageExpanded}
              onToggle={() => setIsCoverageExpanded(prev => !prev)}
              className="hidden lg:block"
            />
          </div>

          {/* Receipt/Results - Mobile: Below Input, Desktop: Right Side */}
          <div className="w-full lg:col-span-5 lg:sticky lg:top-6">
            <Card className="border-0 shadow-2xl bg-white overflow-hidden lg:h-fit">
              {/* Receipt Header */}
              <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 p-4 md:p-6 lg:p-8 text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-10">
                  <Receipt className="w-32 h-32 sm:w-40 sm:h-40" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-2 sm:gap-3 mb-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-2 sm:p-2.5 rounded-lg bg-white/10 backdrop-blur-sm">
                        <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <CardTitle className="text-xl sm:text-2xl font-bold">Bill Summary</CardTitle>
                    </div>
                    <div className="flex gap-1 sm:gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowRecentCalcs(!showRecentCalcs)}
                        className="text-white/80 hover:text-white hover:bg-white/20 h-8 px-2 sm:px-3 touch-manipulation min-h-[44px]"
                        title="Recent calculations"
                      >
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                      </Button>
                      {(rmResult || gResult || medResult || utilResult || transResult) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={clearBill}
                          className="text-white/80 hover:text-white hover:bg-white/20 h-8 px-2 sm:px-3 touch-manipulation min-h-[44px]"
                          title="Clear bill"
                        >
                          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
                          <span className="text-xs sm:text-sm">Clear</span>
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-slate-300 text-sm sm:text-base">
                    Your discount breakdown
                  </CardDescription>
                </div>
              </div>

              <CardContent className="p-0">
                <div className="p-4 md:p-6 lg:p-8 space-y-4 md:space-y-6">
                  {/* Recent Calculations */}
                  {showRecentCalcs && (
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3 border-2 border-slate-200 animate-in fade-in slide-in-from-top-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Recent Calculations
                        </h3>
                        <button
                          onClick={() => setShowRecentCalcs(false)}
                          className="text-slate-400 hover:text-slate-600 touch-manipulation p-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {(() => {
                        const saved = getSavedCalculations()
                        if (saved.length === 0) {
                          return (
                            <p className="text-sm text-slate-500 text-center py-4">
                              No saved calculations yet. Click "Save" to store calculations.
                            </p>
                          )
                        }

                        return (
                          <div className="space-y-2 max-h-[400px] overflow-y-auto scrollable">
                            {saved.map((calc) => (
                              <div
                                key={calc.id}
                                className="bg-white rounded-lg p-3 border border-slate-200 hover:border-slate-300 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant={calc.type === 'restaurant' ? 'default' : 'secondary'} className="h-5 text-[10px]">
                                        {calc.type === 'restaurant' ? 'Restaurant' : 'Groceries'}
                                      </Badge>
                                      <span className="text-[10px] text-slate-500">
                                        {new Date(calc.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <div className="text-sm">
                                      <span className="font-semibold text-slate-900">
                                        {formatCurrency(calc.results.amountToPay)}
                                      </span>
                                      <span className="text-slate-500 mx-1">·</span>
                                      <span className="text-green-600 text-xs">
                                        Saved {formatCurrency(calc.results.totalDiscount || calc.results.discount5 || 0)}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={async () => {
                                        const text = formatCalculationForSharing(calc)
                                        await copyToClipboard(text, calc.id)
                                      }}
                                      className="h-8 w-8 p-0"
                                    >
                                      {copiedId === calc.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        deleteCalculation(calc.id)
                                        // Force re-render by toggling the view
                                        setShowRecentCalcs(false)
                                        setTimeout(() => setShowRecentCalcs(true), 0)
                                      }}
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      })()}
                    </div>
                  )}

                  {/* Restaurant/Medicine Results */}
                  {rmResult && (
                    <div className="space-y-4">
                      {/* Smart Suggestion for Advanced Mode */}
                      {!isAdvancedMode && isRestaurant && (parseFloat(rmAmount) > 2000 || (parseInt(numPwdSenior) + parseInt(numRegular)) > 2) && (
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300 p-4 rounded-xl animate-in fade-in slide-in-from-top-2">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-lg bg-indigo-100 flex-shrink-0">
                              <Sparkles className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-indigo-900 text-sm mb-1">Want Maximum Accuracy?</p>
                              <p className="text-xs text-slate-700 mb-3">
                                For group dining or complex bills, <strong>Advanced Mode</strong> offers features like separate PWD orders calculation, service charge base selection, and manual receipt verification for precise discount calculations.
                              </p>
                              <button
                                onClick={() => setIsAdvancedMode(true)}
                                className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 underline"
                              >
                                Switch to Advanced Mode →
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Mixed Transaction Breakdown */}
                      {rmResult.methodUsed === 'mixed' && rmResult.exclusiveAmount && rmResult.sharedAmount && (
                        <div className="space-y-3 bg-indigo-50 border-2 border-indigo-200 p-4 rounded-xl -mx-2 px-4 animate-in fade-in slide-in-from-top-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <p className="font-bold text-indigo-900 text-sm md:text-base">Mixed Transaction Breakdown</p>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span className="text-indigo-700 font-semibold">Exclusive PWD Items:</span>
                              <span className="font-mono font-bold text-indigo-900">{formatCurrency(rmResult.exclusiveAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-indigo-700 font-semibold">Shared Items:</span>
                              <span className="font-mono font-bold text-indigo-900">{formatCurrency(rmResult.sharedAmount)}</span>
                            </div>
                          </div>

                          <Separator className="bg-indigo-200" />

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center text-green-700">
                              <span className="font-semibold">Discount on Exclusive Items:</span>
                              <span className="font-mono font-bold">-{formatCurrency(rmResult.exclusiveItemsDiscount || 0)}</span>
                            </div>
                            <div className="flex justify-between items-center text-green-700">
                              <span className="font-semibold">Discount on Shared Items:</span>
                              <span className="font-mono font-bold">-{formatCurrency(rmResult.sharedItemsDiscount || 0)}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Base Amount (VAT-excluded) */}
                      <div className="flex justify-between text-slate-700 text-base">
                        <span>Base Amount</span>
                        <span className="font-bold font-mono">{formatCurrency(rmResult.baseAmount)}</span>
                      </div>

                      {/* Add: VAT (12%) */}
                      <div className="flex justify-between text-slate-600">
                        <span className="text-sm">Add: VAT (12%)</span>
                        <span className="font-mono font-semibold text-slate-600">+{formatCurrency(rmResult.vatAmount)}</span>
                      </div>

                      {/* Add: Service Charge (if applicable) */}
                      {rmResult.serviceChargeTotal > 0 && (
                        <div className="flex justify-between text-orange-600">
                          <span className="text-sm flex items-center gap-2">
                            Add: Service Charge
                            <span className="text-[10px] text-orange-500 font-semibold px-2 py-0.5 rounded-full border border-orange-200 bg-orange-50">
                              {rmResult.serviceChargeSource === 'manual' ? 'Receipt override' : `${serviceChargeRate}%`}
                            </span>
                            {rmResult.serviceChargeSource === 'auto' && (
                              <span className="text-[10px] text-orange-400 font-medium px-2 py-0.5 rounded-full border border-orange-200 bg-orange-50/50">
                                {SERVICE_CHARGE_BASE_OPTIONS.find(opt => opt.value === rmResult.serviceChargeBase)?.label || 'Menu Price'}
                              </span>
                            )}
                          </span>
                          <span className="font-mono font-semibold">+{formatCurrency(rmResult.serviceChargeTotal)}</span>
                        </div>
                      )}

                      <Separator className="my-2" />

                      {/* Less: VAT Exemption (for PWD/Senior) */}
                      {rmResult.vatDiscount > 0 && (
                        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg -mx-2 px-4">
                          <span className="flex items-center gap-2 text-blue-700 font-semibold">
                            <Badge className="bg-blue-600 text-white hover:bg-blue-600 h-6 px-2 text-xs">
                              EXEMPT
                            </Badge>
                            VAT Exemption (12%)
                          </span>
                          <span className="font-mono font-bold text-blue-700">-{formatCurrency(rmResult.vatDiscount)}</span>
                        </div>
                      )}

                      {/* Less: 20% Discount */}
                      {rmResult.discount20 > 0 && (
                        <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg -mx-2 px-4">
                          <span className="flex items-center gap-2 text-green-700 font-semibold">
                            <Badge className="bg-green-600 text-white hover:bg-green-600 h-6 px-2 text-xs">
                              20% OFF
                            </Badge>
                            Discount
                          </span>
                          <span className="font-mono font-bold text-green-700">-{formatCurrency(rmResult.discount20)}</span>
                        </div>
                      )}

                      {/* Less: Service Charge Exemption */}
                      {rmResult.serviceChargeExemption > 0 && (
                        <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg -mx-2 px-4">
                          <span className="flex items-center gap-2 text-purple-700 font-semibold">
                            <Badge className="bg-purple-600 text-white hover:bg-purple-600 h-6 px-2 text-xs">
                              EXEMPT
                            </Badge>
                            Service Charge Exemption
                          </span>
                          <span className="font-mono font-bold text-purple-700">-{formatCurrency(rmResult.serviceChargeExemption)}</span>
                        </div>
                      )}

                      <Separator className="my-4" />

                      <div className="pt-2">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-slate-500 font-semibold text-xs sm:text-sm uppercase tracking-wide">Total Payable</span>
                          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                            {formatCurrency(rmResult.amountToPay)}
                          </span>
                        </div>
                        <p className="text-right text-sm text-green-600 font-semibold">
                          You saved {formatCurrency(rmResult.totalDiscount)}
                        </p>
                      </div>

                      {/* Comparison: Mixed vs Prorated */}
                      {rmResult.methodUsed === 'mixed' && exclusivePwdAmount && parseFloat(exclusivePwdAmount) > 0 && (() => {
                        // Calculate what the prorated discount would have been
                        const amount = parseFloat(rmAmount) || 0
                        const baseAmount = amount / 1.12
                        const vatAmount = amount - baseAmount
                        const pwdCount = Math.max(parseInt(numPwdSenior) || 0, 0)
                        const regCount = Math.max(parseInt(numRegular) || 0, 0)
                        const totalDiners = Math.max(pwdCount + regCount, 0)
                        const baseAmountPerPerson = totalDiners > 0 ? baseAmount / totalDiners : 0
                        const vatAmountPerPerson = totalDiners > 0 ? vatAmount / totalDiners : 0
                        const eligibleCount = Math.min(pwdCount, totalDiners)
                        const proratedVatDiscount = vatAmountPerPerson * eligibleCount
                        const proratedDiscount20 = baseAmountPerPerson * eligibleCount * 0.20
                        const proratedTotalDiscount = proratedVatDiscount + proratedDiscount20

                        const mixedTotalDiscount = rmResult.vatDiscount + rmResult.discount20
                        const difference = mixedTotalDiscount - proratedTotalDiscount

                        return (
                          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg -mx-2 px-4 space-y-2 animate-in fade-in slide-in-from-top-2">
                            <p className="text-sm font-bold text-amber-900 flex items-center gap-2">
                              <Info className="w-4 h-4" />
                              Calculation Comparison
                            </p>
                            <div className="text-xs space-y-1.5 text-slate-700">
                              <div className="flex justify-between">
                                <span>Prorated method (divide equally):</span>
                                <span className="font-mono font-semibold">{formatCurrency(proratedTotalDiscount)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Exclusive method (separate PWD items):</span>
                                <span className="font-mono font-semibold">{formatCurrency(mixedTotalDiscount)}</span>
                              </div>
                              <Separator className="my-1 bg-amber-200" />
                              <div className="flex justify-between items-center font-bold text-green-700 pt-1">
                                <span>{difference > 0 ? 'You save more:' : 'Prorated saves more:'}</span>
                                <span className="font-mono text-base">{formatCurrency(Math.abs(difference))}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })()}

                      {/* Quick Actions */}
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSaveCalculation}
                          className="flex-1 min-w-[140px] touch-manipulation min-h-[44px]"
                        >
                          {showSaveSuccess ? (
                            <><Check className="w-4 h-4 mr-2" /> Saved!</>
                          ) : (
                            <><Save className="w-4 h-4 mr-2" /> Save</>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={shareBreakdown}
                          className="flex-1 min-w-[140px] touch-manipulation min-h-[44px]"
                        >
                          {copiedId === 'share-breakdown' ? (
                            <><Check className="w-4 h-4 mr-2" /> Copied!</>
                          ) : (
                            <><Share2 className="w-4 h-4 mr-2" /> Share</>
                          )}
                        </Button>
                      </div>

                      {/* Receipt Matching/Comparison Mode */}
                      <div className="pt-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="receipt-match-toggle" className="flex items-center gap-2 cursor-pointer">
                            <Scale className="w-4 h-4 text-amber-600" />
                            <span className="font-semibold text-sm">Compare with Receipt</span>
                          </Label>
                          <CustomSwitch
                            id="receipt-match-toggle"
                            checked={receiptMatchMode}
                            onCheckedChange={setReceiptMatchMode}
                          />
                        </div>

                        {receiptMatchMode && (
                          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                            <p className="text-xs text-amber-800">
                              Enter the actual amount charged on your receipt to verify accuracy.
                            </p>

                            <div className="space-y-2">
                              <Label htmlFor="receipt-actual-total" className="text-sm font-semibold text-amber-900">
                                Actual Amount Charged (from receipt)
                              </Label>
                              <Input
                                id="receipt-actual-total"
                                type="number"
                                inputMode="decimal"
                                placeholder="0.00"
                                value={receiptActualTotal}
                                onChange={(e) => setReceiptActualTotal(e.target.value)}
                                className="text-base min-h-[44px] bg-white border-amber-300 focus-visible:ring-amber-500"
                              />
                            </div>

                            {receiptActualTotal && parseFloat(receiptActualTotal) > 0 && (
                              <div className="space-y-2 pt-2">
                                <Separator className="bg-amber-200" />

                                <div className="grid grid-cols-2 gap-3 text-sm">
                                  <div className="space-y-1">
                                    <p className="text-xs text-amber-700 font-medium">Calculated Amount</p>
                                    <p className="text-lg font-bold text-slate-900">
                                      {formatCurrency(rmResult.amountToPay)}
                                    </p>
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs text-amber-700 font-medium">Receipt Amount</p>
                                    <p className="text-lg font-bold text-slate-900">
                                      {formatCurrency(parseFloat(receiptActualTotal))}
                                    </p>
                                  </div>
                                </div>

                                {(() => {
                                  const expected = rmResult.amountToPay
                                  const actual = parseFloat(receiptActualTotal)
                                  const difference = actual - expected
                                  const percentDiff = expected > 0 ? (Math.abs(difference) / expected) * 100 : 0

                                  if (Math.abs(difference) < 0.01) {
                                    return (
                                      <div className="bg-green-100 border-2 border-green-400 rounded-lg p-3 flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                          <p className="font-bold text-green-900 text-sm">Receipt matches!</p>
                                          <p className="text-xs text-green-700">The charged amount is correct.</p>
                                        </div>
                                      </div>
                                    )
                                  } else if (difference > 0) {
                                    return (
                                      <div className="bg-red-100 border-2 border-red-400 rounded-lg p-3 flex items-start gap-2">
                                        <X className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                          <p className="font-bold text-red-900 text-sm">Overcharged!</p>
                                          <p className="text-xs text-red-700">
                                            You were charged {formatCurrency(difference)} more ({percentDiff.toFixed(1)}% higher).
                                          </p>
                                          <p className="text-xs text-red-700 mt-1 font-semibold">
                                            You may request a correction from the establishment.
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  } else {
                                    return (
                                      <div className="bg-blue-100 border-2 border-blue-400 rounded-lg p-3 flex items-start gap-2">
                                        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                          <p className="font-bold text-blue-900 text-sm">Charged less than expected</p>
                                          <p className="text-xs text-blue-700">
                                            You were charged {formatCurrency(Math.abs(difference))} less. This may be due to additional discounts or promotions.
                                          </p>
                                        </div>
                                      </div>
                                    )
                                  }
                                })()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {isRestaurant && (parseInt(numPwdSenior) + parseInt(numRegular) > 1) && (
                        <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200 space-y-4">
                          {/* Sticky Summary Bar for Mobile */}
                          <div className="sticky top-0 z-10 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 bg-gradient-to-r from-slate-100 to-slate-50 border-b-2 border-slate-200 md:hidden">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-slate-600">
                                <span className="font-bold">{parseInt(numPwdSenior) + parseInt(numRegular)} diners</span>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-slate-500">Total to pay</p>
                                <p className="text-lg font-bold text-slate-900">{formatCurrency(rmResult.amountToPay)}</p>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => setGroupSummaryExpanded(!groupSummaryExpanded)}
                            className="w-full flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider touch-manipulation min-h-[44px] py-2 md:pointer-events-none"
                          >
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>Group Summary</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform md:hidden ${groupSummaryExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          {groupSummaryExpanded && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                              {/* Visual Progress Bar */}
                              <div className="bg-slate-100 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between text-xs font-medium text-slate-600">
                                  <span>Payment Distribution</span>
                                  <span>{parseInt(numPwdSenior) + parseInt(numRegular)} diners total</span>
                                </div>
                                <div className="relative h-8 bg-white rounded-lg overflow-hidden border-2 border-slate-200">
                                  {(() => {
                                    const totalGroup = Math.max(parseInt(numPwdSenior) + parseInt(numRegular), 1)
                                    const baseAmountPerPerson = rmResult.baseAmount / totalGroup
                                    const vatAmountPerPerson = rmResult.vatAmount / totalGroup

                                    // PWD/Senior total
                                    const pwdCount = parseInt(numPwdSenior) || 0
                                    const pwdBaseTotal = baseAmountPerPerson * pwdCount
                                    const pwdDiscount = pwdBaseTotal * 0.20
                                    const pwdTotal = pwdBaseTotal - pwdDiscount

                                    // Regular total
                                    const regCount = parseInt(numRegular) || 0
                                    const serviceChargePerReg =
                                      rmResult.serviceChargeTotal > 0 && regCount > 0
                                        ? Math.max(rmResult.serviceChargeTotal - rmResult.serviceChargeExemption, 0) / regCount
                                        : 0
                                    const regTotal = (baseAmountPerPerson + vatAmountPerPerson + serviceChargePerReg) * regCount

                                    const grandTotal = pwdTotal + regTotal
                                    const pwdPercentage = grandTotal > 0 ? (pwdTotal / grandTotal) * 100 : 0
                                    const regPercentage = grandTotal > 0 ? (regTotal / grandTotal) * 100 : 0

                                    return (
                                      <>
                                        <div
                                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center transition-all duration-500"
                                          style={{ width: `${pwdPercentage}%` }}
                                        >
                                          {pwdPercentage > 15 && (
                                            <span className="text-white text-[11px] font-bold">{pwdPercentage.toFixed(0)}%</span>
                                          )}
                                        </div>
                                        <div
                                          className="absolute right-0 top-0 h-full bg-gradient-to-r from-slate-300 to-slate-400 flex items-center justify-center transition-all duration-500"
                                          style={{ width: `${regPercentage}%` }}
                                        >
                                          {regPercentage > 15 && (
                                            <span className="text-slate-700 text-[11px] font-bold">{regPercentage.toFixed(0)}%</span>
                                          )}
                                        </div>
                                      </>
                                    )
                                  })()}
                                </div>
                                <div className="flex items-center justify-between gap-4 text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                                    <span className="text-blue-700 font-semibold">
                                      {parseInt(numPwdSenior)} PWD/Senior ({formatCurrency((() => {
                                        const totalGroup = Math.max(parseInt(numPwdSenior) + parseInt(numRegular), 1)
                                        const baseAmountPerPerson = rmResult.baseAmount / totalGroup
                                        const pwdCount = parseInt(numPwdSenior) || 0
                                        const pwdBaseTotal = baseAmountPerPerson * pwdCount
                                        const pwdDiscount = pwdBaseTotal * 0.20
                                        return pwdBaseTotal - pwdDiscount
                                      })())})
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-slate-300 to-slate-400"></div>
                                    <span className="text-slate-700 font-semibold">
                                      {parseInt(numRegular)} Regular ({formatCurrency((() => {
                                        const totalGroup = Math.max(parseInt(numPwdSenior) + parseInt(numRegular), 1)
                                        const baseAmountPerPerson = rmResult.baseAmount / totalGroup
                                        const vatAmountPerPerson = rmResult.vatAmount / totalGroup
                                        const regCount = parseInt(numRegular) || 0
                                        const serviceChargePerReg =
                                          rmResult.serviceChargeTotal > 0 && regCount > 0
                                            ? Math.max(rmResult.serviceChargeTotal - rmResult.serviceChargeExemption, 0) / regCount
                                            : 0
                                        return (baseAmountPerPerson + vatAmountPerPerson + serviceChargePerReg) * regCount
                                      })())})
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <button
                            onClick={() => setPerPersonExpanded(!perPersonExpanded)}
                            className="w-full flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider touch-manipulation min-h-[44px] py-2 pt-4 md:pointer-events-none"
                          >
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              <span>Per Person Breakdown</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform md:hidden ${perPersonExpanded ? 'rotate-180' : ''}`} />
                          </button>

                          {perPersonExpanded && (
                            <div className="animate-in fade-in slide-in-from-top-2">
                              {/* Mobile: horizontal scroll, Desktop: grid */}
                              <div className="overflow-x-auto md:overflow-visible -mx-2 px-2 scrollable">
                                <div className="flex md:grid md:grid-cols-2 gap-3 min-w-full md:min-w-0" style={{ scrollSnapType: 'x mandatory' }}>
                                  {/* PWD/Senior Cards */}
                                  {Array.from({ length: parseInt(numPwdSenior) || 0 }).map((_, idx) => {
                                    const totalGroup = Math.max(parseInt(numPwdSenior) + parseInt(numRegular), 1)
                                    const baseAmountPerPerson = rmResult.baseAmount / totalGroup
                                    const vatAmountPerPerson = rmResult.vatAmount / totalGroup
                                    const pwdDiscount = baseAmountPerPerson * 0.20
                                    const pwdTotal = baseAmountPerPerson - pwdDiscount
                                    const personId = `pwd-${idx}`
                                    const isExpanded = expandedPersonId === personId

                                    return (
                                      <div key={personId} className="flex-shrink-0 w-[85vw] md:w-auto" style={{ scrollSnapAlign: 'start' }}>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 h-full">
                                          <div className="flex items-start justify-between mb-3">
                                            <div>
                                              <p className="text-xs text-blue-600 font-bold mb-0.5">Senior/PWD #{idx + 1}</p>
                                              <p className="text-[10px] text-blue-500">VAT-exempt + 20% discount</p>
                                            </div>
                                            <Badge className="bg-blue-600 text-white hover:bg-blue-600 h-5 px-1.5 text-[10px]">EXEMPT</Badge>
                                          </div>

                                          <p className="text-3xl font-bold text-blue-900 mb-3">
                                            {formatCurrency(pwdTotal)}
                                          </p>

                                          <button
                                            onClick={() => setExpandedPersonId(isExpanded ? null : personId)}
                                            className="w-full flex items-center justify-between text-xs text-blue-700 font-medium mb-2 touch-manipulation min-h-[44px] py-2"
                                          >
                                            <span>View breakdown</span>
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                          </button>

                                          {isExpanded && (
                                            <div className="space-y-2 text-xs text-blue-800 mb-3 animate-in fade-in slide-in-from-top-2">
                                              <div className="flex justify-between py-1">
                                                <span>Base amount:</span>
                                                <span className="font-mono">{formatCurrency(baseAmountPerPerson)}</span>
                                              </div>
                                              <div className="flex justify-between py-1 text-green-700">
                                                <span>Less: 20% discount</span>
                                                <span className="font-mono">-{formatCurrency(pwdDiscount)}</span>
                                              </div>
                                              <div className="flex justify-between py-1 text-blue-600">
                                                <span>VAT exemption:</span>
                                                <span className="font-mono">-{formatCurrency(vatAmountPerPerson)}</span>
                                              </div>
                                              {rmResult.serviceChargeExemption > 0 && (
                                                <div className="flex justify-between py-1 text-purple-600">
                                                  <span>Service charge exempt:</span>
                                                  <span className="font-mono">-{formatCurrency(rmResult.serviceChargeExemption / parseInt(numPwdSenior))}</span>
                                                </div>
                                              )}
                                            </div>
                                          )}

                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full bg-white hover:bg-blue-100 border-blue-300 text-blue-700 touch-manipulation min-h-[44px]"
                                            onClick={() => copyToClipboard(pwdTotal.toFixed(2), personId)}
                                          >
                                            {copiedId === personId ? (
                                              <><Check className="w-4 h-4 mr-2" /> Copied!</>
                                            ) : (
                                              <><Copy className="w-4 h-4 mr-2" /> Copy Amount</>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    )
                                  })}

                                  {/* Regular Diner Cards */}
                                  {Array.from({ length: parseInt(numRegular) || 0 }).map((_, idx) => {
                                    const totalGroup = Math.max(parseInt(numPwdSenior) + parseInt(numRegular), 1)
                                    const baseAmountPerPerson = rmResult.baseAmount / totalGroup
                                    const vatAmountPerPerson = rmResult.vatAmount / totalGroup
                                    const regularCount = Math.max(parseInt(numRegular) || 0, 1)
                                    const serviceChargePerPerson =
                                      rmResult.serviceChargeTotal > 0
                                        ? Math.max(rmResult.serviceChargeTotal - rmResult.serviceChargeExemption, 0) / regularCount
                                        : 0
                                    const regTotal = baseAmountPerPerson + vatAmountPerPerson + serviceChargePerPerson
                                    const personId = `reg-${idx}`
                                    const isExpanded = expandedPersonId === personId

                                    return (
                                      <div key={personId} className="flex-shrink-0 w-[85vw] md:w-auto" style={{ scrollSnapAlign: 'start' }}>
                                        <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 h-full">
                                          <div className="flex items-start justify-between mb-3">
                                            <div>
                                              <p className="text-xs text-slate-700 font-bold mb-0.5">Regular Diner #{idx + 1}</p>
                                              <p className="text-[10px] text-slate-500">Full price + VAT + Service charge</p>
                                            </div>
                                            <Badge variant="outline" className="h-5 px-1.5 text-[10px] border-slate-300">REGULAR</Badge>
                                          </div>

                                          <p className="text-3xl font-bold text-slate-900 mb-3">
                                            {formatCurrency(regTotal)}
                                          </p>

                                          <button
                                            onClick={() => setExpandedPersonId(isExpanded ? null : personId)}
                                            className="w-full flex items-center justify-between text-xs text-slate-700 font-medium mb-2 touch-manipulation min-h-[44px] py-2"
                                          >
                                            <span>View breakdown</span>
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                          </button>

                                          {isExpanded && (
                                            <div className="space-y-2 text-xs text-slate-700 mb-3 animate-in fade-in slide-in-from-top-2">
                                              <div className="flex justify-between py-1">
                                                <span>Base amount:</span>
                                                <span className="font-mono">{formatCurrency(baseAmountPerPerson)}</span>
                                              </div>
                                              <div className="flex justify-between py-1">
                                                <span>Add: VAT (12%):</span>
                                                <span className="font-mono">+{formatCurrency(vatAmountPerPerson)}</span>
                                              </div>
                                              {serviceChargePerPerson > 0 && (
                                                <div className="flex justify-between py-1 text-orange-600">
                                                  <span>Add: Service charge:</span>
                                                  <span className="font-mono">+{formatCurrency(serviceChargePerPerson)}</span>
                                                </div>
                                              )}
                                            </div>
                                          )}

                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="w-full bg-white hover:bg-slate-200 border-slate-300 text-slate-700 touch-manipulation min-h-[44px]"
                                            onClick={() => copyToClipboard(regTotal.toFixed(2), personId)}
                                          >
                                            {copiedId === personId ? (
                                              <><Check className="w-4 h-4 mr-2" /> Copied!</>
                                            ) : (
                                              <><Copy className="w-4 h-4 mr-2" /> Copy Amount</>
                                            )}
                                          </Button>
                                        </div>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Grocery Results */}
                  {gResult && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-slate-600 text-base">
                        <span>Original Amount</span>
                        <span className="font-bold font-mono">{formatCurrency(parseFloat(gAmount) || 0)}</span>
                      </div>

                      {gResult.discount5 > 0 && (
                        <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg -mx-2 px-4">
                          <span className="flex items-center gap-2 text-green-700 font-semibold">
                            <Badge className="bg-green-600 text-white hover:bg-green-600 h-6 px-2 text-xs">
                              5% OFF
                            </Badge>
                            Discount
                          </span>
                          <span className="font-mono font-bold text-green-700">-{formatCurrency(gResult.discount5)}</span>
                        </div>
                      )}

                      <Separator className="my-4" />

                      <div className="pt-2">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-slate-500 font-semibold text-xs sm:text-sm uppercase tracking-wide">Total Payable</span>
                          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                            {formatCurrency(gResult.amountToPay)}
                          </span>
                        </div>
                        <p className="text-right text-sm text-green-600 font-semibold">
                          You saved {formatCurrency(gResult.discount5)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Medicine Results */}
                  {activeTab === 'medicine' && medResult && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-slate-600 text-base">
                        <span>Base Amount</span>
                        <span className="font-bold font-mono">{formatCurrency(medResult.baseAmount)}</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-sm">
                        <span>VAT (12%)</span>
                        <span className="font-mono">+{formatCurrency(medResult.vatAmount)}</span>
                      </div>

                      <Separator className="my-2" />

                      <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg -mx-2 px-4">
                        <span className="flex items-center gap-2 text-blue-700 font-semibold">
                          <Badge className="bg-blue-600 text-white hover:bg-blue-600 h-6 px-2 text-xs">
                            EXEMPT
                          </Badge>
                          VAT Exemption
                        </span>
                        <span className="font-mono font-bold text-blue-700">-{formatCurrency(medResult.vatDiscount)}</span>
                      </div>

                      <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg -mx-2 px-4">
                        <span className="flex items-center gap-2 text-green-700 font-semibold">
                          <Badge className="bg-green-600 text-white hover:bg-green-600 h-6 px-2 text-xs">
                            20% OFF
                          </Badge>
                          Discount
                        </span>
                        <span className="font-mono font-bold text-green-700">-{formatCurrency(medResult.discount20)}</span>
                      </div>

                      <Separator className="my-4" />

                      <div className="pt-2">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-slate-500 font-semibold text-xs sm:text-sm uppercase tracking-wide">Total Payable</span>
                          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                            {formatCurrency(medResult.amountToPay)}
                          </span>
                        </div>
                        <p className="text-right text-sm text-green-600 font-semibold">
                          You saved {formatCurrency(medResult.totalSaved)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Utilities Results */}
                  {activeTab === 'utilities' && utilResult && (
                    <div className="space-y-4">
                      {utilResult.eligible ? (
                        <>
                          <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg -mx-2 px-4">
                            <span className="flex items-center gap-2 text-green-700 font-semibold">
                              <Badge className="bg-green-600 text-white hover:bg-green-600 h-6 px-2 text-xs">
                                5% OFF
                              </Badge>
                              Discount
                            </span>
                            <span className="font-mono font-bold text-green-700">-{formatCurrency(utilResult.discount5)}</span>
                          </div>

                          <Separator className="my-4" />

                          <div className="pt-2">
                            <div className="flex justify-between items-baseline mb-2">
                              <span className="text-slate-500 font-semibold text-xs sm:text-sm uppercase tracking-wide">Total Payable</span>
                              <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                                {formatCurrency(utilResult.amountToPay)}
                              </span>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <p className="text-slate-700 font-medium mb-2">
                            Not eligible for discount
                          </p>
                          <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                            {utilResult.reason}
                          </Badge>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Transport Results */}
                  {activeTab === 'transport' && transResult && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-slate-600 text-base">
                        <span>Base Fare</span>
                        <span className="font-bold font-mono">{formatCurrency(transResult.baseAmount)}</span>
                      </div>
                      {transResult.vatAmount > 0 && (
                        <div className="flex justify-between text-slate-500 text-sm">
                          <span>VAT (12%)</span>
                          <span className="font-mono">+{formatCurrency(transResult.vatAmount)}</span>
                        </div>
                      )}
                      {transResult.taxesFees > 0 && (
                        <div className="flex justify-between text-slate-600 text-base">
                          <span>Taxes & Fees</span>
                          <span className="font-mono">{formatCurrency(transResult.taxesFees)}</span>
                        </div>
                      )}

                      <Separator className="my-2" />

                      {transResult.vatDiscount > 0 && (
                        <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg -mx-2 px-4">
                          <span className="flex items-center gap-2 text-blue-700 font-semibold">
                            <Badge className="bg-blue-600 text-white hover:bg-blue-600 h-6 px-2 text-xs">
                              EXEMPT
                            </Badge>
                            VAT Exemption
                          </span>
                          <span className="font-mono font-bold text-blue-700">-{formatCurrency(transResult.vatDiscount)}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg -mx-2 px-4">
                        <span className="flex items-center gap-2 text-green-700 font-semibold">
                          <Badge className="bg-green-600 text-white hover:bg-green-600 h-6 px-2 text-xs">
                            20% OFF
                          </Badge>
                          Discount
                        </span>
                        <span className="font-mono font-bold text-green-700">-{formatCurrency(transResult.discount20)}</span>
                      </div>

                      <Separator className="my-4" />

                      <div className="pt-2">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-slate-500 font-semibold text-xs sm:text-sm uppercase tracking-wide">Total Payable</span>
                          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                            {formatCurrency(transResult.amountToPay)}
                          </span>
                        </div>
                        <p className="text-right text-sm text-green-600 font-semibold">
                          You saved {formatCurrency(transResult.totalSaved)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!rmResult && !gResult && !medResult && !utilResult && !transResult && (
                    <div className="text-center py-12 space-y-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center">
                        <Receipt className="w-8 h-8 text-slate-400" />
                      </div>
                      <p className="text-slate-400 font-medium">Enter bill details and calculate</p>
                      <p className="text-xs text-slate-400">Your discount summary will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="bg-slate-50 border-t p-4 md:p-6 lg:p-8 text-center">
                <p className="text-xs sm:text-sm text-slate-500 w-full font-medium">
                  Copyright © 2025 by Adrian Sian
                </p>
              </CardFooter>
            </Card>

            <CoverageCard
              isExpanded={isCoverageExpanded}
              onToggle={() => setIsCoverageExpanded(prev => !prev)}
              className="mt-4 lg:hidden"
            />

            <div className="mt-4 rounded-2xl border-2 border-blue-100 bg-blue-50/70 p-4 sm:p-5 space-y-3 text-slate-700">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900 uppercase tracking-wide">Why this exists</p>
                  <h3 className="text-lg font-bold text-slate-900">Karapat Discount by Adrian Sian</h3>
                </div>
              </div>
              <p className="text-sm leading-relaxed">
                Adrian Sian built Karapat Discount for his girlfriend and every Filipino Senior or PWD who
                needs to double-check receipts, cite the right laws, and feel confident asking for the benefits they already
                earned. The app bundles the math, legal references, and escalation tips Adrian wished were available whenever
                establishments miscalculated discounts.
              </p>
              <p className="text-xs text-slate-500 italic">
                Built in the Philippines • Community-backed • Open to feedback
              </p>
            </div>
          </div>
        </div>
      </div>
      <AiAssistant onReceiptDataExtracted={(data) => setChatbotReceiptData(data)} />
    </div >
  )
}
