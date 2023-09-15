import { useContext, useEffect } from "react"
import { HeaderContext } from "../state/Header/context"
import { Alert } from "@mui/material"

export default function Teams () {
  const { updateTitle } = useContext(HeaderContext)

  useEffect(() => {
    updateTitle('Equips')
  }, [])

  return (
    <>
      <Alert severity="warning">Pàgina en construcció</Alert>
    </>
  )


}