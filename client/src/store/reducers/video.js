import { MOST_POPULAR } from '../actions/video';
import { SUCCESS, REQUEST } from '../actions';
import { WATCH_DETAILS, SAME_FOLDER } from '../actions/watch';

import { createSelector } from 'reselect';

const initialState = {
  byId: {},
  byCategory: {
    mostPopular: {
      items: [],
    },
  },
  isFetching: false,
  watch: {
    now: [],
    related: [],
  },
};

export default function videos(state = initialState, action) {
  switch (action.type) {
    case MOST_POPULAR[REQUEST]:
      return { ...state, isFetching: true };
    case MOST_POPULAR[SUCCESS]:
      return reduceVideoList(action.response, state);
    case WATCH_DETAILS[SUCCESS]:
      return reduceWatchDetails(action.response, state);
    case SAME_FOLDER[SUCCESS]:
      return reduceSameFolder(action.response, state);
    case 'NOW':
      return reduceWatchNow(action, state);
    default:
      return state;
  }
}

function reduceWatchNow(action, prevState) {
  return { ...prevState, watch: { related: [], now: action.videoId } };
}

function reduceSameFolder(response, prevState) {
  const videoMap = getVideoMap(response);
  delete videoMap[prevState.watch.now];
  return {
    ...prevState,
    byId: { ...prevState.byId, ...videoMap },
    watch: { now: prevState.watch.now, related: Object.keys(videoMap) },
  };
}

function reduceVideoList(response, prevState) {
  const videoMap = getVideoMap(response.docs);

  delete response['docs'];
  let items = Object.keys(videoMap);

  items = [...prevState.byCategory.mostPopular.items, ...items];

  const mostPopular = {
    items,
  };

  return {
    ...prevState,
    byCategory: { mostPopular },
    byId: { ...prevState.byId, ...videoMap },
    isFetching: false,
    ...response,
  };
}

function reduceWatchDetails(response, prevState) {
  return {
    ...prevState,
    byId: { [response._id]: response },
    watch: { now: response._id, related: [] },
  };
}

function getVideoMap(response) {
  return response.reduce((accumulator, video) => {
    accumulator[video._id] = video;
    return accumulator;
  }, {});
}

/*
 *   Selectors
 * */
export const getRelatedVideos = createSelector(
  (state) => state.videos.byId,
  (state) => state.videos.watch.related,
  (byIds, related) => {
    if (!byIds) {
      return [];
    }
    return related.map((id) => byIds[id]);
  }
);

// (state) => {
//   return state.videos.byId[state.videos.watch.related];
// };

export const getNextVideosFromStore = createSelector(
  (state) => state.videos.byId,
  (state) => state.videos.byCategory.mostPopular,
  (videosById, mostPopular) => {
    if (!mostPopular || !mostPopular.items) {
      return [];
    }

    return mostPopular.items.map((videoId) => videosById[videoId]);
  }
);

export const getWatchVideo = (state, videoId) => {
  return state.videos.byId[videoId];
};

export const getVideoById = (state, videoId) => {
  return state.videos.byId[videoId];
};

export const getNextPage = (state) => {
  return state.videos.nextPage || 1;
};

export const getActualPage = (state) => {
  return state.videos.page || 1;
};

export const getLimit = () => {
  return 40;
};

export const getIsVideoFetching = (state) => {
  return state.videos.isFetching;
};

export const getTotalPages = (state) => {
  return state.videos.totalPages;
};
