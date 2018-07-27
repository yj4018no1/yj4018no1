import { query, post } from 'store/fetch';

const initialState = {
  fetching: false,
  data: [],
};

// 常量 ZTEST  ZTEST
export const RECEIVE_ZTEST_INIT = 'RECEIVE_ZTEST_INIT';
export const RECEIVE_ZTEST_ERRORS = 'RECEIVE_ZTEST_ERRORS';
export const RECEIVE_ZTEST = 'RECEIVE_ZTEST';
export const RECEIVE_PERMISSION_ERRORS = 'RECEIVE_PERMISSION_ERRORS';

// 初始化
export function receiveInit() {
  return {
    type: RECEIVE_ZTEST_INIT,
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
    type: RECEIVE_ZTEST,
    payload: {
      fetching: false,
      ...data,
    },
  };
}

// reducer
export default function ZTESTReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_ZTEST_INIT:
    case RECEIVE_ZTEST_ERRORS:
    case RECEIVE_ZTEST:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

