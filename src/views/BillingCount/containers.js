import { query } from 'store/fetch';
import { formatPrice, formatCount } from 'store/util';

const initialState = {
  fetching: false,
  column: [],
  result: {
    data: [],
    total: 0,
  },
  summary: {},
};

// 定义提单明细常量
export const RECEIVE_BILLING_COUNT_INIT = 'RECEIVE_BILLING_COUNT_INIT';
export const RECEIVE_BILLDING_COUNT_ERRORS = 'RECEIVE_BILLDING_COUNT_ERRORS';
export const RECEIVE_BILLING_COUNT = 'RECEIVE_BILLING_COUNT';
export const RECEIVE_BILLING_COUNT_SUMMARY = 'RECEIVE_BILLING_COUNT_SUMMARY';

// 提单明细初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_BILLING_COUNT_INIT,
    payload: {
      fetching: true,
      column: [],
      result: {
        data: [],
        total: 0,
      },
    },
  };
}

// 提单明细初始化请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_BILLDING_COUNT_ERRORS,
    payload: {
      fetching: false,
      column: [],
      result: {
        data: [],
        total: 0,
      },
    },
  };
}

// 接受提单统计
export function receiveBillingCount(data) {
  return {
    type: RECEIVE_BILLING_COUNT,
    payload: {
      fetching: false,
      column: data.column,
      result: data.result,
    },
  };
}
export function receiveBillingCountSummary(data) {
  return {
    type: RECEIVE_BILLING_COUNT_SUMMARY,
    payload: {
      summary: data.summary,
    },
  };
}

function filterColum(response) {
  if (response && (response.result || response.summary)) {
    let data;
    if (response.result) {
      data = response.result.data;
    } else {
      data = [response.summary];
    }
    data.forEach((item) => {
      // 数量格式化
      item.quantity = formatCount(item.quantity);
      // 金额格式化
      item.supplyPrice = formatPrice(item.supplyPrice);
      item.agioPrice = formatPrice(item.agioPrice);
    });
  }
  if (response && response.column) {
    const { column } = response;
    column[0].fixed = 'left';
    column[0].width = 70;
  }
  return response;
}

// 提单明细统计
export function queryBillingCount(params) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/deliverys/paging-summary', params).then((data) => {
      dispatch(receiveBillingCount(filterColum(data)));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}
export function queryBillingCountSummary(params) {
  return (dispatch) => {
    query('/api/impala/deliverys/paging-summary-statistics', params).then((data) => {
      dispatch(receiveBillingCountSummary(filterColum(data)));
    });
  };
}
// reducers
export default function billCountReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_BILLING_COUNT_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BILLDING_COUNT_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BILLING_COUNT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_BILLING_COUNT_SUMMARY:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
