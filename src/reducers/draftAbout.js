const initialState = null


export default (state = initialState, action) => {


    switch(action.type) {
        case 'DRAFT_ABOUT':
          console.log(`action.payload`, action.payload)
        return action.payload;

        case 'DRAFT_ABOUT_RESET':
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
