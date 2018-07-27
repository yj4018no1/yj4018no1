import { query } from 'store/fetch';

// 定义库存明细常量
export const RECEIVE_INVENTORY_INIT = 'RECEIVE_INVENTORY_INIT';
export const RECEIVE_INVENTORY_ERRORS = 'RECEIVE_INVENTORY_ERRORS';
export const RECEIVE_INVENTORY = 'RECEIVE_INVENTORY';
export const RECEIVE_INVENTORY_SUMMARY = 'RECEIVE_INVENTORY_SUMMARY';


const initialState = {
  fetching: false,
  data: [],
  total: 0,
};
// 库存明细初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_INVENTORY_INIT,
    payload: {
      fetching: true,
      data: [],
      total: 0,
    },
  };
}
// 接收库存明细
export function receiveInventory(data) {
  return {
    type: RECEIVE_INVENTORY,
    payload: {
      fetching: false,
      ...data,
    },
  };
}
export function receiveInventorySummary(data) {
  return {
    type: RECEIVE_INVENTORY_SUMMARY,
    payload: {
      summary: data,
    },
  };
}

// 接收产品系列
export function receiveErrors(arr) {
  return {
    type: RECEIVE_INVENTORY_ERRORS,
    payload: {
      fetching: false,
      data: arr || [],
    },
  };
}

// 查询库存明细
export function queryInventory(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/reports/detail/paging', param).then((data) => {
      dispatch(receiveInventory(data));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

export function queryInventorySummary(param) {
  return (dispatch) => {
    query('/api/impala/reports/detail/paging-summary', param).then((data) => {
      dispatch(receiveInventorySummary(data));
    });
  };
}

export default function inventoryReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_INVENTORY_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_INVENTORY_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_INVENTORY:
      return Object.assign({}, state, action.payload);
    case RECEIVE_INVENTORY_SUMMARY:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
