import { fork, take } from 'redux-saga/effects';
import * as adminActions from '../actions/admin';
import { DIRECTORY_TREE, STORED_DIRECTORIES, REFRESH_TREE, UPDATE_DATABASE } from '../../services/url/api-endpoints';
import { REQUEST } from '../actions';
import { post, get } from './index';

export function* getDirectoryTree() {
  while (true) {
    const { rootPath, filter } = yield take(adminActions.DIRECTORY_TREE[REQUEST]);
    const params = {
      rootPath: rootPath,
      filter: filter,
    };
    yield fork(fetchDirectoryTree, params);
  }
}

export function* fetchDirectoryTree(params) {
  yield post(`${DIRECTORY_TREE}`, 'POST', params, adminActions.directoryTree);
}

export function* getStoredDirectories() {
  while (true) {
    yield take(adminActions.STORED_DIRECTORIES[REQUEST]);
    yield fork(fetchStoredDirectories);
  }
}

export function* fetchStoredDirectories() {
  yield get(`${STORED_DIRECTORIES}`, 'GET', adminActions.storedDirectories);
}

export function* findTree() {
  while (true) {
    const { rootPath, filter } = yield take(adminActions.FIND_TREE[REQUEST]);
    const params = {
      rootPath: rootPath,
      filter: filter,
    };
    yield fork(fetchTree, params);
  }
}

export function* fetchTree(params) {
  yield post(`${REFRESH_TREE}`, 'POST', params, adminActions.findTree);
}

export function* updateDatabase() {
  while (true) {
    const { files, id } = yield take(adminActions.UPDATE_DATABASE[REQUEST]);
    const params = {
      files: files,
      id: id,
    };
    yield fork(fetUpdateDatabase, params);
  }
}

export function* fetUpdateDatabase(params) {
  yield post(`${UPDATE_DATABASE}`, 'POST', params, adminActions.updateDatabase);
}
