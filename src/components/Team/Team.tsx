import { Stack, Typography, Paper, Box } from "@mui/material";
import ITeam from "../../models/Team";

type TeamProps = {
  team?: ITeam,
  direction?: 'column' | 'row',
  size?: number,
  fontSize?: number | { xs?: number, sm?: number },
  defaultText?: string
}

export default function Team({ team, direction = 'column', size = 80, fontSize = 12, defaultText }: TeamProps) {
  return (
    <Stack alignItems="center" flexDirection={direction} useFlexGap={true} spacing={1}>
      <Paper elevation={3} sx={{p: 0.5}}>
        {
          team
            ? <img src={team.image} alt={team.name} style={{ width: '100%', maxWidth: size, display:'block' }} loading="lazy"/>
            : (
              <Box bgcolor={'grey.300'} width={size} height={size} display={'flex'} justifyContent={'center'} alignItems={'center'}>
                <Typography fontSize={28}>?</Typography>
              </Box>)
        }
        
      </Paper>
      <Stack minHeight={'2em'} justifyContent={'center'}>
        <Typography variant="subtitle2" fontSize={fontSize} fontWeight={'bold'} textAlign="center">
          {team ? team.name : defaultText}
        </Typography>
      </Stack>

    </Stack>
  )
}