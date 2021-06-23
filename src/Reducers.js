import { combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import routeReducer from './reducers/routeReducer';
import calendarReducer from './reducers/calendarReducer';
import saveReducer from './reducers/saveReducer';

export default combineReducers({
    user:userReducer,
    route:routeReducer,
    calendar:calendarReducer,
    save:saveReducer,
});
