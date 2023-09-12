import { Stack, Typography, Paper, Box } from "@mui/material";
import ITeam from "../../models/Team";

export default function Team({ team, direction = 'column', size = 80 }: { team?: ITeam, direction?: 'column' | 'row', size?: number }) {

  if (!team) return (
    <Stack alignItems={direction === 'column' ? 'center' : 'flex-start' }>
      <Box
        bgcolor={'grey.300'}
        width={size}
        height={size}
        display={'flex'}
        justifyContent={'center'}
        alignItems={'center'}>
        <Typography fontSize={28}>?</Typography>
      </Box>
    </Stack>
  )

  return (
    <Stack alignItems="center" flexDirection={direction} useFlexGap={true} spacing={1}>
      <Paper elevation={3}>
        <img
          src={team.image}
          alt={team.name}
          style={{ width: '100%', maxWidth: size }}
          loading="lazy"
        />
      </Paper>

      <Typography variant="subtitle2" fontSize={12} fontWeight={'bold'} textAlign="center">
        {team.name}
      </Typography>
    </Stack>
  )
}