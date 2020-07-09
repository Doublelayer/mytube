import { createAction, createRequestTypes, REQUEST, SUCCESS, FAILURE } from './index';

export const DIRECTORY_TREE = createRequestTypes('DIRECTORY_TREE');
export const STORED_DIRECTORIES = createRequestTypes('STORED_DIRECTORIES');
export const FIND_TREE = createRequestTypes('FIND_TREE');
export const UPDATE_DATABASE = createRequestTypes('UPDATE_DATABASE');

export const directoryTree = {
  request: (rootPath, filter) => createAction(DIRECTORY_TREE[REQUEST], { rootPath, filter }),
  success: (response) => createAction(DIRECTORY_TREE[SUCCESS], { response }),
  failure: (response) => createAction(DIRECTORY_TREE[FAILURE], { response }),
};

export const storedDirectories = {
  request: () => createAction(STORED_DIRECTORIES[REQUEST], {}),
  success: (response) => createAction(STORED_DIRECTORIES[SUCCESS], { response }),
  failure: (response) => createAction(STORED_DIRECTORIES[FAILURE], { response }),
};

export const findTree = {
  request: (rootPath, filter) => createAction(FIND_TREE[REQUEST], { rootPath, filter }),
  success: (response) => createAction(FIND_TREE[SUCCESS], { response }),
  failure: (response) => createAction(FIND_TREE[FAILURE], { response }),
};

export const updateDatabase = {
  request: (files, id) => createAction(UPDATE_DATABASE[REQUEST], { files, id }),
  success: (response) => createAction(UPDATE_DATABASE[SUCCESS], { response }),
  failure: (response) => createAction(UPDATE_DATABASE[FAILURE], { response }),
};
