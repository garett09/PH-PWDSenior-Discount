'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ThumbsUp, ThumbsDown, MapPin, Search, Trash2, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

type Establishment = {
    id: string
    name: string
    branch: string
    status: 'safe' | 'unsafe'
    notes: string
    dateAdded: number
}

export function EstablishmentTracker() {
    const [places, setPlaces] = useState<Establishment[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [isAdding, setIsAdding] = useState(false)

    // Form State
    const [newName, setNewName] = useState('')
    const [newBranch, setNewBranch] = useState('')
    const [newStatus, setNewStatus] = useState<'safe' | 'unsafe'>('safe')
    const [newNotes, setNewNotes] = useState('')

    useEffect(() => {
        const saved = localStorage.getItem('pwd-establishment-ratings')
        if (saved) {
            try {
                setPlaces(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to parse saved places', e)
            }
        }
    }, [])

    const savePlaces = (newPlaces: Establishment[]) => {
        setPlaces(newPlaces)
        localStorage.setItem('pwd-establishment-ratings', JSON.stringify(newPlaces))
    }

    const addPlace = () => {
        if (!newName) return

        const newPlace: Establishment = {
            id: Date.now().toString(),
            name: newName,
            branch: newBranch,
            status: newStatus,
            notes: newNotes,
            dateAdded: Date.now()
        }

        savePlaces([newPlace, ...places])

        // Reset form
        setNewName('')
        setNewBranch('')
        setNewStatus('safe')
        setNewNotes('')
        setIsAdding(false)
    }

    const deletePlace = (id: string) => {
        if (confirm('Remove this place from your list?')) {
            savePlaces(places.filter(p => p.id !== id))
        }
    }

    const filteredPlaces = places.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.branch.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            {/* Header & Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search places..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button onClick={() => setIsAdding(!isAdding)} className={cn("w-full sm:w-auto", isAdding ? "bg-slate-200 text-slate-800 hover:bg-slate-300" : "bg-blue-600 hover:bg-blue-700")}>
                    {isAdding ? 'Cancel' : <><Plus className="w-4 h-4 mr-2" /> Add Place</>}
                </Button>
            </div>

            {/* Add Form */}
            {isAdding && (
                <Card className="bg-slate-50 border-blue-200 animate-in slide-in-from-top-2">
                    <CardHeader>
                        <CardTitle className="text-base">Add New Place</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Establishment Name</Label>
                                <Input placeholder="e.g. Jollibee" value={newName} onChange={(e) => setNewName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Branch / Location</Label>
                                <Input placeholder="e.g. SM North EDSA" value={newBranch} onChange={(e) => setNewBranch(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Experience</Label>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setNewStatus('safe')}
                                    className={cn(
                                        "flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all",
                                        newStatus === 'safe' ? "border-green-500 bg-green-50 text-green-700" : "border-slate-200 bg-white hover:bg-slate-50"
                                    )}
                                >
                                    <ThumbsUp className="w-5 h-5" />
                                    <span className="font-bold">Safe / Good</span>
                                </button>
                                <button
                                    onClick={() => setNewStatus('unsafe')}
                                    className={cn(
                                        "flex-1 p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all",
                                        newStatus === 'unsafe' ? "border-red-500 bg-red-50 text-red-700" : "border-slate-200 bg-white hover:bg-slate-50"
                                    )}
                                >
                                    <ThumbsDown className="w-5 h-5" />
                                    <span className="font-bold">Unsafe / Bad</span>
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Notes</Label>
                            <Textarea
                                placeholder="What happened? (e.g. Honored ID without issues, or Refused discount)"
                                value={newNotes}
                                onChange={(e) => setNewNotes(e.target.value)}
                            />
                        </div>

                        <Button onClick={addPlace} className="w-full bg-blue-600 hover:bg-blue-700">Save Place</Button>
                    </CardContent>
                </Card>
            )}

            {/* List */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredPlaces.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-slate-400 bg-slate-50 rounded-xl border-2 border-dashed">
                        <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>{places.length === 0 ? "No places added yet." : "No matches found."}</p>
                    </div>
                ) : (
                    filteredPlaces.map(place => (
                        <Card key={place.id} className="group hover:shadow-md transition-shadow">
                            <CardContent className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{place.name}</h4>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {place.branch || 'Unknown Location'}
                                        </p>
                                    </div>
                                    <Badge className={place.status === 'safe' ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                                        {place.status === 'safe' ? <ThumbsUp className="w-3 h-3 mr-1" /> : <ThumbsDown className="w-3 h-3 mr-1" />}
                                        {place.status === 'safe' ? 'Safe' : 'Unsafe'}
                                    </Badge>
                                </div>

                                {place.notes && (
                                    <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded-md italic">
                                        "{place.notes}"
                                    </div>
                                )}

                                <div className="pt-2 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="ghost" size="sm" className="h-8 text-red-400 hover:text-red-600" onClick={() => deletePlace(place.id)}>
                                        <Trash2 className="w-3 h-3 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
