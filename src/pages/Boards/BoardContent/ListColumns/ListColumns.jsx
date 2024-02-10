import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'

function ListColumns({ columns }) {
  /***
   * The SortableContext requires items to be an array of the form ['id-1', 'id-2'] and not [{id: 'id-1'}, {id: 'id-2'}]
   * If not, you can still drag and drop but there will be no animation
   * https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
   */

  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {/* Mapping the column */}
        {columns?.map(column => <Column key={column._id} column={column} />)}

        {/* Box add new column */}
        <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}>
          <Button
            startIcon={<NoteAddIcon />}
            sx={{
              color: 'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1
            }}
          >
          Add new column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumns