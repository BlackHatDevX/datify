'use client'

import { useState } from "react"
import { Calendar } from "@/components/Calendar"
import { EventList } from "@/components/EventList"
import { AddEventDialog } from "@/components/AddEventDialog"
import { ExportDialog } from "@/components/ExportDialog"
import { EventProvider } from "@/contexts/EventContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download, Search, X, Calendar as CalendarIcon, Mail, Send } from "lucide-react"
import { ShootingStars } from "@/components/ShootingStars"
import { 
  DndContext, 
  DragEndEvent,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { useEvents } from "@/contexts/EventContext"
import { cn } from "@/lib/utils"
import { useClickAway } from "@/hooks/useClickAway"

interface SearchResult {
  id: string
  title: string
  date: Date
  category: string
}

function SearchResults({ 
  results, 
  onSelect, 
  onClose 
}: { 
  results: SearchResult[]
  onSelect: (date: Date) => void
  onClose: () => void
}) {
  const ref = useClickAway<HTMLDivElement>(() => {
    onClose()
  })

  if (results.length === 0) return null

  return (
    <div
      ref={ref}
      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-[300px] overflow-y-auto z-50"
    >
      {results.map((result) => (
        <button
          key={result.id}
          onClick={() => {
            onSelect(result.date)
            onClose()
          }}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-start gap-3 border-b last:border-b-0 border-gray-100 dark:border-gray-700"
        >
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
              {result.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
              <CalendarIcon className="w-4 h-4" />
              <span>{result.date.toLocaleDateString()}</span>
            </div>
          </div>
          <span className={cn(
            "text-xs px-2 py-1 rounded-full whitespace-nowrap",
            result.category === 'work' ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" :
            result.category === 'personal' ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300" :
            "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
          )}>
            {result.category}
          </span>
        </button>
      ))}
    </div>
  )
}

function SearchBar({ onDateSelect }: { onDateSelect: (date: Date) => void }) {
  const { searchQuery, setSearchQuery, filteredEvents } = useEvents()
  const [showResults, setShowResults] = useState(false)

  const searchResults: SearchResult[] = filteredEvents.map(event => ({
    id: event.id,
    title: event.title,
    date: new Date(event.date),
    category: event.category
  }))

  return (
    <div className="relative max-w-md w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
      <Input
        type="text"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value)
          setShowResults(true)
        }}
        onFocus={() => setShowResults(true)}
        className="pl-9 pr-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
      />
      {searchQuery && (
        <button
          onClick={() => {
            setSearchQuery('')
            setShowResults(false)
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {showResults && searchQuery && (
        <SearchResults
          results={searchResults}
          onSelect={onDateSelect}
          onClose={() => setShowResults(false)}
        />
      )}
    </div>
  )
}

function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-gray-800 shadow-sm mt-8">
      <div className="max-w-6xl mx-auto px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400">
          <p>
            Created by{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Jash Gro
            </span>{' '}
            as an assignment for{' '}
            <span className="font-medium text-gray-700 dark:text-gray-300">
              Dacoid Digital
            </span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:jashg703gd@gmail.com"
              className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Mail className="w-4 h-4" />
              jashg703gd@gmail.com
            </a>
            <a
              href="https://telegram.dog/deveioper_x"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Send className="w-4 h-4 rotate-45" />
              @deveioper_x
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function CalendarApp() {
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return today
  })
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate)
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const { updateEventDate } = useEvents()

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  })
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  })

  const sensors = useSensors(mouseSensor, touchSensor)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.data.current) {
      const newDate = new Date(over.id as string);
      updateEventDate(active.id as string, newDate);
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setCurrentMonth(date)
  }

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-[#0a192f] relative">
        <ShootingStars />
        <div className="relative z-10">
          <main className="max-w-6xl mx-auto p-8">
            <div className="flex flex-col gap-8">
              <header className="flex flex-col sm:flex-row items-center gap-4 bg-white/10 backdrop-blur-lg dark:bg-gray-800/50 p-6 rounded-lg shadow-lg border border-white/10">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                  Datify - An Event Calendar
                </h1>
                <div className="flex-1 flex items-center gap-4 w-full sm:justify-end">
                  <SearchBar onDateSelect={handleDateSelect} />
                  <Button
                    onClick={() => setIsExportOpen(true)}
                    variant="outline"
                    className="flex items-center gap-2 border-white/20 bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Export Events
                  </Button>
                </div>
              </header>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
                <Calendar 
                  selectedDate={selectedDate} 
                  onSelectDate={(date) => {
                    date.setHours(0, 0, 0, 0)
                    setSelectedDate(date)
                  }}
                  onMonthChange={setCurrentMonth}
                />
                <EventList 
                  selectedDate={selectedDate}
                  onAddEvent={() => setIsAddEventOpen(true)}
                />
              </div>
            </div>
          </main>

          <Footer />
        </div>

        <AddEventDialog 
          open={isAddEventOpen}
          onOpenChange={setIsAddEventOpen}
          selectedDate={selectedDate}
        />

        <ExportDialog
          open={isExportOpen}
          onOpenChange={setIsExportOpen}
          currentMonth={currentMonth}
        />
      </div>
    </DndContext>
  )
}

export default function Home() {
  return (
    <EventProvider>
      <CalendarApp />
    </EventProvider>
  )
}
