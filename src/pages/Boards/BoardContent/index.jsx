import { useState } from 'react'
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import AddCardIcon from '@mui/icons-material/AddCard'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

const COLUM_HEADER_HEIGHT = '50px'
const COLUM_FOOTER_HEIGHT = '56px'

function BoardContent() {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34496e' : '#1976d2'),
      width: '100%',
      height: (theme) => theme.trello.boardContentHeight,
      display: 'flex'
    }}>
      {/* BOX COLUMN */}
      <Box sx={{
        minWidth: '300px',
        maxWidth: '300px',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
        ml: 2,
        borderRadius: '6px',
        height: 'fit-content',
        maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
      }}>
        {/* BOX COLUMN HEADER */}
        <Box sx={{
          height: COLUM_HEADER_HEIGHT,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Typography sx={{
            fontWeight: 'bold',
            cursor: 'pointer'
          }}> Column Title </Typography>
          <Box>
            <Tooltip title='More options'>
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem>
                <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                <ListItemText>Cute</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* BOX LIST CARD */}
        <Box sx={{
          padding: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) => `calc(
            ${theme.trello.boardContentHeight} - 
            ${theme.spacing(5)} -
            ${COLUM_HEADER_HEIGHT} - 
            ${COLUM_FOOTER_HEIGHT}
            )`
        }}>
          <Card sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset'
          }}>
            <CardMedia
              sx={{ height: 140 }}
              image="https://media.licdn.com/dms/image/C5616AQEZfMhmlvyaqg/profile-displaybackgroundimage-shrink_350_1400/0/1633974284606?e=1712188800&v=beta&t=_i61Ic7vE2tGXUJhdnOZCHBY6PGTheTAfO2ScBeqGeQ"
              title="green iguana"
            />
            <CardContent sx={{ p: 1.5 }}>
              <Typography>
                Nhan Vo MERN Stack
              </Typography>
            </CardContent>
            <CardActions sx={{ p: '0 4px 8px 4px' }}>
              <Button size="small" startIcon={<GroupIcon />}>20</Button>
              <Button size="small" startIcon={<CommentIcon />}>20</Button>
              <Button size="small" startIcon={<AttachmentIcon />}>20</Button>
            </CardActions>
          </Card>
          {/* CARD 01 */}
          <Card sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset'
          }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
              <Typography>
                Card 01
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset'
          }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
              <Typography>
                Card 01
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset'
          }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
              <Typography>
                Card 01
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset'
          }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
              <Typography>
                Card 01
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset'
          }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
              <Typography>
                Card 01
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset'
          }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
              <Typography>
                Card 01
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset'
          }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
              <Typography>
                Card 01
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{
            cursor: 'pointer',
            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
            overflow: 'unset'
          }}>
            <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
              <Typography>
                Card 01
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* BOX FOOTER */}
        <Box sx={{
          height: COLUM_FOOTER_HEIGHT,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button startIcon={<AddCardIcon />}> Add new Card </Button>
          <Tooltip title="Drag to move">
            <DragHandleIcon sx={{ cursor: 'pointer' }} />
          </Tooltip>
        </Box>
      </Box>
    </Box>
  )
}

export default BoardContent