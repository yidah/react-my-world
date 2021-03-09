import * as actionTypes from "./actionTypes";

export const setFormValues = (payload)=>{
    return{
        type:actionTypes.SET_FORM_VALUES,
        payload:payload
    }
}
