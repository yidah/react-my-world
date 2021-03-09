import * as actionTypes from '../actions/actionTypes';

const initialState = {
  marker: null,
  lat: null,
  lng: null,
  showDrawingTools: false
};

const map = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_GOOGLE_API:
      return { state };

    case actionTypes.CREATE_MAP:
      return { state };

    case actionTypes.SHOW_DRAWING_TOOLS:
      return {
          ...state,
          showDrawingTools: action.payload
      };

    case actionTypes.GET_PLACE_BY_ADDRESS:
      return { state };

    case actionTypes.CREATE_MARKER:
      return { state };

    case actionTypes.CREATE_INFOWINDOW:
      return { state };

    default:
      return state;
  }
};

export default map;
