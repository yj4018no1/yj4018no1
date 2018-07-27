import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'billingDetail',
  breadcrumbName: '提单明细',
  // 当路由匹配时,异步获取组件
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./BillingDetail').default;
      const reducer = require('./containers').default;

      // 动态注入reducer
      injectReducer(store, { key: 'billingDetail', reducer });
      cb(null, component);
    }, 'billingDetail'); // webpack 代码分割后的文件名称
  },
});
