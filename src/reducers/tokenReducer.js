import {ASSIGN_TOKEN, DESTROY_TOKEN} from '../actionTypes';

export const tokenReducer = (state = null, action) => {
  switch (action.type) {
    case ASSIGN_TOKEN:
      return action.payload
    case DESTROY_TOKEN:
      return null
    default:
      return state
  }
}