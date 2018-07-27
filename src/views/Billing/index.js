import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'billing',
  breadcrumbName: '客商主数据',
  // 当路由匹配时,异步获取组件
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./Billing').default;
      const reducer = require('./containers').default;

      // 动态注入 goods reducer
      injectReducer(store, { key: 'billing', reducer });
      cb(null, component);
    }, 'billing'); // webpack 代码分割后的文件名称
  },
});
