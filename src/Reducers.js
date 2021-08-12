import { combineReducers } from 'redux';
import userReducer from './reducers/userReducer';
import routeReducer from './reducers/routeReducer';
import calendarReducer from './reducers/calendarReducer';
import saveReducer from './reducers/saveReducer';
import modulesReducer from './reducers/modulesReducer';
import progressReducer from './reducers/progressReducer';
import draftAbout from './reducers/draftAbout';
import draftPublic from './reducers/draftPublic';

export default combineReducers({
    user:userReducer,
    draftAbout:draftAbout,
    draftPublic:draftPublic,
    calendar:calendarReducer,
    save:saveReducer,
    modules:modulesReducer,
    progress:progressReducer,
});
