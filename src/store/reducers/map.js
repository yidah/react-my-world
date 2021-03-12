import * as actionTypes from '../actions/actionTypes';

const initialState = {
  showDrawingTools: false,
  searchWithinTime:false,
  searchNearbyPlaces:false,
  map:{},
  markers:[]
};

const map = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_DRAWING_TOOLS:
      return {
        ...state,
        showDrawingTools: action.payload,
      };

    case actionTypes.SET_MARKERS:
      return {
        ...state,
        markers: [...action.payload.markers]
      };
      
    case actionTypes.SET_MAP:
      return {
        ...state,
        map: {...action.payload.map}
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
