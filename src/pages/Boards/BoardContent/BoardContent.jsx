import Box from '@mui/material/Box'
import ListColumns from './ListColums/ListColumns'

function BoardContent() {
  // const [anchorEl, setAnchorEl] = useState(null)
  // const open = Boolean(anchorEl)
  // const handleClick = (event) => setAnchorEl(event.currentTarget)
  // const handleClose = () => setAnchorEl(null)

  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34496e' : '#1976d2'),
      width: '100%',
      height: (theme) => theme.trello.boardContentHeight,
      p: '10px 0'
    }}>
      <ListColumns />
    </Box>
  )
}

export default BoardContent