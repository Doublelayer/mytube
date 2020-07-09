import { all, put, fork } from 'redux-saga/effects';
import { watchMostPopularVideos } from './video';
import { watchVideoDetails, sameFolder } from './watch';

import { getDirectoryTree, getStoredDirectories, findTree, updateDatabase } from './admin';

export default function* () {
  yield all([
    fork(watchMostPopularVideos),
    fork(watchVideoDetails),
    fork(sameFolder),
    fork(getDirectoryTree),
    fork(getStoredDirectories),
    fork(findTree),
    fork(updateDatabase),
  ]);
}

export function* post(endpoint, method, params, action, ...args) {
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
  console.log(endpoint, method, action);
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
