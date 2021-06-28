import { combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import routeReducer from './reducers/routeReducer';
import calendarReducer from './reducers/calendarReducer';
import saveReducer from './reducers/saveReducer';
import modulesReducer from './reducers/modulesReducer';
import progressReducer from './reducers/progressReducer';

export default combineReducers({
    user:userReducer,
    route:routeReducer,
    calendar:calendarReducer,
    save:saveReducer,
    modules:modulesReducer,
    progress:progressReducer,
});
