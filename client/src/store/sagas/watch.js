import { fork, take } from 'redux-saga/effects';
import * as videoActions from '../actions/watch';
import { FIND_VIDEO, COUNT_VIDEO, FIND_BY } from '../../services/url/api-endpoints';
import { REQUEST } from '../actions';
import { get, post } from './index';

export function* watchVideoDetails() {
  while (true) {
    const { videoId } = yield take(videoActions.WATCH_DETAILS[REQUEST]);
    yield fork(fetchVideoDetails, videoId);
    yield fork(updateViewCount, videoId);
  }
}

export function* fetchVideoDetails(videoId) {
  yield get(`${FIND_VIDEO}/${videoId}`, 'GET', videoActions.details);
}

export function* updateViewCount(videoId) {
  yield get(`${COUNT_VIDEO}?id=${videoId}`, 'GET', videoActions.viewCount);
}

export function* sameFolder() {
  while (true) {
    const { projection } = yield take(videoActions.SAME_FOLDER[REQUEST]);
    yield fork(fetchSameFolder, projection);
  }
}

export function* fetchSameFolder(projection) {
  console.log('same folder');
  yield post(`${FIND_BY}`, 'POST', projection, videoActions.sameFolder);
}
