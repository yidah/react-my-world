import * as actionTypes from '../actions/actionTypes';

const initialState = {
  withinTimePlace: '',
  maxDuration:'10',
  mode:'DRIVING', 
};

const filters = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_FORM_VALUES:
      return { 
        ...state,
        [action.payload.name]:action.payload.value 
      };

    default:
      return state;
  }
};

export default filters;
