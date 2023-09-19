import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

export interface FilterProps {
  categories: string[],
  selected: string,
  onChange: (delegation: string) => void
}

export default function Filter({ categories, selected, onChange }: FilterProps) {
  return (
    <FormControl fullWidth sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <Typography>Delegació:</Typography>
      <Select
        displayEmpty
        value={selected}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
        sx={{ ml: 2, backgroundColor: 'white', fontWeight: 'bold', textAlign: 'left', fontSize: 18, flexGrow: 1 }}
      >
        <MenuItem value="">
          <em>Totes les delegacions</em>
        </MenuItem>
        {categories.map(delegation => <MenuItem key={delegation} value={delegation}>{delegation}</MenuItem>)}
      </Select>
    </FormControl>
  )
}
