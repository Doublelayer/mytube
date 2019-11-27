import { fork, take } from 'redux-saga/effects';
import * as videoActions from '../actions/video';
import { REQUEST } from '../actions';
import { fetchEntity } from './index';

export function* watchMostPopularVideos() {
  while (true) {
    const { amount, loadDescription, nextPageToken } = yield take(videoActions.MOST_POPULAR[REQUEST]);
    yield fork(fetchAllVideos, amount, loadDescription, nextPageToken);
  }
}

export function* fetchAllVideos() {
  yield fetchEntity('http://localhost:5000/all', videoActions.mostPopular);
}
