import { combineReducers } from 'redux';
import videosReducer from './video';
import adminReducer from './admin';

export default combineReducers({
  videos: videosReducer,
  config: adminReducer
});
