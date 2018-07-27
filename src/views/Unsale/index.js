import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'unsale',
  breadcrumbName: '滞销分析',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./Unsale').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'unsale', reducer });
      cb(null, component);
    }, 'unsale');
  },
});
