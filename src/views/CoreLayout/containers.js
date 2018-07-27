import { post } from 'store/fetch';
import { delSession, getSession } from 'store/requireAuth';
// import { emptyAction } from 'views/login/containers';

const initialState = {
  fetching: false,
  error: false,
  data: null,
};


// 常量
export const RECEIVE_LOGOUT_INIT = 'RECEIVE_LOGOUT_INIT';
export const RECEIVE_LOGOUT_ERRORS = 'RECEIVE_LOGOUT_ERRORS';
export const RECEIVE_LOGOUT = 'RECEIVE_LOGOUT';

// 初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_LOGOUT_INIT,
    payload: {
      fetching: true,
    },
  };
}
// 初始化请求
export function receiveErrors() {
  return {
    type: RECEIVE_LOGOUT_ERRORS,
    payload: {
      fetching: false,
      error: true,
    },
  };
}
// 登出成功
export function receiveLogout() {
  return {
    type: RECEIVE_LOGOUT,
    payload: {
      fetching: false,
      error: false,
    },
  };
}
// 用户退出登录
export function logoutAction() {
  return (dispatch) => {
    dispatch(receiveInit());
    post('/api/users/logout').then(() => {
      dispatch(receiveLogout());
      // dispatch(emptyAction());
      delSession('bvs');
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

// reducers
export default function logoutReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_LOGOUT_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_LOGOUT_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_LOGOUT:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
