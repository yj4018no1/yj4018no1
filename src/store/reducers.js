import {
  combineReducers,
} from 'redux';
import locationReducer from './location';
// import tagsReducer from './tags';
// import homeReducer from './home';
import zfirstReducer from 'views/ZFirst/containers';

export const makeRooterReducer = asyncReducers =>
  combineReducers({
    location: locationReducer,
    // tags: tagsReducer,
    // home: homeReducer,
    zfirstreducer: zfirstReducer,
    ...asyncReducers,
  });

// 用于实现异步注入 reducer (代码分割)
export const injectReducer = (store, {
  key,
  reducer,
}) => {
  // 将异步注入的 reducer 存在 asyncReducers 对象上
  store.asyncReducers[key] = reducer;
  // 更新 store
  store.replaceReducer(makeRooterReducer(store.asyncReducers));
};

export default makeRooterReducer;
