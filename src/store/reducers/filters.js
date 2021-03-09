import * as actionTypes from '../actions/actionTypes';

const initialState = {
  withinTimePlace : '' 
};

const filters = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_FORM_VALUES:
      return { 
        ...state,
        [action.payload.name]:action.payload.value 
      };

    case actionTypes.GET_PLACE_BY_ADDRESS:
      return { state };

    default:
      return state;
  }
};

export default filters;
