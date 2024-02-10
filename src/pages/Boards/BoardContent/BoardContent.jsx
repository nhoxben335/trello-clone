import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext } from '@dnd-kit/core'
import { useState } from 'react'

function BoardContent({ board }) {
  const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  const [orderedColumnsState, setOrderedColumnsState] = useState([])

  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event )
  }
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34496e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumnsState}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent