import { fork, take } from 'redux-saga/effects';
import * as videoActions from '../actions/watch';
import { REQUEST } from '../actions';
import { fetchEntity } from './index';

export function* watchVideoDetails() {
  while (true) {
    const { videoId } = yield take(videoActions.WATCH_DETAILS[REQUEST]);
    yield fork(fetchVideoDetails, videoId);
  }
}

export function* fetchVideoDetails(videoId) {
  yield fetchEntity(`http://localhost:5000/find?id=${videoId}`, videoActions.details);
}
