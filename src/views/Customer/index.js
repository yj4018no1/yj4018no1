import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'customer',
  breadcrumbName: '客户档案关系',
  // 当路由匹配时,异步获取组件
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./Customer').default;
      const reducer = require('./containers').default;

      // 动态注入 goods reducer
      injectReducer(store, { key: 'customer', reducer });
      cb(null, component);
    }, 'customer'); // webpack 代码分割后的文件名称
  },
});
