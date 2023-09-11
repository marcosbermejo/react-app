import { Stack, Typography, Paper } from "@mui/material";
import ITeam from "../../models/Team";

export default function Team({ team }: { team: ITeam }) {
  return (
    <Stack alignItems="center">
      <Paper elevation={3} sx={{ mb: 1 }}>
        <img
          src={team.image}
          alt={team.name}
          style={{ width: '100%', maxWidth: 80 }}
          loading="lazy"
        />
      </Paper>

      <Typography variant="subtitle2" fontSize={12} fontWeight={'bold'} textAlign="center">
        {team.name}
      </Typography>
    </Stack>
  )
}