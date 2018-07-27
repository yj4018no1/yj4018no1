import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'salereport',
  breadcrumbName: '销售统计报表',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./SaleReport').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'salereport', reducer });
      cb(null, component);
    }, 'salereport');
  },
});
