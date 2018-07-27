import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'login',
  // 当路由匹配时,异步获取组件
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./Login').default;
      const reducer = require('./containers').default;

      // 动态注入 goods reducer
      injectReducer(store, { key: 'user', reducer });
      cb(null, component);
    }, 'login'); // webpack 代码分割后的文件名称
  },
});
