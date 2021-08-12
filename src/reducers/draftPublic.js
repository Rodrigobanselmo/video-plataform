const initialState = null


export default (state = initialState, action) => {


    switch(action.type) {
        case 'DRAFT_PUBLIC':
        return action.payload;

        case 'DRAFT_PUBLIC_RESET':
        return null;

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
