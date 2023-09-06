import { format } from 'date-fns'

export default function formatDate (date: Date | null, hour = false): string {
  if (!date) return ''
  return format(date, `dd/MM/yyyy${hour ? ' HH:mm' : ''}`)
}