import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'bvsRoles',
  breadcrumbName: '角色管理',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./BvsRoles').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'bvsRoles', reducer });
      cb(null, component);
    }, 'bvsRoles');
  },
});
