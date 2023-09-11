import { useContext, useEffect, useState } from "react";
import { TournamentsContext } from "../../../state/Tournaments/context";
import { Alert, Box, Card, CardContent, Stack, Typography } from "@mui/material";
import Loading from "../../../layout/Loading";
import Filter from "./Filter";
import Item from "./Item";

export default function List() {
  const { loadTournaments, state: { tournaments, error, loading, loaded } } = useContext(TournamentsContext)
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem('tournaments.selectedCategory') ?? '');

  const onChangeCategory = (category: string) => {
    setSelectedCategory(category)
    localStorage.setItem('tournaments.selectedCategory', category);
  }

  useEffect(() => {
    loadTournaments()
  }, [])

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!loaded) return <></>

  const categories = Array
    .from(new Set(tournaments.map(({ tournament }) => tournament.category)))
    .sort((a, b) => a.localeCompare(b))

  const emptyList = (
    <Card variant="outlined">
      <CardContent sx={{ pb: 0 }}>
        <Typography variant="h6" textAlign="center">
          No hi ha competicions per la categoria <em>{selectedCategory}</em>.
        </Typography>
        <Typography fontSize={60} textAlign={'center'} my={4}>🤽‍♀️</Typography>
      </CardContent>
    </Card>
  )

  const selectedTournaments = selectedCategory
    ? tournaments.filter(({ tournament }) => tournament.category === selectedCategory)
    : tournaments

  return (
    <>
      <Box sx={{ px: 2, pt: 2 }}>
        <Filter
          categories={categories}
          selected={selectedCategory}
          onChange={onChangeCategory}
        />
      </Box>

      <Stack spacing={2} pb={2}>
        {
          selectedTournaments.length > 0
            ? selectedTournaments.map(({ tournament }) => <Item key={tournament.id} tournamentId={tournament.id} />)
            : emptyList
        }
      </Stack>
    </>
  )
}
