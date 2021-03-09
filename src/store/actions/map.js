import * as actionTypes from "./actionTypes";

export const setDrawingTools = (showDrawingTools) => {
    if(showDrawingTools) {
        return {
            type: actionTypes.SHOW_DRAWING_TOOLS,
            payload: true 
        }
    }

    return {
        type: actionTypes.SHOW_DRAWING_TOOLS,
        payload: false 
    }

}
