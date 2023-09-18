import { useContext, useEffect } from "react"
import { HeaderContext } from "../state/Header/context"
import List from "../components/Club/List"
import ClubsProvider from "../state/Clubs/context"

export default function Teams () {
  const { updateTitle } = useContext(HeaderContext)

  useEffect(() => {
    updateTitle('Clubs')
  }, [])

  return (<ClubsProvider><List /></ClubsProvider>)


}