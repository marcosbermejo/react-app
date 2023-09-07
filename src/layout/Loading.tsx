import { Stack, CircularProgress } from "@mui/material";

export default function Loading ({ height = '100vh' }: { height?: string }) {
  return (
    <Stack justifyContent={'center'} alignItems={'center'} height={height}>
      <CircularProgress />
    </Stack>
  )
}
