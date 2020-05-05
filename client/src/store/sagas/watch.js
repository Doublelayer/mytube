import { fork, take } from 'redux-saga/effects';
import * as videoActions from '../actions/watch';
import { find, viewCount } from '../../services/url/api-endpoints';
import { REQUEST } from '../actions';
import { fetchEntity } from './index';

export function* watchVideoDetails() {
  while (true) {
    const { videoId } = yield take(videoActions.WATCH_DETAILS[REQUEST]);
    yield fork(fetchVideoDetails, videoId);
    yield fork(updateViewCount, videoId);
  }
}

export function* fetchVideoDetails(videoId) {
  yield fetchEntity(`${find}?id=${videoId}`, videoActions.details);
}

export function* updateViewCount(videoId) {
  yield fetchEntity(`${viewCount}?id=${videoId}`, videoActions.viewCount);
}
