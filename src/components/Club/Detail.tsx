import { useContext, useEffect, useState } from "react"
import { ClubsContext } from "../../state/Clubs/context"
import { Alert, Box, Paper, Stack, Tab, Tabs, Typography } from "@mui/material"
import Loading from "../../layout/Loading"
import ClubMatches from "./ClubMatches"

export default function Detail({ clubId }: { clubId: string }) {
  return <>
    <img src={`${process.env.REACT_APP_CDN_URL}/headers/${clubId}.jpg`} style={{ width: '100%', display: 'block' }} loading="lazy" />
    <ClubDetail clubId={clubId} />
  </>
}

function ClubDetail({ clubId }: { clubId: string }) {
  const { clubsState, loadClub } = useContext(ClubsContext)
  const [selectedTab, setSelectedTab] = useState(0);

  const { club, error, loading } = clubsState.clubStates.find(({ club }) => club.id === clubId) ?? {}

  useEffect(() => {
    loadClub(clubId)
  }, [])

  if (error) return <Alert severity="error">{error}</Alert>
  if (loading) return <Loading />
  if (!club) return <></>

  return <>
    <Stack px={2} spacing={2} useFlexGap={true} mt={2} >
      <Typography textAlign={'center'} variant={'h6'}>{club.name}</Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
          <Tab label="Propers Partits" value={0} />
          <Tab label="Equips" value={1} />
        </Tabs>
      </Box>

      {selectedTab === 0 && <ClubMatches clubId={clubId} />}


    </Stack>
  </>
}
