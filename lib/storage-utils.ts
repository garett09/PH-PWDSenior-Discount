// Storage utilities for saving/loading calculations
// Uses browser localStorage (works on all modern browsers)

export interface SavedCalculation {
  id: string
  timestamp: number
  type: 'restaurant' | 'groceries' | 'medicine' | 'utilities' | 'transport'
  inputs: {
    amount?: string
    pwdCount?: string
    regCount?: string
    isRestaurant?: boolean
    hasServiceCharge?: boolean
    serviceChargeRate?: string
    serviceChargeBase?: 'gross' | 'net' | 'post'
    serviceChargeExcluded?: string
    manualScAmount?: string
    gRemaining?: string
    utilType?: 'electricity' | 'water'
    utilConsumption?: string
    transMode?: 'airsea' | 'land'
    transBaseFare?: string
    transTaxesFees?: string
    transLandFare?: string
  }
  results: {
    baseAmount?: number
    vatAmount?: number
    serviceChargeTotal?: number
    serviceChargeSource?: 'auto' | 'manual'
    serviceChargeBase?: 'gross' | 'net' | 'post'
    vatDiscount?: number
    discount20?: number
    serviceChargeExemption?: number
    totalDiscount?: number
    amountToPay: number
    discount5?: number
    totalSaved?: number
    eligible?: boolean
    reason?: string
    taxesFees?: number
  }
}

const STORAGE_KEY = 'pwd-senior-calculations'
const MAX_SAVED = 10

export function saveCalculation(calculation: Omit<SavedCalculation, 'id' | 'timestamp'>): boolean {
  try {
    const saved = getSavedCalculations()
    const newCalculation: SavedCalculation = {
      ...calculation,
      id: `calc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    }

    // Add to beginning and limit to MAX_SAVED
    const updated = [newCalculation, ...saved].slice(0, MAX_SAVED)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return true
  } catch (error) {
    console.error('Failed to save calculation:', error)
    return false
  }
}

export function getSavedCalculations(): SavedCalculation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    return JSON.parse(stored) as SavedCalculation[]
  } catch (error) {
    console.error('Failed to load calculations:', error)
    return []
  }
}

export function deleteCalculation(id: string): boolean {
  try {
    const saved = getSavedCalculations()
    const filtered = saved.filter(calc => calc.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Failed to delete calculation:', error)
    return false
  }
}

export function deleteAllCalculations(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Failed to delete all calculations:', error)
    return false
  }
}

export function exportCalculationAsJSON(calculation: SavedCalculation): string {
  return JSON.stringify(calculation, null, 2)
}

export function formatCalculationForSharing(calculation: SavedCalculation): string {
  const date = new Date(calculation.timestamp).toLocaleString('en-PH', {
    dateStyle: 'medium',
    timeStyle: 'short'
  })

  let text = `PWD/Senior Discount Calculation\n`
  text += `Date: ${date}\n\n`

  if (calculation.type === 'restaurant') {
    text += `Type: Dining\n`
    text += `Bill Amount: ₱${calculation.inputs.amount}\n`
    if (calculation.inputs.isRestaurant) {
      text += `PWD/Senior: ${calculation.inputs.pwdCount} pax\n`
      text += `Regular: ${calculation.inputs.regCount} pax\n`
    }
    if (calculation.inputs.hasServiceCharge) {
      text += `Service Charge: ${calculation.inputs.serviceChargeRate}%\n`
    }
    text += `\n`
    text += `Total to Pay: ₱${calculation.results.amountToPay.toFixed(2)}\n`
    text += `Total Saved: ₱${calculation.results.totalDiscount?.toFixed(2)}\n`
  } else if (calculation.type === 'groceries') {
    text += `Type: Grocery\n`
    text += `Grocery Amount: ₱${calculation.inputs.amount}\n`
    text += `Weekly Allowance: ₱${calculation.inputs.gRemaining}\n`
    text += `\n`
    text += `Total to Pay: ₱${calculation.results.amountToPay.toFixed(2)}\n`
    text += `Discount: ₱${calculation.results.discount5?.toFixed(2) || '0.00'}\n`
  } else if (calculation.type === 'medicine') {
    text += `Type: Medicine\n`
    text += `Amount: ₱${calculation.inputs.amount}\n`
    text += `\n`
    text += `Total to Pay: ₱${calculation.results.amountToPay.toFixed(2)}\n`
    text += `Total Saved: ₱${calculation.results.totalSaved?.toFixed(2)}\n`
  } else if (calculation.type === 'utilities') {
    text += `Type: Utilities (${calculation.inputs.utilType})\n`
    text += `Consumption: ${calculation.inputs.utilConsumption} ${calculation.inputs.utilType === 'electricity' ? 'kWh' : 'cu.m.'}\n`
    text += `Bill Amount: ₱${calculation.inputs.amount}\n`
    text += `\n`
    if (calculation.results.eligible) {
      text += `Total to Pay: ₱${calculation.results.amountToPay.toFixed(2)}\n`
      text += `Discount: ₱${calculation.results.discount5?.toFixed(2)}\n`
    } else {
      text += `Not Eligible: ${calculation.results.reason}\n`
    }
  } else if (calculation.type === 'transport') {
    text += `Type: Transport (${calculation.inputs.transMode === 'airsea' ? 'Air/Sea' : 'Land'})\n`
    if (calculation.inputs.transMode === 'airsea') {
      text += `Base Fare: ₱${calculation.inputs.transBaseFare}\n`
      text += `Taxes & Fees: ₱${calculation.inputs.transTaxesFees}\n`
    } else {
      text += `Fare: ₱${calculation.inputs.transLandFare}\n`
    }
    text += `\n`
    text += `Total to Pay: ₱${calculation.results.amountToPay.toFixed(2)}\n`
    text += `Total Saved: ₱${calculation.results.totalSaved?.toFixed(2)}\n`
  }

  return text
}

