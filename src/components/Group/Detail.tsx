import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Group from "../../models/Group";
import Brackets from "./Brackets";
import Standings from "./Standings";
import Matches from "./Matches";

export default function GroupDetail({ tournamentId, group }: { tournamentId: string, group: Group }) {
  const [selectedTab, setSelectedTab] = useState(0);

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={selectedTab} onChange={(e, v) => setSelectedTab(v)}>
          <Tab label="Partits" value={0} />
          <Tab label="Ranking" value={1} />
        </Tabs>
      </Box>

      {selectedTab === 0 && <Matches tournamentId={tournamentId} groupId={group.id} />}
      {selectedTab === 1 && group.type === 'play_off' && <Brackets tournamentId={tournamentId} groupId={group.id} />}
      {selectedTab === 1 && group.type !== 'play_off' && <Standings tournamentId={tournamentId} groupId={group.id} />}
    </>
  )
}
