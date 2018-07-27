import { query } from 'store/fetch';

const initialState = {
  fetching: false,
  data: [],
  total: 0,
};

// 定义提单明细常量
export const RECEIVE_BILLDETAIL_INIT = 'RECEIVE_BILLDETAIL_INIT';
export const RECEIVE_BILLDETAIL_ERRORS = 'RECEIVE_BILLDETAIL_ERRORS';
export const RECEIVE_BILLDETAIL = 'RECEIVE_BILLDETAIL';
export const RECEIVE_BILL_DETAIL_SUMMARY = 'RECEIVE_BILL_DETAIL_SUMMARY';

// 提单明细初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_BILLDETAIL_INIT,
    payload: {
      fetching: true,
      data: [],
      total: 0,
    },
  };
}

// 提单明细初始化请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_BILLDETAIL_ERRORS,
    payload: {
      fetching: false,
      data: [],
      total: 0,
    },
  };
}

// 接受提单明细数据
export function receiveBillingDetail(data) {
  return {
    type: RECEIVE_BILLDETAIL,
    payload: {
      fetching: false,
      ...data,
    },
  };
}

export function receiveBillingDetailSummary(data) {
  return {
    type: RECEIVE_BILL_DETAIL_SUMMARY,
    payload: {
      summary: data,
    },
  };
}

// 提单明细查询
export function queryBillingDetail(params) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/deliverys/paging-deliverys', params).then((data) => {
      dispatch(receiveBillingDetail(data));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

export function queryBillingDetailSummary(params) {
  return (dispatch) => {
    query('/api/impala/deliverys/deliverys-summary', params).then((data) => {
      dispatch(receiveBillingDetailSummary(data));
    });
  };
}

// reducers
export default function billReportReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_BILLDETAIL_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BILLDETAIL_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BILLDETAIL:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BILL_DETAIL_SUMMARY:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
