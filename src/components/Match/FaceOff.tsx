import { Box,  Stack, Typography } from "@mui/material";

import IMatch from "../../models/Match";
import Team from "../Team/Team";
import Faceoff from "../../models/Faceoff";

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

      <Stack direction={'row'} justifyContent={matches.length === 1 ? 'center' : 'space-between'} px={1} maxWidth={100} width={'100%'}>
        {
          matches.map(match => (
            <Stack key={match.id}>
              <Typography fontSize={22} fontWeight={700} minWidth={26} textAlign={'center'}>
                {
                  match.finished
                    ? (match.homeTeam?.id === firstTeam?.id ? match.homeTeamResult : match.awayTeamResult)
                    : '-'
                }
              </Typography>
              <Typography fontSize={22} fontWeight={700} minWidth={26} textAlign={'center'}>
                {
                  match.finished
                    ? (match.awayTeam?.id === secondTeam?.id ? match.awayTeamResult : match.homeTeamResult)
                    : '-'
                }
              </Typography>
            </Stack>
            )
          )
        }
      </Stack>

      <Box sx={{ flexGrow: 1, flexBasis: 0, minHeight: 87 }}>
        <Team team={secondTeam} size={40} fontSize={{ xs: 10, sm: 12 }} defaultText={faceoff.secondText} />
      </Box>
    </Stack>
  )
}