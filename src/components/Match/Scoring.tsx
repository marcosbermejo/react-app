import { Alert, Box, Paper, Stack, Typography } from "@mui/material";
import SportsVolleyballOutlinedIcon from '@mui/icons-material/SportsVolleyballOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { CSSProperties, useContext, useEffect } from "react";
import { TournamentsContext } from "../../state/Tournaments/context";
import Loading from "../../layout/Loading";
import IScoring from "../../models/Scoring";


export default function Scoring({ tournamentId, matchId }: {tournamentId: string, matchId: string}) {
  const { loadScorings, scoringsState } = useContext(TournamentsContext)

  useEffect(() => {
    loadScorings(matchId, 1, tournamentId)
  }, [])

  const { resources: scorings, error, loading } = scoringsState[matchId] ?? {}

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!scorings) return <></>

  return (
    <Stack>
      {
        scorings.map((score, i) => (
          <Stack key={i} direction={'row'} position='relative'>
            <Box width={'50%'} borderRight={1} px={2} py={4}>
              {score.team === 'first' && <Item score={score} align="right"></Item>}
            </Box>

            {
              <Icon text={score.text ?? ''} />
            }

            <Box width={'50%'} px={2} py={4}>
              {score.team === 'second' && <Item score={score} align="left"></Item>}
            </Box>
          </Stack>
        ))
      }
    </Stack>
  )
}

function Item({ score, align }: { score: IScoring, align: 'right' | 'left' }) {

  const pl = align === 'right' ? 1 : 0
  const pr = align === 'right' ? 0 : 1

  return (
    <Paper elevation={3}>
      <Stack p={1}>
        <Stack direction={align === 'right' ? 'row' : 'row-reverse'} justifyContent={'flex-end'} alignItems={'center'}>
          <Typography fontSize={12} textAlign={align}>{score.text}</Typography>
          <Typography fontSize={22} pl={pl} pr={pr}>{score.minute}</Typography>
        </Stack>
        <Typography textAlign={align} fontSize={12} fontWeight={'bold'}>{score.player}</Typography>
      </Stack>
    </Paper>
  )
}

function Icon({ text }: { text: string }) {

  const style: CSSProperties = {
    background: '#f8f8f8',
    transform: 'translate(-12px, -12px)',
    position: 'absolute',
    left: '50%',
    top: '50%'
  }

  return text.toLowerCase() === 'gol' ? <SportsVolleyballOutlinedIcon style={style} /> : <ErrorOutlineOutlinedIcon style={style} />
}
