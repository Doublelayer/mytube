import { combineReducers } from 'redux';
import videosReducer from './video';

export default combineReducers({
  videos: videosReducer,
});
