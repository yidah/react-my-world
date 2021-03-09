import * as actionTypes from '../actions/actionTypes';

const initialState = {
  showDrawingTools: false
};

const map = (state = initialState, action) => {
  switch (action.type) {

    case actionTypes.SHOW_DRAWING_TOOLS:
      return {
          ...state,
          showDrawingTools: action.payload
      };

    case actionTypes.GET_PLACE_BY_ADDRESS:
      return { state };

    default:
      return state;
  }
};

export default map;
