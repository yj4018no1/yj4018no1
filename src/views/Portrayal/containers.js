import { query } from 'store/fetch';
import { judgeIndex } from './options';

const initialState = {
  fetching: false,
  amounts: {},
  counts: {},
  maxDealerPortrait: {},
  regionDealerPortrait: {},
  singleDealerPortrait: {},
};

// 常量
export const RECEIVE_PORTRAYAL_INIT = 'RECEIVE_PORTRAYAL_INIT';
export const RECEIVE_PORTRAYAL_ERRORS = 'RECEIVE_PORTRAYAL_ERRORS';
export const RECEIVE_PORTRAYAL = 'RECEIVE_PORTRAYAL';

// 经销商画像初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_PORTRAYAL_INIT,
    payload: {
      fetching: true,
      amounts: {},
      counts: {},
      maxDealerPortrait: {},
      regionDealerPortrait: {},
      singleDealerPortrait: {},
    },
  };
}

// 经销商画像初始化请求错误
export function receiveError() {
  return {
    type: RECEIVE_PORTRAYAL_ERRORS,
    payload: {
      fetching: false,
      amounts: [],
      counts: [],
      maxDealerPortrait: {},
      regionDealerPortrait: {},
      singleDealerPortrait: {},
    },
  };
}

// 接受经销商画像
export function receivePortrayal(data) {
  const { dealerPortraitMonths, regionDealerPortrait, singleDealerPortrait, maxDealerPortrait } = data;
  const count = {
    enters: [],
    sales: [],
    storage: [],
  };
  const amount = {
    enters: [],
    sales: [],
    storage: [],
  };
  dealerPortraitMonths.forEach((region) => {
    count.enters.push(judgeIndex(region, 'purchaseQuantity'));
    count.sales.push(judgeIndex(region, 'saleQuantity'));
    count.storage.push(judgeIndex(region, 'storageQuantity'));
    amount.enters.push(judgeIndex(region, 'purchaseFee'));
    amount.sales.push(judgeIndex(region, 'saleFee'));
    amount.storage.push(judgeIndex(region, 'storageFee'));
  });
  return {
    type: RECEIVE_PORTRAYAL,
    payload: {
      fetching: false,
      amounts: amount,
      counts: count,
      maxDealerPortrait,
      regionDealerPortrait,
      singleDealerPortrait,
    },
  };
}

// 查询经销商画像
export function getPortrayal(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/impala/reports/dealer-portrait-total', param).then((data) => {
      dispatch(receivePortrayal(data));
    }, () => {
      dispatch(receiveError());
    });
  };
}

export default function portralReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_PORTRAYAL_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_PORTRAYAL_ERRORS:
      return Object.assign({}, state, action.payload);
    case RECEIVE_PORTRAYAL:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}
