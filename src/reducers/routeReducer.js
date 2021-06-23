
const initialState = {list:null,subList:null,subSubList:null}

export default (state = initialState, action) => {
    if(action.type === 'SET_ROUTE') {

        let route = state
        if (action.payload.list) route.list = action.payload.list
        if (action.payload.subList) route.subList = action.payload.subList
        if (action.payload.subSubList) route.subSubList = action.payload.subSubList

        return { ...state,...route};
    } else if(action.type === 'ROUTE') {
        return {...initialState,list:action.payload};
    } else {
      return {...initialState}
    }
}
