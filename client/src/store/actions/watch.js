import { createAction, createRequestTypes, FAILURE, REQUEST, SUCCESS } from './index';

export const WATCH_DETAILS = createRequestTypes('WATCH_DETAILS');

export const details = {
  request: videoId => createAction(WATCH_DETAILS[REQUEST], { videoId }),
  success: (response, videoId) => createAction(WATCH_DETAILS[SUCCESS], { response, videoId }),
  failure: response => createAction(WATCH_DETAILS[FAILURE], { response })
};

export const VIEW_COUNT = createRequestTypes('VIEW_COUNT');

export const viewCount = {
  request: videoId => createAction(VIEW_COUNT[REQUEST], { videoId }),
  success: response => createAction(VIEW_COUNT[SUCCESS], { response }),
  failure: response => createAction(VIEW_COUNT[FAILURE], { response })
};
