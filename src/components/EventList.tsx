'use client'

import { Button } from "@/components/ui/button"
import { Trash2, Calendar as CalendarIcon, Clock, Plus, GripVertical } from "lucide-react"
import { useEvents, categoryColors } from "@/contexts/EventContext"
import { cn } from "@/lib/utils"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"

interface EventListProps {
  selectedDate: Date | null
  onAddEvent: () => void
}

function DraggableEvent({ event, onRemove }: { 
  event: any, 
  onRemove: () => void 
}) {
  const {attributes, listeners, setNodeRef, transform, isDragging} = useDraggable({
    id: event.id,
    data: event
  });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    scale: isDragging ? 0.9 : 1,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
    touchAction: 'none',
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-4 rounded-lg group transition-all duration-200 relative overflow-hidden touch-none",
        "bg-gray-50 dark:bg-gray-700/50",
        "hover:bg-gray-100 dark:hover:bg-gray-700",
        isDragging && "ring-2 ring-blue-500 dark:ring-blue-400"
      )}
    >
      <div className="absolute left-0 top-0 w-1 h-full" style={{
        backgroundColor: event.category === 'work' ? '#3B82F6' : 
                        event.category === 'personal' ? '#22C55E' : 
                        '#A855F7'
      }} />
      <div className="flex items-start justify-between pl-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-gray-800 dark:text-gray-200">
              {event.title}
            </h4>
            <span className={cn(
              "text-xs px-2 py-0.5 rounded-full",
              event.category === 'work' ? "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300" :
              event.category === 'personal' ? "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300" :
              "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300"
            )}>
              {event.category}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          {event.description && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {event.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
          <div 
            {...listeners} 
            {...attributes}
            className="cursor-grab active:cursor-grabbing p-1.5 -mr-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function EventList({ selectedDate, onAddEvent }: EventListProps) {
  const { filteredEvents, removeEvent, searchQuery } = useEvents()
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  if (!selectedDate) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <p className="text-gray-500 dark:text-gray-400 text-center">
          Select a date to view events
        </p>
      </div>
    )
  }

  const dateEvents = filteredEvents.filter(event => 
    new Date(event.date).toDateString() === selectedDate.toDateString()
  )

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-gray-800 dark:text-gray-200">
            {formatDate(selectedDate)}
          </h3>
        </div>
        <Button
          onClick={onAddEvent}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Event
        </Button>
      </div>
      
      {dateEvents.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            {searchQuery 
              ? "No matching events found for this day" 
              : "No events scheduled for this day"
            }
          </p>
          {!searchQuery && (
            <Button
              onClick={onAddEvent}
              variant="outline"
              className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Schedule an Event
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {dateEvents.map((event) => (
            <DraggableEvent
              key={event.id}
              event={event}
              onRemove={() => removeEvent(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
} 