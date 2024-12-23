'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type EventCategory = 'work' | 'personal' | 'other'

export interface Event {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  description?: string
  category: EventCategory
}

export const categoryColors = {
  work: 'bg-blue-500',
  personal: 'bg-green-500',
  other: 'bg-purple-500'
} as const

interface EventContextType {
  events: Event[]
  filteredEvents: Event[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  addEvent: (event: Omit<Event, 'id'>) => void
  removeEvent: (id: string) => void
  updateEventDate: (eventId: string, newDate: Date) => void
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('calendar-events')
    if (stored) {
      try {
        const parsedEvents = JSON.parse(stored)
        setEvents(Array.isArray(parsedEvents) ? parsedEvents : [])
      } catch (error) {
        console.error('Error parsing stored events:', error)
        setEvents([])
      }
    }
  }, [])

  const filteredEvents = events.filter(event => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    const searchableFields = [
      event.title,
      event.description || '',
      String(event.category),
      new Date(event.date).toLocaleDateString(),
      event.startTime,
      event.endTime
    ]

    return searchableFields.some(field => 
      field.toLowerCase().includes(query)
    )
  })

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: crypto.randomUUID()
    }
    
    setEvents(prevEvents => {
      const newEvents = [...prevEvents, newEvent]
      localStorage.setItem('calendar-events', JSON.stringify(newEvents))
      return newEvents
    })
  }

  const removeEvent = (id: string) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.filter(event => event.id !== id)
      localStorage.setItem('calendar-events', JSON.stringify(newEvents))
      return newEvents
    })
  }

  const updateEventDate = (eventId: string, newDate: Date) => {
    setEvents(prevEvents => {
      const newEvents = prevEvents.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            date: newDate.toISOString()
          }
        }
        return event
      })
      localStorage.setItem('calendar-events', JSON.stringify(newEvents))
      return newEvents
    })
  }

  return (
    <EventContext.Provider 
      value={{ 
        events, 
        filteredEvents,
        searchQuery,
        setSearchQuery,
        addEvent, 
        removeEvent, 
        updateEventDate 
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

export function useEvents() {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider')
  }
  return context
} 