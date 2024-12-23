'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FileJson, FileSpreadsheet, FileText } from "lucide-react"
import { useEvents } from "@/contexts/EventContext"
import * as XLSX from 'xlsx'
import { stringify } from 'csv-stringify/sync'

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentMonth: Date
}

interface ExportEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  description: string
  category: string
}

export function ExportDialog({ open, onOpenChange, currentMonth }: ExportDialogProps) {
  const { events } = useEvents()

  const currentMonthEvents = events.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.getMonth() === currentMonth.getMonth() &&
           eventDate.getFullYear() === currentMonth.getFullYear()
  })

  const exportData: ExportEvent[] = currentMonthEvents.map(event => ({
    id: event.id,
    title: event.title,
    date: new Date(event.date).toLocaleDateString(),
    startTime: event.startTime,
    endTime: event.endTime,
    description: event.description,
    category: event.category
  }))

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(exportData, null, 2)
    downloadFile(jsonString, 'events.json', 'application/json')
  }

  const handleExportCSV = () => {
    const csv = stringify(exportData, {
      header: true,
      columns: ['id', 'title', 'date', 'startTime', 'endTime', 'description', 'category']
    })
    downloadFile(csv, 'events.csv', 'text/csv')
  }

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(exportData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Events")
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    downloadFile(
      new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
      'events.xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
  }

  const downloadFile = (content: string | Blob, fileName: string, mimeType: string) => {
    const blob = typeof content === 'string' ? new Blob([content], { type: mimeType }) : content
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export Events</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            onClick={handleExportJSON}
            variant="outline"
            className="flex items-center gap-2 justify-start"
          >
            <FileJson className="w-4 h-4" />
            Export as JSON
          </Button>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="flex items-center gap-2 justify-start"
          >
            <FileText className="w-4 h-4" />
            Export as CSV
          </Button>
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="flex items-center gap-2 justify-start"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export as Excel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 