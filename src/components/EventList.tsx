'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useEvents } from "@/contexts/EventContext"
import { cn } from "@/lib/utils"
import { useDraggable } from "@dnd-kit/core"
import type { Event } from "@/contexts/EventContext"

interface EventListProps {
  selectedDate: Date
  onAddEvent: () => void
}

interface DragData {
  id: string
  type: 'event'
}

function DraggableEvent({ event, onDelete }: { event: Event; onDelete: () => void }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: event.id,
    data: {
      type: 'event',
      id: event.id,
    } as DragData,
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "p-3 rounded-lg cursor-move touch-none",
        event.category === 'work' ? "bg-blue-50 dark:bg-blue-500/10" :
        event.category === 'personal' ? "bg-green-50 dark:bg-green-500/10" :
        "bg-purple-50 dark:bg-purple-500/10"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className={cn(
            "font-medium mb-1",
            event.category === 'work' ? "text-blue-700 dark:text-blue-300" :
            event.category === 'personal' ? "text-green-700 dark:text-green-300" :
            "text-purple-700 dark:text-purple-300"
          )}>
            {event.title}
          </h3>
          <div className="space-y-1">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {event.startTime} - {event.endTime}
            </p>
            {event.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {event.description}
              </p>
            )}
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
        >
          Delete
        </Button>
      </div>
    </div>
  )
}

export function EventList({ selectedDate, onAddEvent }: EventListProps) {
  const { events, removeEvent } = useEvents()

  const todayEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Events
        </h2>
        <Button
          onClick={onAddEvent}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Event
        </Button>
      </div>

      <div className="space-y-2">
        {todayEvents.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">
            No events scheduled for this date
          </p>
        ) : (
          todayEvents.map((event) => (
            <DraggableEvent
              key={event.id}
              event={event}
              onDelete={() => removeEvent(event.id)}
            />
          ))
        )}
      </div>
    </div>
  )
} 