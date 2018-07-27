import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'addRole',
  breadcrumbName: '角色管理',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./AddRole').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'addRole', reducer });
      cb(null, component);
    }, 'addRole');
  },
});
