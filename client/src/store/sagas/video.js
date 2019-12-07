import { fork, take } from 'redux-saga/effects';
import * as videoActions from '../actions/video';
import { videos } from '../../services/url/api-endpoints';
import { REQUEST } from '../actions';
import { fetchEntity } from './index';

export function* watchMostPopularVideos() {
  while (true) {
    const { skip, limit } = yield take(videoActions.MOST_POPULAR[REQUEST]);
    yield fork(fetchMostPopular, skip, limit);
  }
}

export function* fetchMostPopular(skip, limit) {
  yield fetchEntity(`${videos}?$sort={"statistics.viewCount": -1 }&$type=video&$limit=${limit}&$skip=${skip}`, videoActions.mostPopular);
}
