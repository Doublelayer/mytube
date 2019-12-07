import { createAction, createRequestTypes, REQUEST, SUCCESS, FAILURE } from './index';

export const MOST_POPULAR = createRequestTypes('MOST_POPULAR');

export const mostPopular = {
  request: (skip, limit) => createAction(MOST_POPULAR[REQUEST], { skip, limit }),
  success: response => createAction(MOST_POPULAR[SUCCESS], { response }),
  failure: response => createAction(MOST_POPULAR[FAILURE], { response })
};
