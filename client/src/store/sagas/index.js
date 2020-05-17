import { all, put, fork } from 'redux-saga/effects';
import { watchMostPopularVideos } from './video';
import { watchVideoDetails, fetchSameFolder, sameFolder } from './watch';

export default function* () {
  yield all([fork(watchMostPopularVideos), fork(watchVideoDetails), fork(sameFolder)]);
}

export function* post(endpoint, method, params, action, ...args) {
  console.log('sadflkjjaslk');
  try {
    const json = yield fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: method,
      body: JSON.stringify(params),
    }).then((response) => response.json());

    yield put(action.success(json, ...args));
  } catch (error) {
    console.log(error);
    yield put(action.failure(error, ...args));
  }
}

export function* get(endpoint, method, action, ...args) {
  try {
    const json = yield fetch(endpoint, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: method,
    }).then((response) => response.json());

    yield put(action.success(json, ...args));
  } catch (error) {
    console.log(error);
    yield put(action.failure(error, ...args));
  }
}
