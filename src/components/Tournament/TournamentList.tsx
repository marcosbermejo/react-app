import { useContext, useEffect } from 'react';
import { Stack, Alert, FormControl, MenuItem, Box, Typography, CardContent, Card } from "@mui/material";
import Loading from "../../layout/Loading";
import { TournamentsContext } from '../../contexts/TournamentsContext';
import TournamentItem from './TournamentItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';
import { HeaderContext } from '../../contexts/HeaderContext';

export default function Tournaments() {
  const { updateTitle, updatePrevious } = useContext(HeaderContext)
  const { loadTournaments, tournaments, error } = useContext(TournamentsContext)
  const [selectedCategory, setSelectedCategory] = React.useState(localStorage.getItem('tournaments.selectedCategory') ?? '');

  useEffect(() => {
    updateTitle('Competicions 2023 - 2024')
    updatePrevious('')
    loadTournaments()
  }, [])

  if (error) return <Alert severity="error">{error}</Alert>
  if (!tournaments) return <Loading />

  const onChangeCategory = (event: SelectChangeEvent) => {
    setSelectedCategory(event.target.value)
    localStorage.setItem('tournaments.selectedCategory', event.target.value);
  }

  const categories = Array.from(new Set(tournaments.map(tournament => tournament.category)))

  const filteredTournaments = tournaments.filter(tournament => (
    (selectedCategory ? tournament.category === selectedCategory : true) && tournament.groups.length > 0
  ))

  return (
    <Stack spacing={2} pb={9} pt={2}>
      <Box sx={{ px: 2 }}>
        <FormControl fullWidth>
          <Select
            value={selectedCategory}
            onChange={onChangeCategory}
            displayEmpty
            inputProps={{ 'aria-label': 'Without label' }}
            sx={{backgroundColor: 'white'}}
          >
            <MenuItem value=""><em>Totes les categories</em></MenuItem>
            {categories.map((category, i) => <MenuItem key={category} value={category}>{category}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {filteredTournaments.length === 0 && (
        <Card variant="outlined">
          <CardContent sx={{ pb: 0 }}>
            <Typography variant="h6" textAlign="center">
              No hi ha Tournaments per la categoria <em>{selectedCategory}</em>.
            </Typography>
            <Typography fontSize={60} textAlign={'center'} my={4}>🤽‍♀️</Typography>
          </CardContent>
        </Card>

      )}

      {filteredTournaments.map((tournament) => <TournamentItem key={tournament.id} tournament={tournament} />)}
    </Stack>
  )
}