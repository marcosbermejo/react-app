import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import Round from "../../../models/Round";
import Team from "../../Team/Team";
import Match from "../../../models/Match";
import Faceoff from "../../../models/Faceoff";
import FaceOff from "../../Match/FaceOff";

export default function Brackets({ rounds, matches }: { rounds: Round[], matches?: Match[] }) {

  const sortedRounds = rounds.sort((a, b) => {
    if (a.faceoffs.length === b.faceoffs.length) {
      return a.faceoffs[0]?.firstPreviousFaceoffId ? -1 : 0
    }
    return b.faceoffs.length - a.faceoffs.length
  })


  return (
    <Stack sx={{ userSelect: 'none' }}>
      {
        sortedRounds.map(round => (
          <Box key={round.id}>
            <Stack direction={'row'} spacing={1} useFlexGap={true}>
              {
                round.faceoffs.map((faceoff, i) => (
                  <Paper key={faceoff.id} sx={{ flexGrow: 1, flexBasis: 0, width: 0 }}>
                    <FaceOff
                      faceoff={faceoff}
                      name={`${round.name}${ round.faceoffs.length > 1 ? ` ${i+1}` : ''}`}
                      matches={matches?.filter(match => match.faceoffId === faceoff.id)}
                    />
                  </Paper>
                ))
              }
            </Stack>
            <Stack key={round.id} direction={'row'} spacing={1} useFlexGap={true} height={32}>
              {
                Array.from(Array(Math.floor(round.faceoffs.length / 2)).keys()).map(i => (
                  <Box flexGrow={1} height={'auto'} display={'flex'} justifyContent={'center'}>
                    <Stack width={'50%'}>
                      <Box borderLeft={1} borderRight={1} borderBottom={1} width={'100%'} height={'100%'}></Box>
                      <Box borderRight={1} width={'50%'} height={'100%'}></Box>
                    </Stack>
                  </Box>
                ))
              }
            </Stack>
          </Box>
        ))
      }
    </Stack>
  )
}


