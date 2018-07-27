import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'billStatistics',
  breadcrumbName: '进货统计',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./BillStatistics').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'billStatistics', reducer });
      cb(null, component);
    }, 'billStatistics');
  },
});
