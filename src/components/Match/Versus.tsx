import { Box, Typography } from "@mui/material";

export default function Versus() {
  return (
    <Box flexGrow={1} borderBottom={1} width={'100%'} position={'relative'}>
      <Typography variant="overline" fontSize={'20px'} sx={{
        display: 'block',
        background: 'white',
        position: 'absolute',
        bottom: '-10px',
        left: '50%',
        lineHeight: 1,
        paddingX: '10px',
        transform: 'translate(-24px, 0)'
      }}>VS</Typography>
    </Box>
  )
}
