import { GENERATE_GYROSCOPE, PUSH_GYROSCOPE_ARRAY, RESET_GYROSCOPE_ARRAY } from '../actionTypes';

const generateGyroscope = (payload) => {
  return {
    type: GENERATE_GYROSCOPE,
    payload
  }
}

export const assignGyroscope = (gyroscope) => {
  return (dispatch) => {
    dispatch(generateGyroscope(gyroscope));
  }
}

const pushGyroscopeArray = (payload) => {
  return {
    type: PUSH_GYROSCOPE_ARRAY,
    payload:payload
  }
}

export const assignGyroscopeArray = (gyroscope) => {
  return (dispatch) => {
    dispatch(pushGyroscopeArray(gyroscope));
  }
}

const reset_gyroscope_array = () => {
	return {
		type: RESET_GYROSCOPE_ARRAY
	}
}

export const resetGyroscopeArray = () => {
	return (dispatch) => {
		dispatch(reset_gyroscope_array());
	}
}