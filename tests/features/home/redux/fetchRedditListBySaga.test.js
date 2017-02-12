import { delay } from 'redux-saga';
import { call, put } from 'redux-saga/effects';
import nock from 'nock';
import { expect } from 'chai';

import {
  HOME_FETCH_REDDIT_LIST_BY_SAGA_BEGIN,
  HOME_FETCH_REDDIT_LIST_BY_SAGA_SUCCESS,
  HOME_FETCH_REDDIT_LIST_BY_SAGA_FAILURE,
  HOME_FETCH_REDDIT_LIST_BY_SAGA_DISMISS_ERROR,
} from 'src/features/home/redux/constants';

import {
  fetchRedditListBySaga,
  dismissFetchRedditListBySagaError,
  doFetchRedditListBySaga,
  reducer,
} from 'src/features/home/redux/fetchRedditListBySaga';

describe('home/redux/fetchRedditListBySaga', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  // redux action tests
  it('correct action by fetchRedditListBySaga', () => {
    expect(fetchRedditListBySaga()).to.have.property('type', HOME_FETCH_REDDIT_LIST_BY_SAGA_BEGIN);
  });

  it('returns correct action by dismissFetchRedditListBySagaError', () => {
    expect(dismissFetchRedditListBySagaError()).to.have.property('type', HOME_FETCH_REDDIT_LIST_BY_SAGA_DISMISS_ERROR);
  });

  // saga tests
  const generator = doFetchRedditListBySaga();

  it('calls delay when receives a begin action', () => {
    // Delay is just a sample, this should be replaced by real sync request.
    expect(generator.next().value).to.deep.equal(call(delay, 20));
  });

  it('dispatches HOME_FETCH_REDDIT_LIST_BY_SAGA_SUCCESS action when succeeded', () => {
    expect(generator.next('something').value).to.deep.equal(put({
      type: HOME_FETCH_REDDIT_LIST_BY_SAGA_SUCCESS,
      data: 'something',
    }));
  });

  it('dispatches HOME_FETCH_REDDIT_LIST_BY_SAGA_FAILURE action when failed', () => {
    const generatorForError = doFetchRedditListBySaga();
    generatorForError.next(); // call delay(20)
    const err = new Error('errored');
    expect(generatorForError.throw(err).value).to.deep.equal(put({
      type: HOME_FETCH_REDDIT_LIST_BY_SAGA_FAILURE,
      error: err,
    }));
  });

  it('returns done when finished', () => {
    expect(generator.next()).to.deep.equal({ done: true, value: undefined });
  });

  // reducer tests
  it('handles action type HOME_FETCH_REDDIT_LIST_BY_SAGA_BEGIN correctly', () => {
    const prevState = { fetchRedditListBySagaPending: false };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_LIST_BY_SAGA_BEGIN }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchRedditListBySagaPending).to.be.true;
  });

  it('handles action type HOME_FETCH_REDDIT_LIST_BY_SAGA_SUCCESS correctly', () => {
    const prevState = { fetchRedditListBySagaPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_LIST_BY_SAGA_SUCCESS, data: {} }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchRedditListBySagaPending).to.be.false;
  });

  it('handles action type HOME_FETCH_REDDIT_LIST_BY_SAGA_FAILURE correctly', () => {
    const prevState = { fetchRedditListBySagaPending: true };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_LIST_BY_SAGA_FAILURE, data: { error: new Error('some error') } }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchRedditListBySagaPending).to.be.false;
    expect(state.fetchRedditListBySagaError).to.exist;
  });

  it('handles action type HOME_FETCH_REDDIT_LIST_BY_SAGA_DISMISS_ERROR correctly', () => {
    const prevState = { fetchRedditListBySagaError: new Error('some error') };
    const state = reducer(
      prevState,
      { type: HOME_FETCH_REDDIT_LIST_BY_SAGA_DISMISS_ERROR }
    );
    expect(state).to.not.equal(prevState); // should be immutable
    expect(state.fetchRedditListBySagaError).to.be.null;
  });
});