import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { arrayMove } from '@dnd-kit/sortable'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'

function BoardContent({ board }) {
  // https://docs.dndkit.com/api-documentation/sensors
  // If you use the default PointerSensor, you must incorporate the CSS touch-action: none property on drag-and-drop elements - but that's still a bug.
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Require the mouse to move 10px to trigger the event, fix the case where the click event is called
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Press and hold for 250ms and the touch tolerance is 500px to trigger the event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // Prioritize using a combination of two types of sensors, mouse and touch, to have the best mobile experience, without bugs.
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    // console.log('handleDragEnd: ', event )
    const { active, over } = event

    // Check if over not exist (drag will return error if bug occur)
    if (!over) return
    // Use dnd-kit's arrayMove to rearrange the original Columns array
    // Code of arrayMove is here: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
    if (active.id !== over.id) {
      // Original index from active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // New index from over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      const dndorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // These console.log for APIs call later on
      // const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
      // console.log('dndorderedColumns: ', dndorderedColumns)
      // console.log('dndorderedColumnsIds: ', dndorderedColumnsIds)

      // Updated state columns after drag and drop
      setOrderedColumns(dndorderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34496e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
      </Box>
    </DndContext>
  )
}

export default BoardContent