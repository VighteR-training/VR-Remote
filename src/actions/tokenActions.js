import {ASSIGN_TOKEN, DESTROY_TOKEN} from '../actionTypes';

const assign_token = (payload) => {
  return {
    type: ASSIGN_TOKEN,
    payload
  }
}

const destroy_token = () => {
  type: DESTROY_TOKEN
}

export const setToken = (payload) => {
  console.log(payload);
  return (dispatch) => {
    dispatch(assign_token(payload));
  }
}

export const destroyToken = () => {
  return(dispatch) => {
    dispatch(destroy_token());
  }
}