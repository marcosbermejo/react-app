import { Typography, Card, CardContent, Box, Alert, Button, CardProps, Stack, Chip, Avatar, Link } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { TournamentsContext } from "../../../state/Tournaments/context";
import React from "react";
import { format } from "date-fns";
import { ca } from "date-fns/locale";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Team from "../../../models/Team";

const toTitleCase = (title: string) => title.charAt(0).toUpperCase() + title.substring(1).toLowerCase()

const ItemCard = React.forwardRef<any, CardProps>(({ children, ...props }, ref) => (
  <Card {...props} variant="outlined" ref={ref as React.RefObject<HTMLDivElement>}>
    <CardContent sx={{ pb: 0, height: '100%' }}>
      {children}
    </CardContent>
  </Card>
))

export default function Item({ tournamentId }: { tournamentId: string }) {
  const ref = useRef<HTMLDivElement>();
  const { state, loadDates } = useContext(TournamentsContext)

  useEffect(() => {
    loadDates(tournamentId)
  }, [])

  const tournamentState = state.tournaments.find(({ tournament }) => tournament.id === tournamentId)
  if (!tournamentState) return (
    <ItemCard>
      <Alert severity="error">El Tournament amb id {tournamentId} no existeix.</Alert>
    </ItemCard>
  )

  const { tournament } = tournamentState

  const dateTitle = () => {
    const firstMatchDate = tournament.start
    const lastMatchDate = tournament.end
    const firstDate = firstMatchDate ? format(firstMatchDate, `d ${[3, 7, 9].includes(firstMatchDate.getMonth()) ? `'d\'\''` : `'de '`}MMMM`, { locale: ca }) : ''
    const lastDate = lastMatchDate ? format(lastMatchDate, `d ${[3, 7, 9].includes(lastMatchDate.getMonth()) ? `'d\'\''` : `'de '`}MMMM`, { locale: ca }) : ''
    return (firstDate && lastDate) ? `Del ${firstDate} al ${lastDate}` : (firstDate || lastDate)
  }

  const statuses: Record<string, { label: string, color: 'default' | 'success' | 'warning' | 'error' }> = {
    setting_up: { label: 'En preparació', color: 'default' },
    in_progress: { label: 'En curs', color: 'success' },
    finished: { label: 'Finalitzat', color: 'warning' },
    canceled: { label: 'Cancel·lat', color: 'error' }
  }

  const { label, color } = statuses[tournament.status]

  const logos: Record<string, Team> = tournament.teams.reduce((prev, curr) => ({...prev, [curr.image]: curr}), {})

  return (
    <ItemCard ref={ref as React.RefObject<HTMLDivElement>}>
      <Stack>
        <Box mb={2}>
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Chip label={label} color={color} variant="outlined" size="small" />
            <Link display={'flex'} flexDirection={'row'} underline="none" component={RouterLink} to={`/${tournamentId}`}>Detalls <ChevronRightIcon /></Link>
          </Stack>


          <Typography variant="h6" lineHeight={1} mt={2} mb={1} >
            {toTitleCase(tournament.name)}
          </Typography>

          <Typography color="text.secondary" fontSize={14} mb={2}>
            {dateTitle()}
          </Typography>



          {
            Object.entries(logos).map(([image, team]) => (
              <img key={team.id} src={image} alt={team.name} title={team.name} style={{ width: '17%', margin: '4px' }} loading="lazy" />
            ))
          }


        </Box>
      </Stack>

    </ItemCard>
  )
}
