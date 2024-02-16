import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { arrayMove } from '@dnd-kit/sortable'
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  rectIntersection,
  getFirstCollision
} from '@dnd-kit/core'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep } from 'lodash'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

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
  // Only one element is being dragged at a time (column or card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Final impact point
  const lastOverId = useRef(null)

  useEffect(() => {
    // const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])

  // Find a Column by CardId
  const findColumnByCardId = (cardId) => {
  // we should use c.cards instead of c.cardOrderIds because in the handleDragOver we will make the data for the complete cards first and then create new cardOrderIds.
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Khởi tạo Function chung xử lý việc cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau.
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Find the position (index) of the overCard in the target column (where the activeCard is about to be dropped)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone the old OrderedColumnsState array into a new one to process the data and return - update the new OrderedColumnsState
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // nextActiveColumn: Old Columns
      if (nextActiveColumn) {
        // Delete the card in the active column (can also be understood as the old column, the time when pulling the card out of it to move to another column)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Update the cardOrderIds array for data standards
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // nextOverColumn: New Column
      if (nextOverColumn) {
        // Check if the card being pulled exists in overColumn, if so, need to delete it first data
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)
        // Next, add the dragging card to overColumn according to the new index position
        // Updated data at columnId in card after drag card between 2 columns
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        // Updated OrderIds
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      // console.log('nextColumns: ', nextColumns)
      return nextColumns
    })
  }

  // Trigger when start drag an elements
  const handleDragStart = (event) => {
    // console.log('handleDragEnd: ', event )
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // If you pull a card, then perform the action of setting the oldColumn value
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger while dragging an element
  const handleDragOver = (event) => {
    // Don't do anything else dragging Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // If you drag a card, do more processing to be able to drag the card back and forth between columns
    const { active, over } = event

    // Ensure that if active or over does not exist (when pulled out of the container), do nothing (avoid page crash)
    if (!active || !over) return

    // activeDraggingCard: It's the card being pulled
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active

    // overCard: is the card that is interacting above or below the card dragged above.
    const { id: overCardId } = over

    // Find 2 columns by cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // If one of the two columns does not exist, do nothing to avoid crashing the website
    if (!activeColumn || !overColumn) return

    // Processing logic here is only when dragging the card through 2 different columns, but if dragging the card in its original column, nothing will be done. Because this is the processing when dragging (handleDragOver), but processing when dragging is completed is another problem (handleDragEnd).
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }

  // Trigger when drop an elements
  const handleDragEnd = (event) => {
    // console.log('HandleDragEnd: ', event)
    const { active, over } = event
    // Ensure that if active or over does not exist (when pulled out of the container), do nothing (avoid page crash)
    if (!active || !over) return

    // Handle drag and drop Cards
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: It's the card being pulled
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active

      // overCard: is the card that is interacting above or below the card dragged above.
      const { id: overCardId } = over

      // Find columns by cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // If one of the two columns does not exist, do nothing to avoid crashing the website
      if (!activeColumn || !overColumn) return

      // Action of dragging and dropping cards between 2 different columns
      // Must use activeDragItemData.columnId or oldColumnWhenDraggingCard._id (set to state from handleDragStart step) and not activeData in this handleDragEnd scope because after going through onDragOver here, the card's state has already been updated once. if (oldColumnWhenDraggingCard._id !== overColumn._id) {
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Action of dragging and dropping cards in the same column
        // Original index from oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // New index from overColumn
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        // Use arrayMove because dragging cards in a column is similar to the logic of dragging columns in a board content
        const dndorderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        // Still call update State here to avoid delay or Flickering of the interface when dragging and dropping and need to wait for the API call
        setOrderedColumns(prevColumns => {
        // Clone the old Ordered Column State array into a new one to process the data and return - update the new OrderedColumnsState
          const nextColumns = cloneDeep(prevColumns)

          // Find the Column we are dropping
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          // Update the 2 new values card and cardOrderIds in the targetColumn
          targetColumn.cards = dndorderedCards
          targetColumn.cardOrderIds = dndorderedCards.map(card => card._id)
          // console.log('targetColumn: ', targetColumn)
          // Returns the new state value (standard position)
          return nextColumns
        })
      }
    }

    // Handle drag and drop Columns
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Use dnd-kit's arrayMove to rearrange the original Columns array
      // Code of arrayMove is here: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
      if (active.id !== over.id) {
        // Original index from active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // New index from over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        const dndorderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // These console.log for APIs call later on
        // const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
        // console.log('dndorderedColumns: ', dndorderedColumns)
        // console.log('dndorderedColumnsIds: ', dndorderedColumnsIds)

        // Updated state columns after drag and drop
        setOrderedColumns(dndorderedColumns)
      }
    }

    // Data after drag and drop need to be null
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // Animation when dropping elements - Test by dragging and dropping directly and looking at the Overlay placeholder
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } })
  }

  // Customize the optimal collision detection strategy/algorithm for dragging and dropping cards between multiple columns
  // rgs = arguments = Arguments, parameters
  const collisionDetectionStrategy = useCallback((args) => {
    // In case of dragging columns, using the closestCorners algorithm is the most standard
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Find intersections, collisions, return an array of intersections with the cursor
    const pointerIntersections = pointerWithin(args)

    // If pointerIntersections is an empty array, return nothing.
    // Thoroughly fix the flickering bug of the Dnd-kit library in the following cases:
    // Drag a card with a large cover image and drag it to the top out of the drag and drop area
    if (!pointerIntersections?.length) return

    // The collision detection algorithm will return an array of collisions here
    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    // Find the first overId in the pointerIntersections group above
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      // If the over is a column, it will find the nearest cardId within that collision area based on the collision detection algorithm closestCenter or closestCorners. However, using closestCorners here I find it smoother.
      // Without this checkColumn section, the flickering bug can still be fixed, but dragging and dropping will be very laggy.
      const checkColumn = orderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('overId before: ', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overId after: ', overId)
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      // Collision detection algorithm (without it, the card with a large cover will not be able to pull over the Column because there is now a conflict between the card and the column), we will use closestCorners instead of closestCenter
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34496e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns}/>
        <DragOverlay dropAnimation={customDropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent