import { query, post } from 'store/fetch';

const initialState = {
  fetching: false,
  data: [],
  total:0,
};
// 定义常量
export const RECEIVE_BVSROLE_INIT = 'RECEIVE_BVSROLE_INIT';
export const RECEIVE_BVSROLE_ERRORS = 'RECEIVE_BVSROLE_ERRORS';
export const RECEIVE_BVSROLE = 'RECEIVE_BVSROLE';
export const RECEIVE_BVSROLE_CREATE = 'RECEIVE_BVSROLE_CREATE';


// 始化请求
export function receiveInit() {
  return {
    type: RECEIVE_BVSROLE_INIT,
    payload: {
      fetching: true,
      data: [],
      total:0,
    },
  };
}
// 请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_BVSROLE_ERRORS,
    payload: {
      fetching: false,
      data: [],
      total:0,
    },
  };
}
// 获取数据权限
export function receiveBvsRoles(data) {
  return {
    type: RECEIVE_BVSROLE,
    payload: {
      fetching: false,
      ...data,
    },
  };
}
// 查询用户角色
export function getRoles(params) {
  return (dispatch) => {
    dispatch(receiveInit());
    return post('/api/bvsRole/bvsRoleListPage', params==undefined?{}:params).then((data) => {
      dispatch(receiveBvsRoles(data));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}
// 新增角色
export function addRole(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    return post('/api/bvsRole/createBvsRole', param).then((data) => {
      dispatch(receiveErrors());
      return Promise.resolve(data);
    }, () => {
      dispatch(receiveErrors());
      return Promise.reject(null);
    });
  };
}
export default function bvsRolesReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_BVSROLE_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BVSROLE_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BVSROLE:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
