import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import makeRootReducer from './reducers';
import { updateLocation } from './location';

export default (initialState = {}) => {
  // 中间件列表
  const middleware = [thunk];
  // store 插件
  const enhancers = [];
  // if (__DEV__) {
  //   // 添加 reduxtool 工具
  //   enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
  // }
  // 创建 store ps: redux 3.x 后才支持 最后参数为 enhancers
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers));

  // 动态 reducer
  store.asyncReducers = {};

  // 添加路由监听事件 添加到 store方便取消
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store));

  // 开启 store 的热部署
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers.asyncReducers);
    });
  }

  return store;
};
