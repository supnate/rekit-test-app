import React from 'react';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { RedditListPage } from 'src/features/home/RedditListPage';

describe('home/RedditListPage', () => {
  it('renders node with correct class name', () => {
    const props = {
      home: {},
      actions: {},
    };
    const renderedComponent = shallow(
      <RedditListPage {...props} />
    );

    expect(
      renderedComponent.find('.home-reddit-list-page').node
    ).to.exist;
  });
});
