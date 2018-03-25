import { GENERATE_GYROSCOPE, PUSH_GYROSCOPE_ARRAY, RESET_GYROSCOPE_ARRAY } from '../actionTypes';

const gyroscopeReducerInit = {
	x: 'unknown',
	y: 'unknown',
	z: 'unknown'
}

export const gyroscopeReducer = (state = gyroscopeReducerInit, action) => {
	switch (action.type) {
		case GENERATE_GYROSCOPE:
			return {...action.payload}
		default:
			return {...state}
	}
}

export const gyroscopeArrayReducer = (state = [], action) => {
	switch (action.type) {
		case PUSH_GYROSCOPE_ARRAY:
			return [...state, action.payload]
		case RESET_GYROSCOPE_ARRAY:
			return []
		default:
			return [...state]
	}
}