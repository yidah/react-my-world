import * as actionTypes from "./actionTypes";

export const setDrawingTools = (payload) => {
    return {
        type: actionTypes.SHOW_DRAWING_TOOLS,
        payload: payload 
    }

}

export const setMarkers = (payload)=>{
    return{
        type:actionTypes.SET_MARKERS,
        payload:payload
    }
}

export const setMap = (payload)=>{
    return{
        type:actionTypes.SET_MAP,
        payload:payload
    }
}

export const setSearchWithinTime = (payload)=>{
    return{
        type:actionTypes.SEARCH_WITHIN_TIME,
        payload:payload
    }
}
