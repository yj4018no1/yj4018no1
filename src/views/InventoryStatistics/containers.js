import { query } from 'store/fetch';
import { formatPrice, formatCount } from 'store/util';

// 定义经销商汇总常量
export const RECEIVE_INVENTORYSTATISTICS_INIT = 'RECEIVE_INVENTORYSTATISTICS_INIT';
export const RECEIVE_INVENTORYSTATISTICS_ERRORS = 'RECEIVE_INVENTORYSTATISTICS_ERRORS';
export const RECEIVE_INVENTORYSTATISTICS = 'RECEIVE_INVENTORYSTATISTICS';
export const RECEIVE_INVENTORY_STAT_SUMMARY = 'RECEIVE_INVENTORY_STAT_SUMMARY';

const initialState = {
  fetching: false,
  result: {
    data: [],
    total: 0,
  },
  column: [],
};

// 库存统计初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_INVENTORYSTATISTICS_INIT,
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

// 库存统计初始化请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_INVENTORYSTATISTICS_ERRORS,
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

// 接收库存统计
export function receiveInventoryStatistics(data) {
  return {
    type: RECEIVE_INVENTORYSTATISTICS,
    payload: {
      fetching: false,
      result: data.result,
      column: data.column,
    },
  };
}
export function receiveInventoryStatSummary(data) {
  return {
    type: RECEIVE_INVENTORY_STAT_SUMMARY,
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
      item.negativeQuantity = formatCount(item.negativeQuantity);
      item.positiveQuantity = formatCount(item.positiveQuantity);
      // 金额格式化
      item.fee = formatPrice(item.fee);
      item.negativeFee = formatPrice(item.negativeFee);
      item.positiveFee = formatPrice(item.positiveFee);
    });
  }
  if (response && response.column) {
    const { column } = response;
    column[0].fixed = 'left';
    column[0].width = 70;
  }
  return response;
}

// 查询库存统计
export function queryInventoryStatistics(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/reports/summary/paging', param).then((data) => {
      dispatch(receiveInventoryStatistics(filterColum(data)));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

export function queryInventoryStatisticsSummary(param) {
  return (dispatch) => {
    query('/api/impala/reports/summary/paging-summary', param).then((data) => {
      dispatch(receiveInventoryStatSummary(filterColum(data)));
    });
  };
}

export default function inventoryStatisticsReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_INVENTORYSTATISTICS_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_INVENTORYSTATISTICS_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_INVENTORYSTATISTICS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_INVENTORY_STAT_SUMMARY:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
