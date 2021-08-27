const initialState = {}


export default (state = initialState, action) => {


    switch(action.type) {
        case 'MODULE_WRITE':
          var newState = {...state}
          newState[action.payload.id] = action.payload
        return {...newState};

        case 'MODULE_UPDATE':
        return {...state,...action.payload};

        case 'MODULE_UPDATE_PERCENTAGE':

          var {percentage,cursoId,moduleId,classId} = action.payload
          var newState = {...state}

          //adicionar percentage
          if (newState[`${cursoId}//${moduleId}//${classId}`])  newState[`${cursoId}//${moduleId}//${classId}`] = {...newState[`${cursoId}//${moduleId}//${classId}`],percentage}
          else newState[`${cursoId}//${moduleId}//${classId}`] = {percentage}

        return {...newState};

        case 'MODULE_DONE':

          var {cursoId,moduleId,classId,nextModule,nextClass,classIndex,moduleIndex} = action.payload
          var newState = {...state}

          //adicionar percentage
          if (newState[`${cursoId}//${moduleId}//${classId}`])  newState[`${cursoId}//${moduleId}//${classId}`] = {...newState[`${cursoId}//${moduleId}//${classId}`],percentage:100}
          else newState[`${cursoId}//${moduleId}//${classId}`] = {percentage:100}


          //adicionar module percentage
          if (newState.watched && newState.watched[moduleId])  newState.watched[moduleId] = [...newState.watched[moduleId].filter(i=>i!=classId),classId]
          else newState.watched[moduleId] = [classId]

          var total = 0;
          Object.values(newState.watched).map(i=>{
            i.map(t=>{
              total += 1
            })
          })

          let totalTest = 0;
          Object.values(newState).map((test) => {
            if (test?.data && test.percentage === 100) totalTest += 1;
          });
          newState.percentage = (total+totalTest)/newState.numOfClasses

          //adicionar module last position
          newState.lastModule = moduleId
          newState.lastClass = classId
          newState.nextModule = nextModule.id
          newState.nextClass = nextClass.id
          newState.position = `${moduleIndex}/${classIndex}`


        return {...newState};

        default:
        return state;
    }
}



/*             action.payload?.data && action.payload.data.map((group)=>{
                var GROUP = {id:item.id, response:[]}
                group?.questions && group.questions.map((question)=>{
                    GROUP.push({})
                })
            }) */
