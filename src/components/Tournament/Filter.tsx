import { FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";

export interface FilterProps {
  categories: string[],
  selected: string,
  onChange: (category: string) => void
}

export default function Filter({ categories, selected, onChange }: FilterProps) {
  return (
    <FormControl fullWidth sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
      <Typography>Categoria:</Typography>
      <Select
        value={selected}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
        sx={{ ml: 2, backgroundColor: 'white', fontWeight: 'bold', textAlign:'left', fontSize: 18, flexGrow: 1 }}
      >
        {categories.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)}
      </Select>
    </FormControl>
  )
}
