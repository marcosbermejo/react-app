import { FormControl, MenuItem, Select, SelectChangeEvent } from "@mui/material";

export interface FilterProps {
  categories: string[],
  selected: string,
  onChange: (category: string) => void
}

export default function Filter({ categories, selected, onChange }: FilterProps) {
  return (
    <FormControl fullWidth>
      <Select
        displayEmpty
        value={selected}
        onChange={(event: SelectChangeEvent) => onChange(event.target.value)}
        sx={{ backgroundColor: 'white' }}
      >
        <MenuItem value=""><em>Totes les categories</em></MenuItem>
        {categories.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)}
      </Select>
    </FormControl>
  )
}
