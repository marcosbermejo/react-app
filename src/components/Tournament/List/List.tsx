import { useContext, useEffect, useState } from "react";
import { TournamentsContext } from "../../../state/Tournaments/context";
import { Alert, Box, Stack } from "@mui/material";
import Loading from "../../../layout/Loading";
import Filter from "./Filter";
import Item from "./Item";

export default function List() {
  const { loadTournaments, tournamentsState: { tournamentStates, error, loading, loaded } } = useContext(TournamentsContext)
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = Array
    .from(new Set(tournamentStates.map(({ tournament }) => tournament.category)))
    .sort((a, b) => a.localeCompare(b))

  useEffect(() => {
    loadTournaments()
  }, [])

  useEffect(() => {
    setSelectedCategory(localStorage.getItem('tournaments.selectedCategory') || categories[0])
  }, [categories])

  const onChangeCategory = (category: string) => {
    setSelectedCategory(category)
    localStorage.setItem('tournaments.selectedCategory', category);
  }

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!loaded) return <></>
  if (!selectedCategory) return <></>

  const selectedTournaments = selectedCategory
    ? tournamentStates.filter(({ tournament }) => tournament.category === selectedCategory)
    : []

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
          selectedTournaments.map(({ tournament }) => <Item key={tournament.id} tournament={tournament} />)
        }
      </Stack>
    </>
  )
}
