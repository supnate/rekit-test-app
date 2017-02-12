import {
  DefaultPage,
  TestPage,
  RedditListPage,
} from './';

export default {
  path: '',
  name: 'Home',
  childRoutes: [
    { path: 'default-page', name: 'Default page', component: DefaultPage, isIndex: true },
    { path: 'test-page', name: 'Test page', component: TestPage },
    { path: 'reddit-list', name: 'Reddit list page', component: RedditListPage },
  ],
};
