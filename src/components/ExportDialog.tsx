'use client'

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEvents } from "@/contexts/EventContext"
import { FileJson, FileSpreadsheet, Download } from "lucide-react"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentMonth: Date
}

export function ExportDialog({ open, onOpenChange, currentMonth }: ExportDialogProps) {
  const { events } = useEvents()
  const [isExporting, setIsExporting] = useState(false)

  const getMonthEvents = () => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return eventDate.getMonth() === currentMonth.getMonth() &&
             eventDate.getFullYear() === currentMonth.getFullYear()
    })
  }

  const formatEventForExport = (event: any) => {
    const eventDate = new Date(event.date)
    return {
      title: event.title,
      date: eventDate.toLocaleDateString(),
      startTime: event.startTime,
      endTime: event.endTime,
      category: event.category,
      description: event.description || ''
    }
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    setIsExporting(true)
    try {
      const monthEvents = getMonthEvents().map(formatEventForExport)
      const content = JSON.stringify(monthEvents, null, 2)
      const filename = `events-${currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}.json`
      downloadFile(content, filename)
    } finally {
      setIsExporting(false)
    }
  }

  const exportToCSV = () => {
    setIsExporting(true)
    try {
      const monthEvents = getMonthEvents().map(formatEventForExport)
      const headers = ['Title', 'Date', 'Start Time', 'End Time', 'Category', 'Description']
      const rows = monthEvents.map(event => [
        event.title,
        event.date,
        event.startTime,
        event.endTime,
        event.category,
        `"${event.description.replace(/"/g, '""')}"`
      ])
      const content = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n')
      const filename = `events-${currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}.csv`
      downloadFile(content, filename)
    } finally {
      setIsExporting(false)
    }
  }

  const exportToExcel = () => {
    setIsExporting(true)
    try {
      const monthEvents = getMonthEvents().map(formatEventForExport)
      // Create CSV content with tab separator for Excel
      const headers = ['Title', 'Date', 'Start Time', 'End Time', 'Category', 'Description']
      const rows = monthEvents.map(event => [
        event.title,
        event.date,
        event.startTime,
        event.endTime,
        event.category,
        event.description
      ])
      const content = [
        headers.join('\t'),
        ...rows.map(row => row.join('\t'))
      ].join('\n')
      const filename = `events-${currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}.xls`
      downloadFile(content, filename)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900 border-none shadow-xl">
        <DialogHeader className="space-y-3 pb-4 border-b border-gray-100 dark:border-gray-800">
          <DialogTitle className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
            Export Events
          </DialogTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Export events for {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-4">
          <Button
            onClick={exportToJSON}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <FileJson className="w-4 h-4" />
            Export as JSON
          </Button>

          <Button
            onClick={exportToCSV}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Download className="w-4 h-4" />
            Export as CSV
          </Button>

          <Button
            onClick={exportToExcel}
            disabled={isExporting}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export as Excel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 