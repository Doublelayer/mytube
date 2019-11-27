import { MOST_POPULAR } from '../actions/video';
import { SUCCESS } from '../actions';
import { WATCH_DETAILS } from '../actions/watch';

import { createSelector } from 'reselect';

const initialState = {
  byId: {},
  mostPopular: {}
};

export default function videos(state = initialState, action) {
  console.log(action.type);

  switch (action.type) {
    case MOST_POPULAR[SUCCESS]:
      return reduceFetchAllVideos(action.response.videos, state);
    case WATCH_DETAILS[SUCCESS]:
      return reduceWatchDetails(action.response, state);
    default:
      return state;
  }
}

function reduceFetchAllVideos(videos, prevState) {
  const videoMap = videos.docs.reduce((accumulator, video) => {
    accumulator[video._id] = video;
    return accumulator;
  }, {});

  let items = Object.keys(videoMap);

  const allVideos = {
    totalResults: videos.info.totalResults,
    items: items
  };

  return {
    ...prevState,
    allVideos,
    byId: { ...prevState.byId, ...videoMap }
  };
}

function reduceWatchDetails(responses, prevState) {
  let byIdEntry = {};
  if (responses[0]) {
    const video = responses[0];
    byIdEntry = { [video._id]: video };
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
  state => state.videos.allVideos,
  (videosById, allVideos) => {
    if (!allVideos || !allVideos.items) {
      return [];
    }

    return allVideos.items.map(videoId => videosById[videoId]);
  }
);

export const getWatchVideo = (state, videoId) => {
  return state.videos.byId[videoId];
};

export const getVideoById = (state, videoId) => {
  return state.videos.byId[videoId];
};
