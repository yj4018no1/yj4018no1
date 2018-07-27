import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import moment from 'moment';
import 'moment/locale/zh-cn';
import createStore from './store/createStore';

moment.locale('zh-cn');

// 存储初始化的 store
const initialState = window.__INITIAL_STATE__;
const store = createStore(initialState);


const MOUNT_NODE = document.getElementById('root'); // 获取应用启动节点

function hashLinkScroll() {
  const { hash } = window.location;
  if (hash !== '') {
    // Push onto callback queue so it runs after the DOM is updated,
    // this is required when navigating from a different page so that
    // the element is rendered on the page before trying to getElementById.
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView();
    }, 0);
  }
}

// 启动函数
let render = () => {
  // 获取路由配置
  const routes = require('./views/index').default(store);
  ReactDOM.render(
    <Provider store={store}>
      <div style={{ height: '100%' }}>
        <Router history={browserHistory} routes={routes} onUpdate={hashLinkScroll} />
      </div>
    </Provider>,
    MOUNT_NODE);
};

// 开发环境配置: 生产下应该去掉
if (__DEV__ && module.hot) {
  const renderApp = render;
  // 调用 readbox 显示开发中的错误
  const renderError = (error) => {
    const RedBox = require('redbox-react').default;
    ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
  };

  render = () => {
    try {
      renderApp();
    } catch (error) {
      renderError(error);
    }
  };

  // 建立热部署
  module.hot.accept('./views/index', () => {
    setImmediate(() => {
      // 先卸载之前的应用
      ReactDOM.unmountComponentAtNode(MOUNT_NODE);
      render();
    });
  });
}

// 页面渲染
render();
