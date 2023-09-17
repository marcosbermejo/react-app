import { Box, FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Group from "../../models/Group";

export interface FilterProps {
  groups: Group[],
  selectedGroupId: string,
  onChange: (groupId: string) => void
}

export default function Filter({ groups, selectedGroupId, onChange }: FilterProps) {
  return (
    <Box sx={{ px: 2, pt: 2 }}>
      <FormControl fullWidth>
        <Select
          displayEmpty
          value={selectedGroupId}
          onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
          sx={{ backgroundColor: 'white' }}
        >
          {groups.map(({ id, name }) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
        </Select>
      </FormControl>
    </Box>
  )
}
