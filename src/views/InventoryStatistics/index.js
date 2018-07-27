import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'inventoryStatistics',
  breadcrumbName: '库存统计',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./InventoryStatistics').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'inventoryStatistics', reducer });
      cb(null, component);
    }, 'inventoryStatistics');
  },
});
