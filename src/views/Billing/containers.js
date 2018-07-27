import { query } from 'store/fetch';

const initialState = {
  fetching: false,
  data: [],
  total: 0,
};

// 常量
export const RECEIVE_BILLING_INIT = 'RECEIVE_BILLING_INIT';
export const RECEIVE_BILLING_ERRORS = 'RECEIVE_BILLING_ERRORS';
export const RECEIVE_BILLING = 'RECEIVE_BILLING';
// 定义分中心常量
export const RECEIVE_BILLINGBRANCH_INIT = 'RECEIVE_BILLINGBRANCH_INIT';
export const RECEIVE_BILLINGBRANCH_ERRORS = 'RECEIVE_BILLINGBRANCH_ERRORS';
export const RECEIVE_BILLINGBRANCH = 'RECEIVE_BILLINGBRANCH';

// 初始化
export function receiveInit() {
  return {
    type: RECEIVE_BILLING_INIT,
    payload: {
      fetching: true,
    },
  };
}
// 错误停止
export function receiveError() {
  return {
    type: RECEIVE_BILLING_ERRORS,
    payload: {
      fetching: false,
      data: [],
      total: 0,
    },
  };
}

// 查询action
export function receiveBusiness(data) {
  return {
    type: RECEIVE_BILLING,
    payload: {
      fetching: false,
      ...data,
    },
  };
}
// 获取表格查询数据
export function queryBilling(params) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/reports/paging-merchants', params).then((data) => {
      dispatch(receiveBusiness(data));
    }, () => {
      dispatch(receiveError());
    });
  };
}
// reducer
export default function billingReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_BILLING_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BILLING_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BILLING:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}

