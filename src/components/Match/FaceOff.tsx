import { Box, Stack, Typography } from "@mui/material";

import IMatch from "../../models/Match";
import Team from "../Team/Item";
import Faceoff from "../../models/Faceoff";
import { format } from "date-fns";

export default function FaceOff({ name, faceoff, matches }: { name: string, faceoff: Faceoff, matches?: IMatch[] }) {
  if (!matches) return <></>

  const firstTeam = faceoff.firstTeam
  const secondTeam = faceoff.secondTeam

  return (
    <Stack spacing={1} useFlexGap={true} p={1} alignItems={'center'} >
      <Typography textAlign={'center'} borderBottom={1} mb={1} fontSize={{ xs: 10, sm: 12 }}>
        {name}
      </Typography>

      <Box sx={{ flexGrow: 1, flexBasis: 0, minHeight: 87 }}>
        <Team team={firstTeam} size={40} fontSize={{ xs: 10, sm: 12 }} defaultText={faceoff.firstText} />
      </Box>

      <Stack px={1} width={'100%'} alignItems={'center'}>
        <Stack direction={'row'} justifyContent={'center'} spacing={2} mb={1}>
          {
            matches.map(match => (
              <Typography key={match.id} lineHeight={match.finished ? 1.5 : 1} fontSize={22} fontWeight={700} minWidth={26} textAlign={'center'}>
                {match.finished ? (match.homeTeam?.id === firstTeam?.id ? match.homeTeamResult : match.awayTeamResult) : '-'}
              </Typography>
            ))
          }
        </Stack>

        { matches[0].date && <Typography lineHeight={1} fontSize={14}>{ format(matches[0].date, 'dd/MM/yy') }</Typography> } 

        <Stack direction={'row'} justifyContent={'center'} spacing={2} mt={1}>
          {
            matches.map(match => (
              <Typography key={match.id} lineHeight={1} fontSize={22} fontWeight={700} minWidth={26} textAlign={'center'}>
                {match.finished ? (match.awayTeam?.id === secondTeam?.id ? match.awayTeamResult : match.homeTeamResult) : '-'}
              </Typography>
            ))
          }
        </Stack>
      </Stack>

      <Box sx={{ flexGrow: 1, flexBasis: 0, minHeight: 87 }}>
        <Team team={secondTeam} size={40} fontSize={{ xs: 10, sm: 12 }} defaultText={faceoff.secondText} />
      </Box>
    </Stack>
  )
}