import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'ZFirst',
  breadcrumbName: '首页',
  getComponent(nextState, cd) {
    require.ensure([], (require) => {
      const component = require('./ZFirst').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'zfirstreducer', reducer });
      cd(null, component);
    }, 'zfirstcomponent');
  },
});

// import ZFirst from './ZFirst';

// export default {
//   component: ZFirst,
// };
