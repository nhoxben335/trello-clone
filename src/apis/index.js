import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

/** Boards */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  // axios will return results through its property data
  return response.data
}
