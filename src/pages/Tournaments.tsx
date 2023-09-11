import { Alert } from "@mui/material";
import Filter from "../components/Tournament/Filter";
import { useContext, useEffect, useState } from "react";
import { HeaderContext } from "../state/Header/context";
import { TournamentsContext } from "../state/Tournaments/context";
import Loading from "../layout/Loading";
import List from "../components/Tournament/List";

export default function Tournaments () {
  const { updateTitle, updatePrevious } = useContext(HeaderContext)
  const { loadTournaments, state } = useContext(TournamentsContext)
  const [selectedCategory, setSelectedCategory] = useState(localStorage.getItem('tournaments.selectedCategory') ?? '');

  const onChangeCategory = (category: string) => {
    setSelectedCategory(category)
    localStorage.setItem('tournaments.selectedCategory', category);
  }

  useEffect(() => {
    updateTitle('Competicions 2023 - 2024')
    updatePrevious('')
    loadTournaments()
  }, [])

  const { tournaments, error, loading } = state
  const categories = Array.from(new Set(tournaments.map(({ tournament }) => tournament.category)))

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />

  return (
    <>
      <Filter
        categories={categories}
        selected={selectedCategory}
        onChange={onChangeCategory}
      />

      <List category={selectedCategory} />
    </>
  )
}