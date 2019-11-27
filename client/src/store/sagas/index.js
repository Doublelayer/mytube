import { all, put, fork } from 'redux-saga/effects';
import { watchMostPopularVideos } from './video';
import { watchVideoDetails } from './watch';

export default function*() {
  yield all([fork(watchMostPopularVideos), fork(watchVideoDetails)]);
}

export function* fetchEntity(endpoint, entity, ...args) {
  try {
    const json = yield fetch(endpoint)
      .then(response => response.json())
      .then(myJson => myJson);

    yield put(entity.success(json, ...args));
  } catch (error) {
    yield put(entity.failure(error, ...args));
  }
}
