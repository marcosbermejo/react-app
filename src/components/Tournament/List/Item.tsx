import { Typography, Card, CardContent, Box, Alert, CardProps, Stack, Chip, Link } from "@mui/material";
import { useContext, useEffect, useRef } from "react";
import { Link as RouterLink } from "react-router-dom";
import { TournamentsContext } from "../../../state/Tournaments/context";
import React from "react";
import { format } from "date-fns";
import { ca } from "date-fns/locale";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Team from "../../../models/Team";
import Tournament from "../../../models/Tournament";
import Status from "./Status";

export default function Item({ tournament }: { tournament: Tournament }) {
  const { loadDates } = useContext(TournamentsContext)

  useEffect(() => {
    loadDates(tournament.id)
  }, [])

  const title = tournament.name.charAt(0).toUpperCase() + tournament.name.substring(1).toLowerCase()

  const dateTitle = () => {
    const firstMatchDate = tournament.start
    const lastMatchDate = tournament.end
    const firstDate = firstMatchDate ? format(firstMatchDate, `d ${[3, 7, 9].includes(firstMatchDate.getMonth()) ? `'d\'\''` : `'de '`}MMMM`, { locale: ca }) : ''
    const lastDate = lastMatchDate ? format(lastMatchDate, `d ${[3, 7, 9].includes(lastMatchDate.getMonth()) ? `'d\'\''` : `'de '`}MMMM`, { locale: ca }) : ''
    return (firstDate && lastDate) ? `Del ${firstDate} al ${lastDate}` : (firstDate || lastDate)
  }

  const logos: Record<string, Team> = tournament.teams.reduce((prev, curr) => ({ ...prev, [curr.image]: curr }), {})

  return (
    <Card>
      <CardContent sx={{ pb: 0 }}>
        <Stack>
          <Box mb={2}>
            <Stack direction={'row'} justifyContent={'space-between'}>
              <Status tournament={tournament} />
              <Link display={'flex'} flexDirection={'row'} component={RouterLink} to={`/${tournament.id}`}>Detalls <ChevronRightIcon /></Link>
            </Stack>

            <Typography variant="h6" lineHeight={1} mt={2} mb={1} >
              {title}
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
      </CardContent>
    </Card>
  )
}
