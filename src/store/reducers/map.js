import * as actionTypes from '../actions/actionTypes';

const initialState = {
  showDrawingTools: false,
  searchWithinTime:false,
  searchNearbyPlaces:false
};

const map = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_DRAWING_TOOLS:
      return {
        ...state,
        showDrawingTools: action.payload,
      };

    case actionTypes.SEARCH_WITHIN_TIME:
      return {
        ...state,
        searchWithinTime: action.payload,
      };

    case actionTypes.NEARBY_PLACES_SEARCH:
      return {
        ...state,
        searchNearbyPlaces: action.payload,
      };

    default:
      return state;
  }
};

export default map;
