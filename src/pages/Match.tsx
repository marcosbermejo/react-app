import { useContext, useEffect } from "react";
import { HeaderContext } from "../state/Header/context";
import { useParams } from "react-router-dom";
import Detail from "../components/Match/Detail";

export default function Match () {
  const { tournamentId, matchId } = useParams()
  const { updateTitle } = useContext(HeaderContext)

  useEffect(() => {
      updateTitle('Partit')
  }, [])

  return <Detail tournamentId={tournamentId ?? ''} matchId={matchId ?? ''}/>
}