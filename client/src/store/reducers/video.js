import { MOST_POPULAR } from '../actions/video';
import { SUCCESS, REQUEST } from '../actions';
import { WATCH_DETAILS } from '../actions/watch';

import { createSelector } from 'reselect';

const initialState = {
  byId: {},
  byCategory: {
    mostPopular: {
      items: []
    }
  },
  isFetching: false
};

export default function videos(state = initialState, action) {
  switch (action.type) {
    case MOST_POPULAR[REQUEST]:
      return { ...state, isFetching: true };
    case MOST_POPULAR[SUCCESS]:
      return reduceFetchMostPopular(action.response, state);
    case WATCH_DETAILS[SUCCESS]:
      return reduceWatchDetails(action.response, state);
    default:
      return state;
  }
}

function reduceFetchMostPopular(response, prevState) {
  const videoMap = response.docs.reduce((accumulator, video) => {
    accumulator[video._id] = video;
    return accumulator;
  }, {});

  let items = Object.keys(videoMap);

  items = [...prevState.byCategory.mostPopular.items, ...items];

  const mostPopular = {
    items
  };

  return {
    ...prevState,
    byCategory: { mostPopular },
    byId: { ...prevState.byId, ...videoMap },
    isFetching: false,
    nextSkip: prevState.byCategory.mostPopular.items.length + response.info.totalResults
  };
}

function reduceWatchDetails(response, prevState) {
  let byIdEntry = {};
  if (response) {
    byIdEntry = { [response._id]: response };
  }

  return {
    ...prevState,
    byId: {
      ...prevState.byId,
      ...byIdEntry
    }
  };
}

/*
 *   Selectors
 * */
export const getMostPopularVideos = createSelector(
  state => state.videos.byId,
  state => state.videos.byCategory.mostPopular,
  (videosById, mostPopular) => {
    if (!mostPopular || !mostPopular.items) {
      return [];
    }

    return mostPopular.items.map(videoId => videosById[videoId]);
  }
);

export const getWatchVideo = (state, videoId) => {
  return state.videos.byId[videoId];
};

export const getVideoById = (state, videoId) => {
  return state.videos.byId[videoId];
};

export const videosByCategoryLoaded = createSelector(
  state => state.videos.byCategory,
  categories => {
    return Object.keys(categories || {}).length !== 0;
  }
);

export const mostPopularVideosLoaded = createSelector(
  state => state.videos.byCategory.mostPopular.items,
  mostPopular => {
    return Object.keys(mostPopular || {}).length;
  }
);
