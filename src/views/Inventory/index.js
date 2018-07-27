import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'inventory',
  breadcrumbName: '库存明细',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./Inventory').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'inventory', reducer });
      cb(null, component);
    }, 'inventory');
  },
});
