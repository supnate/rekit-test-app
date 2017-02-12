import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RedditList } from './';
import * as actions from './redux/actions';

export class RedditListPage extends Component {
  static propTypes = {
    home: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.actions.fetchRedditListBySaga();
  }

  render() {
    const { home } = this.props;
    let content = 'Loading...';
    if (home.fetchRedditListBySagaPending) content = 'Loading...';
    else if (home.fetchRedditListBySagaError) content = home.fetchRedditListBySagaError.message || String(home.fetchRedditListBySagaError);
    else if (home.redditReactjsListBySaga) content = <RedditList list={home.redditReactjsListBySaga} />;
    return (
      <div className="home-reddit-list-page">
        {content}
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    home: state.home,
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({ ...actions }, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RedditListPage);
