import { query } from 'store/fetch';
import { formatPrice, formatCount } from 'store/util';
import _ from 'lodash';

const initialState = {
  fetching: false,
  result: {
    data: [],
    total: 0,
  },
  summary: null,
  column: [],
};
// 定义进销存常量
export const RECEIVE_ENTER_INIT = 'RECEIVE_ENTER_INIT';
export const RECEIVE_ENTER_ERRORS = 'RECCEIVE_ERRORS';
export const RECEIVE_ENTERSELLS = 'RECEIVE_ENTERSELLS';

export const RECEIVE_ENTER_SUMMARY_INIT = 'RECEIVE_ENTER_SUMMARY_INIT';
export const RECEIVE_ENTER_SUMMARY_ERROR = 'RECEIVE_ENTER_SUMMARY_ERROR';
export const RECEIVE_ENTER_SUMMARY = 'RECEIVE_ENTER_SUMMARY';


// 进销存初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_ENTER_INIT,
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

// 进销存初始化请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_ENTER_ERRORS,
    payload: {
      fetching: false,
      data: [],
      total: 0,
    },
  };
}

// 接收进销存
export function receiveEnterSells(data) {
  return {
    type: RECEIVE_ENTERSELLS,
    payload: {
      fetching: false,
      column: data.column,
      result: data.result,
    },
  };
}

export function receiveSummaryInit() {
  return {
    type: RECEIVE_ENTER_SUMMARY_INIT,
    payload: {},
  };
}

export function receiveSummary(data) {
  return {
    type: RECEIVE_ENTER_SUMMARY,
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
      item.qcQuantity = formatCount(item.qcQuantity);
      item.qcPositiveQuantity = formatCount(item.qcPositiveQuantity);
      item.qcNegativeQuantity = formatCount(item.qcNegativeQuantity);
      item.jhQuantity = formatCount(item.jhQuantity);
      item.jhOrderQuantity = formatCount(item.jhOrderQuantity);
      item.jhOwnQuantity = formatCount(item.jhOwnQuantity);
      item.qtrkQuantity = formatCount(item.qtrkQuantity);
      item.qtrkOverQuantity = formatCount(item.qtrkOverQuantity);
      item.qtrkOtherQuantity = formatCount(item.qtrkOtherQuantity);
      item.xsQuantity = formatCount(item.xsQuantity);
      item.xsRetailQuantity = formatCount(item.xsRetailQuantity);
      item.xsWholesaleQuantity = formatCount(item.xsWholesaleQuantity);
      item.xsPeerQuantity = formatCount(item.xsPeerQuantity);
      item.qtckQuantity = formatCount(item.qtckQuantity);
      item.qtckLoseQuantity = formatCount(item.qtckLoseQuantity);
      item.qtckOtherQuantity = formatCount(item.qtckOtherQuantity);
      item.qmQuantity = formatCount(item.qmQuantity);
      item.qmPositiveQuantity = formatCount(item.qmPositiveQuantity);
      item.qtrkQuantity = formatCount(item.qtrkQuantity);
      item.qmNegativeQuantity = formatCount(item.qmNegativeQuantity);
      item.qmZhQuantity = formatCount(item.qmZhQuantity);

      // 金额格式化
      item.qcFee = formatPrice(item.qcFee);
      item.qcPositiveFee = formatPrice(item.qcPositiveFee);
      item.qcNegativeFee = formatPrice(item.qcNegativeFee);
      item.jhFee = formatPrice(item.jhFee);
      item.jhOrderFee = formatPrice(item.jhOrderFee);
      item.jhOwnFee = formatPrice(item.jhOwnFee);
      item.qtrkFee = formatPrice(item.qtrkFee);
      item.qtrkOverFee = formatPrice(item.qtrkOverFee);
      item.qtrkOtherFee = formatPrice(item.qtrkOtherFee);
      item.xsFee = formatPrice(item.xsFee);
      item.xsRetailFee = formatPrice(item.xsRetailFee);
      item.xsWholesaleFee = formatPrice(item.xsWholesaleFee);
      item.xsPeerFee = formatPrice(item.xsPeerFee);
      item.qtckFee = formatPrice(item.qtckFee);
      item.qtckLoseFee = formatPrice(item.qtckLoseFee);
      item.qtckOtherFee = formatPrice(item.qtckOtherFee);
      item.qmFee = formatPrice(item.qmFee);
      item.qmPositiveFee = formatPrice(item.qmPositiveFee);
      item.qmNegativeFee = formatPrice(item.qmNegativeFee);
    });
  }
  if (response && response.column) {
    const { column } = response;
    column[0].fixed = 'left';
    column[0].width = 70;
  }
  return response;
}

// 查询进销存
export function queryEnterSells(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/reports/paging-pss-summary', param).then((data) => {
      dispatch(receiveEnterSells(filterColum(data)));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}

export function querySummary(param) {
  return (dispatch) => {
    dispatch(receiveSummaryInit());
    query('/api/impala/reports/pss-summary', param).then((data) => {
      dispatch(receiveSummary(filterColum(data)));
    }, () => {
      // dispatch(receiveError)
    });
  };
}

export default function enterSellReducer(state = initialState, action) {
  function deleteNullRecursive(data) {
    if (typeof data === 'object') {
      const keys = Object.keys(data);
      for (const key of keys) {
        if (key === 'dataIndex') {
          data.key = data.dataIndex;
        }
        if (data[key] === null) {
          delete data[key];
        }
        if (typeof data[key] === 'object' || Array.isArray(data[key])) {
          deleteNullRecursive(data[key]);
        }
        if (typeof data[key] === 'string') {
          data[key] = data[key].trim();
        }
      }
    } else if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        deleteNullRecursive(data[i]);
      }
    }
  }
  switch (action.type) {
    case RECEIVE_ENTER_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_ENTER_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_ENTERSELLS:
      deleteNullRecursive(action.payload);
      return Object.assign({}, state, action.payload);
    case RECEIVE_ENTER_SUMMARY_INIT:
      return state;
    case RECEIVE_ENTER_SUMMARY:
      return Object.assign({}, state, action.payload);
    case RECEIVE_ENTER_SUMMARY_ERROR:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
