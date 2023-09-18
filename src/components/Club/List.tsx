import { useContext, useEffect } from "react";
import { Alert, Grid, Paper, Stack, Typography } from "@mui/material";
import Loading from "../../layout/Loading";
import { ClubsContext } from "../../state/Clubs/context";
import Debug from "../../layout/Debug";

export default function List() {
  const { clubs, error, loading, loaded, loadClubs } = useContext(ClubsContext)

  useEffect(() => {
    loadClubs()
  }, [])

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!loaded) return <></>

  return <>
    <Grid container>
      {
        clubs.map(club => <>
          <Grid item xs={6} sm={4} p={2}>
            <Stack alignItems="center" useFlexGap={true} spacing={1}>
              <Paper elevation={3}>
                <img src={club.image} alt={club.name} style={{ width: '300px', maxWidth: '100%', display: 'block' }} loading="lazy" />
              </Paper>
              <Stack minHeight={'2em'} justifyContent={'center'}>
                <Typography fontSize={20} variant="subtitle2" fontWeight={'bold'} textAlign="center">
                  {club.name}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </>)
      }
    </Grid>
  </>
}
