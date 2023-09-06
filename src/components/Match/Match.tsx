import { Grid } from "@mui/material";
import IMatch from "../../interfaces/Match";
import Team from "../Team/Team";
import Details from "./MatchDetails";

export default function Match({ match }: { match: IMatch }) {
  const { date = '', homeTeam, awayTeam } = match

  if (!date || !homeTeam || !awayTeam) return <></>

  return (
    <Grid container>
      <Grid item xs={3}>
        <Team team={homeTeam} />
      </Grid>
      <Grid item xs={6} px={1}>
        <Details date={date} />
      </Grid>
      <Grid item xs={3}>
        <Team team={awayTeam} />
      </Grid>
    </Grid>
  )
}