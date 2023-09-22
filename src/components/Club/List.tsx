import { useContext, useEffect, useState } from "react";
import { Alert, Box, Grid, Link, Paper, Stack, Typography } from "@mui/material";
import Loading from "../../layout/Loading";
import { ClubsContext } from "../../state/Clubs/context";
import Filter from "./Filter";
import { Link as RouterLink } from "react-router-dom";

export default function List() {
  const exclude = ['9152167', '4979977', '4979984', '4979829']
  const { clubsState: { clubStates, error, loading, loaded }, loadClubs } = useContext(ClubsContext)
  const [selectedDelegation, setSelectedDelegation] = useState(localStorage.getItem('tournaments.selectedDelegation') || '');

  const delegations = Array
    .from(new Set(clubStates.filter(({club}) => !exclude.includes(club.id)).map(({ club }) => club.delegation?.name.split('|')[0] ?? '')))
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
    ? clubStates.filter(({ club }) => club.delegation?.name.includes(selectedDelegation))
    : clubStates

  const filteredClubs = selectedClubs.filter(({club}) => !exclude.includes(club.id))

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
        filteredClubs.map(({ club }) =>
          <Grid key={club.id} item xs={6} sm={4} p={2}>
            <Link underline={'none'} color="inherit" component={RouterLink} to={`/clubs/${club.id}`}>
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
            </Link>
          </Grid>
        )
      }
    </Grid>
  </>
}
