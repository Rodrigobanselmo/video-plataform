const initialState = {}


export default (state = initialState, action) => {


    switch(action.type) {
        case 'PROGRESS_WRITE':
        return action.payload;

        case 'PROGRESS_UPDATE':
        return {...state,...action.payload};

        case 'PROGRESS_UPDATE_ANSWER':
          var data = {...state}

          if (data[action.payload.key]) {
            data[action.payload.key] = {...data[action.payload.key],...action.payload.insert}
          } else {
            data[action.payload.key] = action.payload.insert
          }
        return {...state};

        case 'PROGRESS_LOGOUT':
        return {...initialState};

        case 'PROGRESS_DONE':
        var data = {...state}
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
