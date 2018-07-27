import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'saledetail',
  breadcrumbName: '销售明细报表',
  getComponent(nextState, cd) {
    require.ensure([], (require) => {
      const component = require('./SalesDetails').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'saledetail', reducer });
      cd(null, component);
    }, 'salesdetails');
  },
});
