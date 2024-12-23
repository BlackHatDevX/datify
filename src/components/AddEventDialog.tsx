'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon, Clock, Type, AlignLeft, Briefcase, User, Layers } from "lucide-react"
import { useEvents, EventCategory } from "@/contexts/EventContext"
import { cn } from "@/lib/utils"

interface AddEventDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedDate: Date | null
}

const initialFormState = {
  title: '',
  startTime: '',
  endTime: '',
  description: '',
  category: 'work' as EventCategory
}

type CategoryItem = {
  value: EventCategory
  label: string
  icon: React.ReactNode
}

const categories: CategoryItem[] = [
  { value: 'work', label: 'Work', icon: <Briefcase className="w-4 h-4" /> },
  { value: 'personal', label: 'Personal', icon: <User className="w-4 h-4" /> },
  { value: 'other', label: 'Other', icon: <Layers className="w-4 h-4" /> }
]

export function AddEventDialog({ open, onOpenChange, selectedDate }: AddEventDialogProps) {
  const { addEvent } = useEvents()
  const [formData, setFormData] = useState(initialFormState)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate) return

    addEvent({
      ...formData,
      date: selectedDate.toISOString()
    })

    setFormData(initialFormState)
    onOpenChange(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setFormData(initialFormState)
    }
    onOpenChange(open)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900 border-none shadow-xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Add New Event
          </DialogTitle>
          {selectedDate && (
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CalendarIcon className="w-4 h-4 text-blue-500" />
              <span>{formatDate(selectedDate)}</span>
            </div>
          )}
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Type className="w-4 h-4 text-blue-500" />
              <span>Event Title</span>
            </div>
            <Input
              placeholder="Enter event title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>Event Category</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.value })}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    formData.category === category.value
                      ? category.value === 'work'
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300"
                        : category.value === 'personal'
                        ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300"
                        : "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  )}
                >
                  {category.icon}
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Event Time</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Start Time</p>
              </div>
              <div>
                <Input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">End Time</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <AlignLeft className="w-4 h-4 text-blue-500" />
              <span>Description (Optional)</span>
            </div>
            <Textarea
              placeholder="Add event description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-3 justify-end pt-4 border-t border-gray-100 dark:border-gray-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
            >
              Add Event
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 