import {ASSIGN_TOKEN, DESTROY_TOKEN} from '../actionTypes';

const tokenReducerInit = {token: null};

export const tokenReducer = (state = tokenReducerInit, action) => {
  switch (action.type) {
    case ASSIGN_TOKEN:
      return {token: action.payload}
    case DESTROY_TOKEN:
      return {token: null}
    default:
      return state
  }
}