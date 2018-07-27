import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'bestSell',
  breadcrumbName: '畅销分析',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./BestSell').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'bestSell', reducer });
      cb(null, component);
    }, 'bestSell');
  },
});
