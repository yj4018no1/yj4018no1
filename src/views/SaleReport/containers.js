import { query } from 'store/fetch';
import { formatPrice, formatCount } from 'store/util';

const initialState = {
  fetching: false,
  result: {
    data: [],
    total: 0,
  },
  column: [],
};

// 定义经销商汇总常量
export const RECEIVE_SALEREPORT_INIT = 'RECEIVE_SALEREPORT_INIT';
export const RECEIVE_SALEREPORT_ERRORS = 'RECEIVE_SALEREPORT_ERRORS';
export const RECEIVE_SALEREPORT = 'RECEIVE_SALEREPORT';

// 定义经销商产品汇总常量
export const RECEIVE_SALEGOODS_INIT = 'RECEIVE_SALEGOODS_INIT';
export const RECEIVE_SALEGOODS_ERRORS = 'RECEIVE_SALEGOODS_ERRORS';
export const RECEIVE_SALEGOODS = 'RECEIVE_SALEGOODS';

export const RECEIVE_SALE_REPORT_SUMMARY = 'RECEIVE_SALE_REPORT_SUMMARY';

// 销售统计初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_SALEREPORT_INIT,
    payload: {
      fetching: true,
      result: {
        data: [],
        total: 0,
      },
      column: [],
    },
  };
}

// 销售统计初始化请求错误
export function receiveError() {
  return {
    type: RECEIVE_SALEREPORT_ERRORS,
    payload: {
      fetching: false,
      result: {
        data: [],
        total: 0,
      },
      column: [],
    },
  };
}

// 接收销售统计
export function receiveSales(data) {
  return {
    type: RECEIVE_SALEREPORT,
    payload: {
      fetching: false,
      result: data.result,
      column: data.column,
    },
  };
}

export function receiveSaleReportSummary(data) {
  return {
    type: RECEIVE_SALE_REPORT_SUMMARY,
    payload: {
      summary: data.summary,
    },
  };
}

function filterColumn(response) {
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
      item.retailQuantity = formatCount(item.retailQuantity);
      item.wholesaleQuantity = formatCount(item.wholesaleQuantity);
      item.peerQuantity = formatCount(item.peerQuantity);
      // 金额格式化
      item.fee = formatPrice(item.fee);
      item.retailFee = formatPrice(item.retailFee);
      item.wholesaleFee = formatPrice(item.wholesaleFee);
      item.peerFee = formatPrice(item.peerFee);
    });
    if (response && response.column) {
      const { column } = response;
      column[0].fixed = 'left';
      column[0].width = 70;
    }
  }
  return response;
}
// 查询销售统计
export function getSaleReport(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/reports/paging-sales-summary', param).then((data) => {
      dispatch(receiveSales(filterColumn(data)));
    }, () => {
      dispatch(receiveError());
    });
  };
}

export function getSaleReportSummary(param) {
  return (dispatch) => {
    query('/api/impala/reports/sales-summary', param).then((data) => {
      dispatch(receiveSaleReportSummary(filterColumn(data)));
    });
  };
}

export default function saleReportReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_SALEREPORT_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_SALEREPORT_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_SALEREPORT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_SALE_REPORT_SUMMARY:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
