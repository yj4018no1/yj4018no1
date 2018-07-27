import { post, get } from 'store/fetch';
import { setSession, setMenu } from 'store/requireAuth';
import request from 'superagent';

const initialState = {
  fetching: false,
  error: false,
  data: {
    displayName: '请登录',
    menu: [],
    permissions: [],
  },
};

// 常量
export const RECEIVE_USER_INIT = 'RECEIVE_USER_INIT';
export const RECEIVE_USER_ERRORS = 'RECEIVE_USER_ERRORS';
export const RECEIVE_USER = 'RECEIVE_USER';
export const RECEIVE_USER_EMPTY = 'RECEIVE_USER_EMPTY';

// 初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_USER_INIT,
    payload: {
      fetching: true,
    },
  };
}
// 初始化请求
export function receiveErrors() {
  return {
    type: RECEIVE_USER_ERRORS,
    payload: {
      fetching: false,
      error: true,
    },
  };
}
// 登录成功
export function receiveUser(data) {
  return {
    type: RECEIVE_USER,
    payload: {
      fetching: false,
      error: false,
      data,
    },
  };
}
// 用户登录
export function loginAction(params, url) {
  return (dispatch) => {
    dispatch(receiveInit());
    post('/api/users/login', params).then((data) => {
      const { displayName, userPermissions,userPermissionsMenu } = data;
      const permissions = userPermissions.map(item => item.key);
      const user = {
        displayName,
        menu: userPermissionsMenu,// Mc add 20180329 菜单逻辑从后台获取
        permissions,
      };
      setSession('bvs', user, url);
      dispatch(receiveUser(user));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}
// 单点用户登录
export function pointAction(url) {
  return (dispatch) => {
    dispatch(receiveInit());
    request.get('/api/users/getUser').then((data) => {
      const { displayName, userPermissions,userPermissionsMenu } = data.body;
      const permissions = userPermissions.map(item => item.key);
      const user = {
        displayName,
        menu: userPermissionsMenu,// Mc add 20180329 菜单逻辑从后台获取
        permissions,
      };
      setSession('bvs', user, url);
      dispatch(receiveUser(user));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}
// 清空user
export function emptyAction() {
  return {
    type: RECEIVE_USER_EMPTY,
    payload: {
    },
  };
}

// reducers
export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_USER_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_USER_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_USER:
      return Object.assign({}, state, action.payload);
    case RECEIVE_USER_EMPTY:
      return Object.assign({}, state, initialState);
    default:
      return state;
  }
}
