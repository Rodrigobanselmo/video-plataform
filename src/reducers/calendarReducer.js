import {NormalizeData} from '../helpers/DataHandler';

const aulas = {
  name:'Rodrigo Barbosa Anselmo',
  id:Math.random(),
  '19-5-2021':{
    date:'19-5-2021',
    time:{
      '8:00-9:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
      '18:00-19:00':{
        space:'free',
        local:'Presencial',
        area:'Nutricionista',
      },
      '12:00-13:00':{
        space:'fill',
        local:'online',
        area:'Nutricionista',
      },
      '14:00-15:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
    }
  },
  '29-5-2021':{
    date:'29-5-2021',
    time:{
      '8:00-9:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
      '18:00-19:00':{
        space:'free',
        local:'presencial',
        area:'Nutricionista',
      },
      '12:00-13:00':{
        space:'fill',
        local:'online',
        area:'Nutricionista',
      },
      '14:00-15:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
    }
  },
  '22-5-2021':{
    date:'29-5-2021',
    time:{
      '8:00-9:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
      '18:30-19:00':{
        space:'fill',
        local:'online',
        area:'Nutricionista',
      },
      '18:20-18:30':{
        space:'free',
        local:'presencial',
        area:'Nutricionista',
      },
      '14:00-15:00':{
        space:'free',
        local:'online',
        area:'Nutricionista',
      },
    }
  },
}

const initialState = {name:'',id:''}
// const initialState = {...aulas}


export default (state = initialState, action) => {


    switch(action.type) {
        case 'CALENDAR_SET':
        return action.payload;

        case 'CALENDAR_ADD':
          console.log('{...state,...action.payload}',{...state,...action.payload})
        return {...state,...action.payload};

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
