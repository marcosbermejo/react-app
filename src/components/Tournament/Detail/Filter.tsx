import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import Group from "../../../models/Group";

export interface FilterProps {
  groups: Group[],
  selected: string,
  onChange: (groupId: string) => void
}

export default function Filter({ groups, selected, onChange }: FilterProps) { 
  return (
    <FormControl fullWidth>
      <Select
        displayEmpty
        value={selected}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
        sx={{ backgroundColor: 'white' }}
      >
        {groups.map(({ id, name }) => <MenuItem key={id} value={id}>{name}</MenuItem>)}
      </Select>
    </FormControl>
  )
}
