import { useContext, useEffect } from "react";
import { HeaderContext } from "../state/Header/context";
import List from "../components/Tournament/List/List";

export default function Tournaments() {
  const { updateTitle } = useContext(HeaderContext)

  useEffect(() => {
    updateTitle('Competicions 2023 - 2024')
  }, [])

  return <List />
}
