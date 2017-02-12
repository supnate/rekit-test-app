import axios from 'axios';
import { takeLatest } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import {
  HOME_FETCH_REDDIT_LIST_BY_SAGA_BEGIN,
  HOME_FETCH_REDDIT_LIST_BY_SAGA_SUCCESS,
  HOME_FETCH_REDDIT_LIST_BY_SAGA_FAILURE,
  HOME_FETCH_REDDIT_LIST_BY_SAGA_DISMISS_ERROR,
} from './constants';

export function fetchRedditListBySaga() {
  // If need to pass args to saga, pass it with the begin action.
  return {
    type: HOME_FETCH_REDDIT_LIST_BY_SAGA_BEGIN,
  };
}

export function dismissFetchRedditListBySagaError() {
  return {
    type: HOME_FETCH_REDDIT_LIST_BY_SAGA_DISMISS_ERROR,
  };
}

// worker Saga: will be fired on HOME_FETCH_REDDIT_LIST_BY_SAGA_BEGIN actions
export function* doFetchRedditListBySaga() {
  // If necessary, use argument to receive the begin action with parameters.
  let res;
  try {
    // Do Ajax call or other async request here. delay(20) is just a placeholder.
    res = yield call(axios.get, 'http://www.reddit.com/r/reactjs.json');
  } catch (err) {
    yield put({
      type: HOME_FETCH_REDDIT_LIST_BY_SAGA_FAILURE,
      data: { error: err },
    });
    return;
  }
  // Dispatch success action out of try/catch so that render errors are not catched.
  yield put({
    type: HOME_FETCH_REDDIT_LIST_BY_SAGA_SUCCESS,
    data: res.data,
  });
}

/*
  Alternatively you may use takeEvery.

  takeLatest does not allow concurrent requests. If an action gets
  dispatched while another is already pending, that pending one is cancelled
  and only the latest one will be run.
*/
export function* watchFetchRedditListBySaga() {
  yield takeLatest(HOME_FETCH_REDDIT_LIST_BY_SAGA_BEGIN, doFetchRedditListBySaga);
}

// Redux reducer
export function reducer(state, action) {
  switch (action.type) {
    case HOME_FETCH_REDDIT_LIST_BY_SAGA_BEGIN:
      return {
        ...state,
        fetchRedditListBySagaPending: true,
        fetchRedditListBySagaError: null,
      };

    case HOME_FETCH_REDDIT_LIST_BY_SAGA_SUCCESS:
      return {
        ...state,
        fetchRedditListBySagaPending: false,
        fetchRedditListBySagaError: null,
        redditReactjsListBySaga: action.data.data.children,
      };

    case HOME_FETCH_REDDIT_LIST_BY_SAGA_FAILURE:
      return {
        ...state,
        fetchRedditListBySagaPending: false,
        fetchRedditListBySagaError: action.data.error,
      };

    case HOME_FETCH_REDDIT_LIST_BY_SAGA_DISMISS_ERROR:
      return {
        ...state,
        fetchRedditListBySagaError: null,
      };

    default:
      return state;
  }
}
