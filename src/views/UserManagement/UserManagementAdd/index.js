import { injectReducer } from 'store/reducers';
//用户管理的权限添加
export default store => ({
  path: 'userManagmentAdd',
  breadcrumbName: '用户信息',
  // 当路由匹配时,异步获取组件
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./UserManagementAdd').default;
      const reducer = require('./containers').default;

      // 动态注入 goods reducer
      injectReducer(store, { key: 'userManagementAdd', reducer });
      cb(null, component);
    }, 'userManagementAdd'); // webpack 代码分割后的文件名称  billingT 对应的是jsx 页面的定义需要一致
  },
});
