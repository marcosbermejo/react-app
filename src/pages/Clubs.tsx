import { useContext, useEffect } from "react"
import { HeaderContext } from "../state/Header/context"
import List from "../components/Club/List"

export default function Clubs () {
  const { updateTitle } = useContext(HeaderContext)

  useEffect(() => {
    updateTitle('Clubs')
  }, [])

  return (<List />)


}