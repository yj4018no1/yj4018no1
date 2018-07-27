import { query, post } from 'store/fetch';

const initialState = {
  fetching: false,
  bvsRoles: [],
  permissions: [],
};
// 定义常量
export const RECEIVE_PERMISSION_INIT = 'RECEIVE_PERMISSION_INIT';
export const RECEIVE_PERMISSION_ERRORS = 'RECEIVE_PERMISSION_ERRORS';
export const RECEIVE_PERMISSION = 'RECEIVE_PERMISSION';
export const RECEIVE_PERMISSION_CREATE = 'RECEIVE_PERMISSION_CREATE';


// 始化请求
export function receiveInit() {
  return {
    type: RECEIVE_PERMISSION_INIT,
    payload: {
      fetching: true,
    },
  };
}
// 请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_PERMISSION_ERRORS,
    payload: {
      fetching: false,
    },
  };
}
// 获取数据权限
export function receivePermissions({ bvsRoles, permissions }) {
  return {
    type: RECEIVE_PERMISSION,
    payload: {
      fetching: false,
      bvsRoles,
      permissions,
    },
  };
}


// 查询用户角色
export function getRoles() {
  return (dispatch) => {
    dispatch(receiveInit());
    post('/api/permissions/allPermissions', {}).then((data) => {
      dispatch(receivePermissions(data));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}
// 根据用户角色获取用户权限
export function getPermissionsByID(roleId) {
  return (dispatch) => {
    dispatch(receiveInit());
    return query('/api/permissions/rolePermissions', { roleId }).then((data) => {
      dispatch(receiveErrors());
      return Promise.resolve(data);
    }, () => {
      dispatch(receiveErrors());
      return Promise.reject(null);
    });
  };
}
// 设置用户角色权限
export function setRolePermissions(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    return post('/api/permissions/createPermission', param).then((data) => {
      dispatch(receiveErrors());
      return Promise.resolve(data);
    }, () => {
      dispatch(receiveErrors());
      return Promise.reject(null);
    });
  };
}
export default function permissionsReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_PERMISSION_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_PERMISSION_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_PERMISSION:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
