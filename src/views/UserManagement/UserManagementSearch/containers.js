import { query, post } from 'store/fetch';

const initialState = {
  fetching: false,
  data: [],
  permissions: [],
  total: 0,
};

// 常量 UserManagement  USERMANAGEMENT
export const RECEIVE_USERMANAGEMENT_INIT = 'RECEIVE_USERMANAGEMENT_INIT';
export const RECEIVE_USERMANAGEMENT_ERRORS = 'RECEIVE_USERMANAGEMENT_ERRORS';
export const RECEIVE_USERMANAGEMENT = 'RECEIVE_USERMANAGEMENT';
export const RECEIVE_PERMISSION_ERRORS = 'RECEIVE_PERMISSION_ERRORS';

// 初始化
export function receiveInit() {
  return {
    type: RECEIVE_USERMANAGEMENT_INIT,
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

// 查询action
export function receiveBusiness(data) {
  return {
    type: RECEIVE_USERMANAGEMENT,
    payload: {
      fetching: false,
      ...data,
    },
  };
}
// 获取表格查询数据
export function postUserManagement(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    post('/api/userInfo/userInfoListPage', param).then((data) => {
      dispatch(receiveBusiness(data));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

// 根据当前行获取值
export function getRowID(displayName) {
  return (dispatch) => {
    dispatch(receiveInit());
    return query('/api/users/paging-user', { displayName }).then((data) => {
      console.log('我来找id：',data);      
      dispatch(receiveErrors());
      return Promise.resolve(data);
    }, () => {
      dispatch(receiveErrors());
      return Promise.resolve(null);
    });
  };
}

// 添加用户
export function setNewUser(param) {
  // param = {
  //   displayName:'11',
  //   nickname:'22',
  //   branchCodes:null
  // }
  return (dispatch) => {
    dispatch(receiveInit());
      return post('/api/userInfo/createUserInfo', param).then((data) => {
     
      dispatch(receiveErrors());
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

// reducer
export default function userManagementReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_USERMANAGEMENT_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_USERMANAGEMENT_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_USERMANAGEMENT:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

