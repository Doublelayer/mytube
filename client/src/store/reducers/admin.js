import { DIRECTORY_TREE, STORED_DIRECTORIES, FIND_TREE } from '../actions/admin';
import { SUCCESS, REQUEST } from '../actions';

import { createSelector } from 'reselect';

const initialState = {
  isFetching: false,
};

export default function videos(state = initialState, action) {
  switch (action.type) {
    case DIRECTORY_TREE[REQUEST]:
      return { ...state, isFetching: true };
    case DIRECTORY_TREE[SUCCESS]:
      return reduceDirectoryTree(action.response, state);
    case STORED_DIRECTORIES[REQUEST]:
      return { ...state, isFetching: true };
    case STORED_DIRECTORIES[SUCCESS]:
      return reduceDirectoryTree(action.response, state);
    case FIND_TREE[REQUEST]:
      return { ...state, isFetching: true };
    case FIND_TREE[SUCCESS]:
      return reduceRefreshTree(action.response, state);
    default:
      return state;
  }
}

const reduceDirectoryTree = (response, prevState) => {
  const idMap = response.reduce((accumulator, tree) => {
    accumulator[tree._id] = tree;
    return accumulator;
  }, {});
  return { ...prevState, directories: { ...idMap, ...prevState.directories }, isFetching: false };
};

const reduceRefreshTree = (response, prevState) => {
  const directories = prevState.directories;

  response.map((newTree) => {
    return (directories[newTree._id] = newTree);
  });

  return {
    ...prevState,
    isFetching: false,
    directories: directories,
  };
};

/*
 *   Selectors
 *
 * */

export const isFetching = createSelector(
  (state) => state.config.isFetching,
  (isFetching) => {
    return isFetching;
  }
);

export const getAllStoredDirectoryTrees = createSelector(
  (state) => state.config.directories,
  (directories) => {
    if (!directories) {
      return [];
    }
    return directories || [];
  }
);

const extNames = ['mp4', 'flv', 'ogv', 'webm', 'mpg', 'avi', 'wmv', 'mov', 'mts', 'mkv', 'MOV'];
export const getVideoExtNames = createSelector(() => {
  return extNames.map((ext, key) => ({ key: key, text: ext.toUpperCase(), value: ext }));
});
