import { useContext, useEffect } from "react"
import { HeaderContext } from "../state/Header/context"

export default function Teams () {
  const { updateTitle } = useContext(HeaderContext)

  useEffect(() => {
    updateTitle('Equips')
  }, [])

  return (
    <>
      <p>Teams</p>
    </>
  )


}