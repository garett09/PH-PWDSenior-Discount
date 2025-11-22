'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Plus, Trash2, ShoppingCart, Calculator, AlertCircle, Check } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

type GroceryItem = {
    id: string
    name: string
    price: number
    isBNPC: boolean // Basic Necessity / Prime Commodity
}

export function GroceryOptimizer() {
    const [items, setItems] = useState<GroceryItem[]>([])
    const [newItemName, setNewItemName] = useState('')
    const [newItemPrice, setNewItemPrice] = useState('')
    const [newItemIsBNPC, setNewItemIsBNPC] = useState(true)
    const [bookletCount, setBookletCount] = useState(1)
    const [weeklyCap, setWeeklyCap] = useState(1300)

    // Derived state
    const totalBNPC = items.filter(i => i.isBNPC).reduce((sum, i) => sum + i.price, 0)
    const totalNonBNPC = items.filter(i => !i.isBNPC).reduce((sum, i) => sum + i.price, 0)
    const totalCart = totalBNPC + totalNonBNPC

    const effectiveCap = weeklyCap * bookletCount
    const discountableAmount = Math.min(totalBNPC, effectiveCap)
    const discountAmount = discountableAmount * 0.05
    const amountToPay = totalCart - discountAmount

    const addItem = () => {
        if (!newItemName || !newItemPrice) return
        const price = parseFloat(newItemPrice)
        if (isNaN(price) || price <= 0) return

        const newItem: GroceryItem = {
            id: Date.now().toString(),
            name: newItemName,
            price,
            isBNPC: newItemIsBNPC
        }

        setItems([...items, newItem])
        setNewItemName('')
        setNewItemPrice('')
        setNewItemIsBNPC(true)
    }

    const removeItem = (id: string) => {
        setItems(items.filter(i => i.id !== id))
    }

    const formatCurrency = (val: number) => '₱' + val.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

    return (
        <div className="space-y-6">
            {/* Settings */}
            <Card className="bg-slate-50 border-slate-200">
                <CardContent className="p-4 flex flex-wrap gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Label>Number of Booklets:</Label>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setBookletCount(Math.max(1, bookletCount - 1))}>-</Button>
                            <span className="font-bold w-4 text-center">{bookletCount}</span>
                            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setBookletCount(bookletCount + 1)}>+</Button>
                        </div>
                    </div>
                    <div className="text-sm text-slate-500">
                        Max Discountable: <span className="font-bold text-slate-900">{formatCurrency(effectiveCap)}</span>
                    </div>
                </CardContent>
            </Card>

            {/* Add Item Form */}
            <div className="grid gap-4 sm:grid-cols-[1fr,100px,auto,auto] items-end">
                <div className="space-y-2">
                    <Label>Item Name</Label>
                    <Input
                        placeholder="e.g. Rice, Canned Goods"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Price</Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    />
                </div>
                <div className="space-y-2 pb-2">
                    <div className="flex items-center gap-2">
                        <Switch
                            checked={newItemIsBNPC}
                            onCheckedChange={setNewItemIsBNPC}
                            id="is-bnpc"
                        />
                        <Label htmlFor="is-bnpc" className="cursor-pointer">BNPC?</Label>
                    </div>
                </div>
                <Button onClick={addItem} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    <span className="sr-only sm:not-sr-only sm:ml-2">Add</span>
                </Button>
            </div>

            {/* Item List */}
            <div className="space-y-2">
                {items.length === 0 ? (
                    <div className="text-center py-8 text-slate-400 border-2 border-dashed rounded-xl">
                        <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Cart is empty. Add items to optimize.</p>
                    </div>
                ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white border rounded-lg shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className={`p-1.5 rounded-full ${item.isBNPC ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}>
                                        {item.isBNPC ? <Check className="w-3 h-3" /> : <ShoppingCart className="w-3 h-3" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm text-slate-900">{item.name}</p>
                                        <p className="text-xs text-slate-500">{item.isBNPC ? 'Basic Necessity / Prime Commodity' : 'Regular Item'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-mono font-bold text-slate-700">{formatCurrency(item.price)}</span>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600" onClick={() => removeItem(item.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary / Optimization Result */}
            <Card className="bg-slate-900 text-white border-0">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-blue-400" />
                        Optimization Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Progress Bar for Cap */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                            <span>BNPC Total: {formatCurrency(totalBNPC)}</span>
                            <span>Cap: {formatCurrency(effectiveCap)}</span>
                        </div>
                        <Progress value={(totalBNPC / effectiveCap) * 100} className="h-2 bg-slate-700" indicatorClassName={totalBNPC > effectiveCap ? 'bg-red-500' : 'bg-green-500'} />
                        {totalBNPC > effectiveCap && (
                            <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                                <AlertCircle className="w-3 h-3" />
                                You exceeded the cap by {formatCurrency(totalBNPC - effectiveCap)}. Excess amount gets no discount.
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                        <div>
                            <p className="text-xs text-slate-400">Total Cart</p>
                            <p className="text-xl font-bold">{formatCurrency(totalCart)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Discount (5%)</p>
                            <p className="text-xl font-bold text-green-400">-{formatCurrency(discountAmount)}</p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-700 flex justify-between items-end">
                        <p className="text-sm text-slate-400">Net Payable</p>
                        <p className="text-3xl font-bold text-white">{formatCurrency(amountToPay)}</p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
