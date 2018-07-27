import { query, post } from 'store/fetch';

const initialState = {
  fetching: false,
  data: [],
  treeDate:[],
  bvsRole:[],
  checkTree:[],
};
// 定义常量
export const RECEIVE_ADDROLE_INIT = 'RECEIVE_ADDROLE_INIT';
export const RECEIVE_ADDROLE_ERRORS = 'RECEIVE_ADDROLE_ERRORS';
export const RECEIVE_ADDROLE = 'RECEIVE_ADDROLE';
export const RECEIVE_ADDROLE_CREATE = 'RECEIVE_ADDROLE_CREATE';


// 始化请求
export function receiveInit() {
  return {
    type: RECEIVE_ADDROLE_INIT,
    payload: {
      fetching: true,
    },
  };
}

// 请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_ADDROLE_ERRORS,
    payload: {
      fetching: false,
    },
  };
}

// 获取数据权限
export function receiveAddroles({data,bvsRole,checkTree}) {
  return {
    type: RECEIVE_ADDROLE,
    payload: {
      fetching: false,
      ...data,
      bvsRole,
      checkTree,
    },
  };
}

// 赋值资源树数据
export function receiveResourceTree(treeDate) {
  return {
    type: RECEIVE_ADDROLE,
    payload: {
      fetching: false,
      treeDate,
    },
  };
}

// 新增角色
export function createRole(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    return post('/api/bvsRole/saveBvsRole', param).then((data) => {
      dispatch(receiveAddroles({data}));
      return Promise.resolve(data);
    }, () => {
      dispatch(receiveErrors());
      return Promise.reject(null);
    });
  };
}

// 查询资源
export function findResource() {
  return (dispatch) => {
    dispatch(receiveInit());
    post('/api/resourceInfo/resourceTree',{}).then((data) => {
      dispatch(receiveResourceTree(data));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

// 根据角色ID查询角色和资源
export function findById(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    return post('/api/bvsRole/findById',param).then((data) => {
      dispatch(receiveAddroles(data));
      return Promise.resolve(data);
    }, () => {
      dispatch(receiveErrors());
      return Promise.reject(null);
    });
  };
}
export default function AddrolesReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ADDROLE_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_ADDROLE_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_ADDROLE:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
