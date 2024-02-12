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
  // Nếu dùng PointerSensor mặc định thì phải kết hợp thuộc tính CSS touch-action: none ở những phần tử kéo thả - nhưng mà còn bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Yêu cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Nhấn giữ 250ms và dung sai của cảm ứng 500px thì mới kích hoạt event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })

  // Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm trên mobile tốt nhất, không bị bug.
  // const sensors = useSensors(pointerSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOrderedColumnsState] = useState([])

  useEffect(() => {
    // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumnsState(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  const handleDragEnd = (event) => {
    console.log('handleDragEnd: ', event )
    const { active, over } = event

    if (!over) return
    // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng Columns ban đầu
    // Code của arrayMove ở đây: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
    if (active.id !== over.id) {
      // Original index from active
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      // New index from over
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)

      const dndorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      console.log('dndorderedColumns: ', dndorderedColumns)
      // setOrderedColumns(dndorderedColumns)
      // For calling APIs later on
      // const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
      // console.log('dndorderedColumns: ', dndorderedColumns)
      // console.log('dndorderedColumnsIds: ', dndorderedColumnsIds)
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