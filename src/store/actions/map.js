import * as actionTypes from "./actionTypes";

export const setDrawingTools = (payload) => {
    return {
        type: actionTypes.SHOW_DRAWING_TOOLS,
        payload: payload 
    }

}
