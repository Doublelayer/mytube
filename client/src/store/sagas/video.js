import { fork, take } from 'redux-saga/effects';
import * as videoActions from '../actions/video';
import { LIST_VIDEO } from '../../services/url/api-endpoints';
import { REQUEST } from '../actions';
import { post } from './index';

export function* watchMostPopularVideos() {
  while (true) {
    const { nextPage, limit, projection } = yield take(videoActions.MOST_POPULAR[REQUEST]);
    const params = {
      nextPage: nextPage,
      limit: limit,
      projection: projection
    }
    yield fork(fetchMostPopular, params, projection);
  }
}

export function* fetchMostPopular(params) {
  yield post(`${LIST_VIDEO}`, "POST", params, videoActions.mostPopular);
}
