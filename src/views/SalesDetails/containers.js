import { query } from 'store/fetch';

const initialState = {
  fetching: false,
  data: [],
  total: 0,
};

// 常量
export const RECEIVE_SALEDETAIL_INIT = 'RECEIVE_SALEDETAIL_INIT';
export const RECEIVE_SALEDETAIL_ERRORS = 'RECEIVE_SALEDETAIL_ERRORS';
export const RECEIVE_SALEDETAIL = 'RECEIVE_SALEDETAIL';
export const RECEIVE_SALE_DETAIL_SUMMARY = 'RECEIVE_SALE_DETAIL_SUMMARY';

// 销售明细初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_SALEDETAIL_INIT,
    payload: {
      fetching: true,
      data: [],
      total: 0,
    },
  };
}

// 销售明细初始化请求错误
export function receiveError() {
  return {
    type: RECEIVE_SALEDETAIL_ERRORS,
    payload: {
      fetching: false,
      data: [],
    },
  };
}

// 接收销售明细
export function receiveSaleDetail(data) {
  return {
    type: RECEIVE_SALEDETAIL,
    payload: {
      fetching: false,
      ...data,
    },
  };
}
export function receiveSaleDetailSummary(data) {
  return {
    type: RECEIVE_SALE_DETAIL_SUMMARY,
    payload: {
      summary: data,
    },
  };
}

// 销售明细查询
export function getSaleDetail(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/reports/paging-sales', param).then((data) => {
      dispatch(receiveSaleDetail(data));
    }, () => {
      dispatch(receiveError());
    });
  };
}
export function getSaleDetailSummary(param) {
  return (dispatch) => {
    query('/api/impala/reports/sales-statistics', param).then((data) => {
      dispatch(receiveSaleDetailSummary(data));
    });
  };
}

export default function saleReportReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_SALEDETAIL_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_SALEDETAIL_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_SALEDETAIL:
      return Object.assign({}, state, action.payload);
    case RECEIVE_SALE_DETAIL_SUMMARY:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
