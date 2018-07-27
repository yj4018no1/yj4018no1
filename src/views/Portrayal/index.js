import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'portrayal',
  breadcrumbName: '经销商画像',
  getComponent(nextState, cd) {
    require.ensure([], (require) => {
      const component = require('./Portrayal').default;
      const reducer = require('./containers').default;
      injectReducer(store, { key: 'portrayal', reducer });
      cd(null, component);
    }, 'portrayal');
  },
});
