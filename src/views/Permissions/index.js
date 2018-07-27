import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'permissions',
  breadcrumbName: '角色管理',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./Permissions').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'permissions', reducer });
      cb(null, component);
    }, 'permissions');
  },
});
