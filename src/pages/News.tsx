import { Alert } from "@mui/material";
import { useContext, useEffect } from "react";
import { HeaderContext } from "../state/Header/context";

export default function News () {
  const { updateTitle } = useContext(HeaderContext)

  useEffect(() => {
    updateTitle('Notícies')
  }, [])

  return (
    <>
      <Alert severity="warning">Pàgina en construcció</Alert>
    </>
  )


}