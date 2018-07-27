import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'userManagment',
  breadcrumbName: '用户信息',
  // 当路由匹配时,异步获取组件
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./UserManagement').default;
      const reducer = require('./containers').default;

      // 动态注入 goods reducer
      injectReducer(store, { key: 'userManagement', reducer });
      cb(null, component);
    }, 'userManagement'); // webpack 代码分割后的文件名称  billingT 对应的是jsx 页面的定义需要一致
  },
});
