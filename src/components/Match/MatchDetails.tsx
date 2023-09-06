import { Stack, Typography, Button } from "@mui/material";
import formatDate from "../../util/formatDate";
import Versus from "./Versus";

export default function Details({ date }: { date: Date }) {
  return (
    <Stack>
      <Stack borderBottom={1} justifyContent={'flex-end'} pb={3} mb={3} sx={{ position: 'relative' }}>
        <Typography textAlign={'center'} fontSize={12}>Proper partit:</Typography>
        <Typography textAlign={'center'} fontSize={12}>{formatDate(date, true)}</Typography>
        <Versus />
      </Stack>

      <Stack>
        <Button size="small" variant="outlined" sx={{ maxWidth: 120, alignSelf: 'center' }}>Detalls</Button>
      </Stack>
    </Stack>
  )
}