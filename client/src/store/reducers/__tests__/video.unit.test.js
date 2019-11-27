import videosReducer from '../../reducers/video';
import { MOST_POPULAR } from '../../actions/video';
import { SUCCESS } from '../../actions';
import allVideosResponse from './responses/ALL_VIDEOS.json';
import allVideoSuccessState from './states/ALL_VIDEOS_SUCCES.json';

const initialState = {
  byId: {},
  allVideos: {}
};

describe('videos reducer', () => {
  test('test undefined action type and initial state with videos reducer', () => {
    const expectedEndState = { ...initialState };
    expect(videosReducer(undefined, { type: 'some-unused-type' })).toEqual(expectedEndState);
  });

  test('test MOST_POPULAR_SUCCESS action in video reducer', () => {
    const startState = { ...initialState };
    const action = {
      type: MOST_POPULAR[SUCCESS],
      response: allVideosResponse
    };
    const expectedEndState = {
      ...startState,
      ...allVideoSuccessState
    };
    expect(videosReducer(startState, action)).toEqual(expectedEndState);
  });
});
