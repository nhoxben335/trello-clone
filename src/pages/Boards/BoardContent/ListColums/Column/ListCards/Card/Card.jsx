import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Card as MuiCard } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'

function Card({ card }) {
  return (
    <MuiCard sx={{
      cursor: 'pointer',
      boxShadow: '0 1px 1px rgba(0, 0, 0, 0.2)',
      overflow: 'unset'
    }}>
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} /> }
      <CardContent sx={{ p: 1.5 }}>
        <Typography>{card?.title}</Typography>
      </CardContent>
      <CardActions sx={{ p: '0 4px 8px 4px' }}>
        {!!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button> }
        <Button size="small" startIcon={<CommentIcon />}>20</Button>
        <Button size="small" startIcon={<AttachmentIcon />}>20</Button>
      </CardActions>
    </MuiCard>
  )
}

export default Card
