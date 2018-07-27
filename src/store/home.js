import { get } from './fetch';

export const RECEIVE_HOME_INIT = 'RECEIVE_INIT';
export const RECEIVE_HOME = 'RECEIVE_HOME';
export const RECEIVE_HOME_ERROR = 'RECEIVE_HOME_ERROR';

const initialState = {
  fetching: false,
  monthsCounts: {},
  yearsCounts: {},
  stocks: [],
};


// 主页初始化
export function receiveInit() {
  return {
    type: RECEIVE_HOME_INIT,
    payload: {
      fetching: true,
      monthsCounts: {},
      yearsCounts: {},
      stocks: [],
    },
  };
}

// 主页初始化请求错误
export function receiveError() {
  return {
    type: RECEIVE_HOME_ERROR,
    payload: {
      fetching: false,
      monthsCounts: {},
      yearsCounts: {},
      stocks: [],
    },
  };
}

export function receiveData(data) {
  const { avgDealerPortraitMonths, homePageStocks, avgDealerPortraitYears } = data;
  const monthsCount = {
    months: [],
    enters: [],
    sales: [],
    storage: [],
  };
  const yearsCount = {
    months: [],
    enters: [],
    sales: [],
    storage: [],
  };
  const stock = [];
  avgDealerPortraitMonths.forEach((ele) => {
    monthsCount.months.push(ele.month);
    monthsCount.enters.push(ele.purchaseQuantity);
    monthsCount.sales.push(ele.saleQuantity);
    monthsCount.storage.push(ele.storageQuantity);
  });
  avgDealerPortraitYears.forEach((ele) => {
    yearsCount.months.push(ele.year);
    yearsCount.enters.push(ele.purchaseQuantity);
    yearsCount.sales.push(ele.saleQuantity);
    yearsCount.storage.push(ele.storageQuantity);
  });
  homePageStocks.forEach((ele) => {
    const obj = {
      name: ele.goodsGroup,
      value: ele.quantity,
    };
    stock.push(obj);
  });
  return {
    type: RECEIVE_HOME,
    payload: {
      fetching: false,
      monthsCounts: monthsCount,
      yearsCounts: yearsCount,
      stocks: stock,
    },
  };
}

export function queryHome() {
  return (dispatch) => {
    dispatch(receiveInit());
    get('/api/impala/reports/home-page').then((data) => {
      dispatch(receiveData(data));
    }, () => {
      dispatch(receiveError());
    });
  };
}

export default function homeReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_HOME_INIT:
      return Object.assign({}, state, action.payload);
    case RECEIVE_HOME:
      return Object.assign({}, state, action.payload);
    case RECEIVE_HOME_ERROR:
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
}



