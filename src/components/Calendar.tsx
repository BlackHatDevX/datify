'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEvents, EventCategory } from "@/contexts/EventContext"
import { useDroppable } from "@dnd-kit/core"

interface CalendarProps {
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  onMonthChange: (date: Date) => void
}

export function Calendar({ selectedDate, onSelectDate, onMonthChange }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { events, updateEventDate } = useEvents()

  useEffect(() => {
    onMonthChange(currentDate)
  }, [currentDate, onMonthChange])
  
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const days = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const today = new Date()

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const getEventsForDate = (date: Date) => {
    return events.filter(event => 
      new Date(event.date).toDateString() === date.toDateString()
    )
  }

  const getEventCategories = (date: Date): EventCategory[] => {
    const dateEvents = getEventsForDate(date)
    const categories = dateEvents.map(event => event.category)
    return [...new Set(categories)].sort((a, b) => {
      const order = { work: 0, personal: 1, other: 2 }
      return order[a] - order[b]
    })
  }

  const getCategoryDotStyle = (category: EventCategory) => {
    switch(category) {
      case 'work':
        return 'bg-blue-500 dark:bg-blue-400'
      case 'personal':
        return 'bg-green-500 dark:bg-green-400'
      case 'other':
        return 'bg-purple-500 dark:bg-purple-400'
    }
  }

  function DroppableDay({ date, children }: { date: Date; children: React.ReactNode }) {
    const {isOver, setNodeRef} = useDroppable({
      id: date.toISOString(),
      data: { date }
    });
    
    return (
      <div 
        ref={setNodeRef}
        className={cn(
          "relative p-2 w-full rounded-lg transition-colors",
          isOver && "bg-blue-50 dark:bg-gray-700",
          "outline-2 outline-dashed outline-transparent",
          isOver && "outline-blue-500 dark:outline-blue-400"
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
          {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium p-2 text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
        
        {Array.from({ length: firstDay }).map((_, index) => (
          <div key={`empty-${index}`} className="p-2" />
        ))}
        
        {Array.from({ length: days }).map((_, index) => {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1)
          const isToday = date.toDateString() === today.toDateString()
          const isSelected = selectedDate?.toDateString() === date.toDateString()
          const eventCategories = getEventCategories(date)
          
          return (
            <DroppableDay key={date.toISOString()} date={date}>
              <button
                onClick={() => onSelectDate(date)}
                className={cn(
                  "w-full rounded-lg transition-colors",
                  "hover:bg-blue-50 dark:hover:bg-gray-700",
                  isSelected && "bg-blue-100 dark:bg-gray-700",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                )}
              >
                <span className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full mx-auto",
                  isToday && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold"
                )}>
                  {index + 1}
                </span>
                {eventCategories.length > 0 && (
                  <div key={`dots-${date.toISOString()}`} className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
                    {eventCategories.map((category) => (
                      <span 
                        key={`${date.toISOString()}-${category}`}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          getCategoryDotStyle(category)
                        )}
                      />
                    ))}
                  </div>
                )}
              </button>
            </DroppableDay>
          )
        })}
      </div>
    </div>
  )
} 