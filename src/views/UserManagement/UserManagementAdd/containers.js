import { query, post } from 'store/fetch';

const initialState = {
  fetching: false,
  data: [],
  areaTreeData:[],
  roleData:[],
  initAllData:[],
  permissions: [],
  total: 0,
};

// 常量 
export const RECEIVE_USERMANAGEMENTADD_INIT = 'RECEIVE_USERMANAGEMENTADD_INIT';
export const RECEIVE_USERMANAGEMENTADD_ERRORS = 'RECEIVE_USERMANAGEMENTADD_ERRORS';
export const RECEIVE_USERMANAGEMENTADD = 'RECEIVE_USERMANAGEMENTADD';
export const RECEIVE_PERMISSION_ERRORS = 'RECEIVE_PERMISSION_ERRORS';


// 初始化
export function receiveInit() {
  return {
    type: RECEIVE_USERMANAGEMENTADD_INIT,
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
    type: RECEIVE_USERMANAGEMENTADD,
    payload: {
      fetching: false,
      ...data,
    },
  };
}



// 树数据初始化获取
export function findAreaTree() {
  return (dispatch) => {
    dispatch(receiveInit());
    post('/api/resourceInfo/areaTree',{}).then((areaTreeData) => {
      dispatch(receiveTreeBusiness(areaTreeData));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

// 树的赋值
export function receiveTreeBusiness(areaTreeData) {
  return {
    type: RECEIVE_USERMANAGEMENTADD,
    payload: {
      fetching: false,
      areaTreeData,
    },
  };
}

// 初始化获取角色数据
export function findRoleData() {
  return (dispatch) => {
    dispatch(receiveInit());
    post('/api/bvsRole/bvsRoleList',{}).then((roleData) => {
      dispatch(receiveRoleBusiness(roleData));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}
// 装载角色数据
export function receiveRoleBusiness(roleData) {
  return {
    type: RECEIVE_USERMANAGEMENTADD,
    payload: {
      fetching: false,
      roleData,
    },
  };
}

//初始化查询用户的所有数据
export function queryUserIdsData(userId) {
  return (dispatch) => {
    dispatch(receiveInit());
    return query('/api/userInfo/findFormById', {userId}).then((initAllData) => {
      dispatch(receiveUserIdsBusiness(initAllData));
      return Promise.resolve(initAllData);
    }, () => {
      dispatch(receiveErrors());
      return Promise.reject(initAllData);
    });
  };
}
// export function findUserIdsData(userId) {  
//   return (dispatch) => {
//     dispatch(receiveInit());
//     console.log('js请求前：',userId);
//     post('/api/userInfo/findFormById',{userId}).then((initAllData) => {
//       console.log('js请求后：',initAllData);
//       dispatch(receiveUserIdsBusiness(initAllData));
//     }, () => {
//       dispatch(receiveErrors());
//     });
//   };
// }
//装载初始化查询数据
export function receiveUserIdsBusiness(initAllData) {
  return {
    type: RECEIVE_USERMANAGEMENTADD,
    payload: {
      fetching: false,
      initAllData,
    },
  };
}

// 更新用户
export function saveUserInfo(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    return post('/api/userInfo/saveUserInfo', param).then((data) => {
      dispatch(receiveBusiness(data));
      return Promise.resolve(data);
    }, () => {
      dispatch(receiveErrors());
      return Promise.reject(null);
    });
  };
}


// 获取表格查询数据--无用
export function queryUserManagementAdd(params) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('', params).then((data) => {
      dispatch(receiveBusiness(data));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

// 根据当前行获取值--无用
export function getRowID(displayName) {
  return (dispatch) => {
    dispatch(receiveInit());
    return query('', { displayName }).then((data) => {      
      dispatch(receiveErrors());
      return Promise.resolve(data);
    }, () => {
      dispatch(receiveErrors());
      return Promise.resolve(null);
    });
  };
}

// 添加用户--无用
export function setNewUser(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    return post('', param).then((data) => {
      dispatch(receiveErrors());
      //return Promise.resolve(data);
    }, () => {
      dispatch(receiveErrors());
      //return Promise.reject(null);
    });
  };
}

// reducer
export default function userManagementAddReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_USERMANAGEMENTADD_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_USERMANAGEMENTADD_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_USERMANAGEMENTADD:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

