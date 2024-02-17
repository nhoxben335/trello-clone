// Capitalize the first letter of a string

export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}

/**
 * generatePlaceholderCard function: How to handle Dnd-kit library logic bug when Column is empty:
 * The FE side will create a special card: Placeholder Card, not related to the Back-end
 * This special card will be hidden in the user UI interface.
 * The Id structure of this card to Unique is very simple, no need to do complicated randomization:
 * "columnId-placeholder-card" (each column can only have a maximum of one Placeholder Card)
 * Important when creating: must be complete: (_id, boardId, columnId, FE_PlaceholderCard)
*/

export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placeholder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}
