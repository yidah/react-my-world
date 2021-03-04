import * as actionTypes from '../actions/actionTypes';

const initialState = {
    drawingToolsClicked : true
};

const filters = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SHOW_DRAWING_TOOLS:
      return {
          ...state,
          drawingToolsClicked :!state.drawingToolsClicked
        };
    default:
      return state;
  }
};

export default filters;