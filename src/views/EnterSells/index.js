import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'enterSells',
  breadcrumbName: '进销存报表',
  getComponent(nextState, cb) {
    require.ensure([], (require) => {
      const component = require('./EnterSells').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'enterSells', reducer });
      cb(null, component);
    }, 'enterSells');
  },
});
