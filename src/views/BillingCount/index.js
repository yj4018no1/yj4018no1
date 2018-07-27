import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'billingCount',
  breadcrumbName: '提单统计',
  // 当路由匹配时,异步获取组件
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./BillingCount').default;
      const reducer = require('./containers').default;
      // 动态注入reducer
      injectReducer(store, { key: 'billingCount', reducer });
      cb(null, component);
    }, 'billingCount'); // webpack 代码分割后的文件名称
  },
});
