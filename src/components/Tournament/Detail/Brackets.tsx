import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import Round from "../../../models/Round";
import Team from "../../Team/Team";


export default function Brackets({ rounds }: { rounds: Round[] }) {
  return (
      <Box display={'flex'} flexDirection={'row'} overflow={'scroll'} sx={{ userSelect: 'none', backgroundColor: 'grey.100' }} width={'100%'}>
        {
          rounds.sort((a, b) => a.order - b.order).map(round => (
            <Stack key={round.id} p={2} flexShrink={0}>
              <Typography textAlign={'center'} mb={2}>{round.name}</Typography>
              <Stack flexGrow={1} justifyContent={'space-around'} alignItems={'center'}>
                {
                  round.faceoffs.map(faceoff => (
                    <Paper key={faceoff.id} sx={{p: 1, mb: 2, width:'300px'}} >
                      <Stack spacing={1} useFlexGap={true} width={'250px'}>
                        <Team team={faceoff.first_team} direction='row' size={40} />
                        <Team team={faceoff.second_team} direction='row' size={40} />
                      </Stack>
                    </Paper>
                  ))
                }
              </Stack>
            </Stack>
          ))
        }

      </Box>

  )
}
