import * as actionTypes from "./actionTypes";

export const setDrawingTools = (payload) => {
    return {
        type: actionTypes.SHOW_DRAWING_TOOLS,
        payload: payload 
    }

}
export const setSearchWithinTime = (payload)=>{
    return{
        type:actionTypes.SEARCH_WITHIN_TIME,
        payload:payload
    }
}
export const setNearbyPlaceGoSearch = (payload)=>{
    return{
        type:actionTypes.NEARBY_PLACES_SEARCH,
        payload:payload
    }
}
