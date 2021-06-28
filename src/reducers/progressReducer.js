const initialState = {}


export default (state = initialState, action) => {


    switch(action.type) {
        case 'PROGRESS_WRITE':
        return action.payload;

        case 'PROGRESS_UPDATE':
        return {...state,...action.payload};

        case 'PROGRESS_LOGOUT':
        return {...initialState};

        case 'PROGRESS_DONE':
        let data = {...state}
        data[action.payload] && delete data[action.payload]

        return {...data};

        default:
        return state;
    }
}



/*             action.payload?.data && action.payload.data.map((group)=>{
                let GROUP = {id:item.id, response:[]}
                group?.questions && group.questions.map((question)=>{
                    GROUP.push({})
                })
            }) */
