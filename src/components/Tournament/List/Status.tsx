import { Chip } from "@mui/material"
import Tournament from "../../../models/Tournament"

export default function TournamentStatus ({ tournament }: { tournament: Tournament }) {
  const statuses: Record<string, { label: string, color: 'default' | 'success' | 'warning' | 'error' }> = {
    setting_up: { label: 'En preparació', color: 'default' },
    in_progress: { label: 'En curs', color: 'success' },
    finished: { label: 'Finalitzat', color: 'warning' },
    canceled: { label: 'Cancel·lat', color: 'error' }
  }

  const { label, color } = statuses[tournament.status]
  return <Chip label={label} color={color} variant="outlined" size="small" />
}