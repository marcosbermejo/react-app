import { Stack, CircularProgress } from "@mui/material";

export default function Loading () {
  return (
    <Stack justifyContent={'center'} alignItems={'center'} flexGrow={1} height={'100%'}>
      <CircularProgress />
    </Stack>
  )
}
