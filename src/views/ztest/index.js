import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'ztest/index',
  breadcrumbName: '测试',
  // 当路由匹配时,异步获取组件
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./ztest').default;
      const reducer = require('./containers').default;

      // 动态注入 ztest reducer
      injectReducer(store, { key: 'ztest', reducer });
      cb(null, component);
    }, 'ztest');
  },
});
