import { useContext, useEffect } from 'react';
import { Stack, Alert, FormControl, FormHelperText, MenuItem, InputLabel, Box, Paper, Typography, CardContent, Button, Card, CardActions } from "@mui/material";
import Loading from "../../layout/Loading";
import { TournamentsContext } from '../../providers/TournamentsProvider';
import Tournament from './Tournament';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';

export default function Tournaments() {
  const { loadTournaments, tournaments, error } = useContext(TournamentsContext)
  const [selectedCategory, setSelectedCategory] = React.useState(localStorage.getItem('tournaments.selectedCategory') ?? '');

  useEffect(() => loadTournaments(), [])

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

      {filteredTournaments.map((tournament) => <Tournament key={tournament.id} tournament={tournament} />)}
    </Stack>
  )
}