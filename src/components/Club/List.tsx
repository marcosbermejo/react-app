import { useContext, useEffect, useState } from "react";
import { Alert, Box, Grid, Paper, Stack, Typography } from "@mui/material";
import Loading from "../../layout/Loading";
import { ClubsContext } from "../../state/Clubs/context";
import Filter from "./Filter";

export default function List() {
  const { clubs, error, loading, loaded, loadClubs } = useContext(ClubsContext)
  const [selectedDelegation, setSelectedDelegation] = useState(localStorage.getItem('tournaments.selectedDelegation') || '');

  const delegations = Array
    .from(new Set(clubs.map((club) => club.delegation?.name.split('|')[0] ?? '')))
    .sort((a, b) => a.localeCompare(b))

  useEffect(() => {
    loadClubs()
  }, [])

  const onChangeDelegation = (delegation: string) => {
    setSelectedDelegation(delegation)
    localStorage.setItem('tournaments.selectedDelegation', delegation);
  }

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!loaded) return <></>

  const selectedClubs = selectedDelegation
    ? clubs.filter(({ delegation }) => delegation?.name.includes(selectedDelegation))
    : clubs

  return <>
    <Box sx={{ px: 2, pt: 2 }}>
      <Filter
        categories={delegations}
        selected={selectedDelegation}
        onChange={onChangeDelegation}
      />
    </Box>
    <Grid container>
      {
        selectedClubs.map(club =>
          <Grid key={club.id} item xs={6} sm={4} p={2}>
            <Stack alignItems="center" useFlexGap={true} spacing={1}>
              <Paper elevation={3}>
                <img src={club.image} alt={club.name} style={{ width: '300px', maxWidth: '100%', display: 'block' }} loading="lazy" />
              </Paper>
              <Stack minHeight={'2em'} justifyContent={'center'}>
                <Typography fontSize={20} variant="subtitle2" fontWeight={'bold'} textAlign="center">
                  {club.name}
                </Typography>
                <Typography variant="body1" textAlign="center">
                  {club.delegation?.name.split('|')[1]}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        )
      }
    </Grid>
  </>
}
