import { query, get } from 'store/fetch';

const initialState = {
  dealers: {
    fetching: false,
    data: [],
    total: 0,
  },
  goods: {
    fetching: false,
    data: [],
    total: 0,
  },
  allBranches: {
    fetching: false,
    data: [],
  },
  allCompanies: {
    fetching: false,
    data: [],
  },
  allBrands: {
    fetching: false,
    data: [],
  },
  allGroups: {
    fetching: false,
    data: [],
  },
  allSeries: {
    fetching: false,
    data: [],
  },
};
// 定义经销商汇总常量
export const RECEIVE_STATISTICS_INIT = 'RECEIVE_STATISTICS_INIT';
export const RECEIVE_STATISTICS_ERRORS = 'RECEIVE_STATISTICS_ERRORS';
export const RECEIVE_STATISTICS = 'RECEIVE_STATISTICS';

// 定义经销商产品汇总常量
export const RECEIVE_BILLGOODS_INIT = 'RECEIVE_BILLGOODS_INIT';
export const RECEIVE_BILLGOODS_ERRORS = 'RECEIVE_BILLGOODS_ERRORS';
export const RECEIVE_BILLGOODS = 'RECEIVE_BILLGOODS';

// 定义分中心常量
export const RECEIVE_BILLBRANCH_INIT = 'RECEIVE_BILLBRANCH_INIT';
export const RECEIVE_BILLBRANCH_ERRORS = 'RECEIVE_BILLBRANCH_ERRORS';
export const RECEIVE_BILLBRANCH = 'RECEIVE_BILLBRANCH';

// 定义小微常量
export const RECEIVE_BILLCOMPANY_INIT = 'RECEIVE_BILLCOMPANY_INIT';
export const RECEIVE_BILLCOMPANY_ERRORS = 'RECEIVE_BILLCOMPANY_ERRORS';
export const RECEIVE_BILLCOMPANY = 'RECEIVE_BILLCOMPANY';

// 定义源品牌常量
export const RECEIVE_BILLBRAND_INIT = 'RECEIVE_BILLBRAND_INIT';
export const RECEIVE_BILLBRAND_ERRORS = 'RECEIVE_BILLBRAND_ERRORS';
export const RECEIVE_BILLBRAND = 'RECEIVE_BILLBRAND';

// 定义产品组常量
export const RECEIVE_BILLGROUP_INIT = 'RECEIVE_BILLGROUP_INIT';
export const RECEIVE_BILLGROUP_ERRORS = 'RECEIVE_BILLGROUP_ERRORS';
export const RECEIVE_BILLGROUP = 'RECEIVE_BILLGROUP';

// 定义产品系列常量
export const RECEIVE_BILLSERIE_INIT = 'RECEIVE_BILLSERIE_INIT';
export const RECEIVE_BILLSERIE_ERRORS = 'RECEIVE_BILLSERIE_ERRORS';
export const RECEIVE_BILLSERIE = 'RECEIVE_BILLSERIE';

// 经销商汇总初始化请求
export function receiveInit() {
  return {
    type: RECEIVE_STATISTICS_INIT,
    payload: {
      fetching: true,
      data: [],
    },
  };
}
// 经销商产品汇总初始化请求
export function receiveGoodsInit() {
  return {
    type: RECEIVE_BILLGOODS_INIT,
    payload: {
      fetching: true,
      data: [],
    },
  };
}
// 分中心初始化请求
export function receiveBranchInit() {
  return {
    type: RECEIVE_BILLBRANCH_INIT,
    payload: {
      fetching: true,
      data: [],
    },
  };
}
// 小微初始化请求
export function receiveCompanyInit() {
  return {
    type: RECEIVE_BILLCOMPANY_INIT,
    payload: {
      fetching: true,
      data: [],
    },
  };
}
// 品牌初始化请求
export function receiveBrandInit() {
  return {
    type: RECEIVE_BILLBRAND_INIT,
    payload: {
      fetching: true,
      data: [],
    },
  };
}
// 产品组初始化请求
export function receiveGroupInit() {
  return {
    type: RECEIVE_BILLGROUP_INIT,
    payload: {
      fetching: true,
      data: [],
    },
  };
}
// 产品系列初始化请求
export function receiveSeriesInit() {
  return {
    type: RECEIVE_BILLSERIE_INIT,
    payload: {
      fetching: true,
      data: [],
    },
  };
}

// 经销商汇总初始化请求错误
export function receiveErrors() {
  return {
    type: RECEIVE_STATISTICS_ERRORS,
    payload: {
      fetching: false,
      data: [],
    },
  };
}
// 经销商产品汇总初始化请求错误
export function receiveGoodsErrors() {
  return {
    type: RECEIVE_BILLGOODS_ERRORS,
    payload: {
      fetching: false,
      data: [],
    },
  };
}
// 分中心初始化请求错误
export function receiveBranchErrors() {
  return {
    type: RECEIVE_BILLBRANCH_ERRORS,
    payload: {
      fetching: false,
      data: [],
    },
  };
}
// 小微初始化请求错误
export function receiveCompanyErrors() {
  return {
    type: RECEIVE_BILLCOMPANY_ERRORS,
    payload: {
      fetching: false,
      data: [],
    },
  };
}
// 品牌初始化请求错误
export function receiveBrandErrors() {
  return {
    type: RECEIVE_BILLBRAND_ERRORS,
    payload: {
      fetching: false,
      data: [],
    },
  };
}
// 产品组初始化请求错误
export function receiveGroupErrors() {
  return {
    type: RECEIVE_BILLGROUP_ERRORS,
    payload: {
      fetching: false,
      data: [],
    },
  };
}
// 产品系列初始化请求错误
export function receiveSerieErrors() {
  return {
    type: RECEIVE_BILLSERIE_ERRORS,
    payload: {
      fetching: false,
      data: [],
    },
  };
}

// 接收经销商汇总
export function receiveStatistics(data) {
  return {
    type: RECEIVE_STATISTICS,
    payload: {
      fetching: false,
      ...data,
    },
  };
}
// 接收经销商产品汇总
export function receiveBillGoods(data) {
  return {
    type: RECEIVE_BILLGOODS,
    payload: {
      fetching: false,
      ...data,
    },
  };
}
// 接收分中心
export function receiveBillBranch(arr) {
  return {
    type: RECEIVE_BILLBRANCH,
    payload: {
      fetching: false,
      data: arr || [],
    },
  };
}
// 接收小微
export function receiveBillCompany(arr) {
  return {
    type: RECEIVE_BILLCOMPANY,
    payload: {
      fetching: false,
      data: arr || [],
    },
  };
}
// 接收品牌
export function receiveBillBrand(arr) {
  return {
    type: RECEIVE_BILLBRAND,
    payload: {
      fetching: false,
      data: arr || [],
    },
  };
}
// 接收产品组
export function receiveBillGroup(arr) {
  return {
    type: RECEIVE_BILLGROUP,
    payload: {
      fetching: false,
      data: arr || [],
    },
  };
}
// 接收产品系列
export function receiveBillSerie(arr) {
  return {
    type: RECEIVE_BILLSERIE,
    payload: {
      fetching: false,
      data: arr || [],
    },
  };
}

// 查询经销商汇总
export function queryBillStatistics(param) {
  return (dispatch) => {
    dispatch(receiveInit());
    query('/api/report/bl/paging-bl-statistics', param).then((data) => {
      dispatch(receiveStatistics(data));
    }, () => {
      dispatch(receiveErrors());
    });
  };
}
// 查询经销商产品汇总
export function getBillGoods(param) {
  return (dispatch) => {
    dispatch(receiveGoodsInit());
    query('/api/report/bl/paging-bl-statistics-goods', param).then((data) => {
      dispatch(receiveBillGoods(data));
    }, () => {
      dispatch(receiveGoodsErrors());
    });
  };
}
// 查询分中心
export function queryBranches() {
  return (dispatch) => {
    dispatch(receiveBranchInit());
    query('/api/search/select/branch').then((data) => {
      dispatch(receiveBillBranch(data));
    }, () => {
      dispatch(receiveBranchErrors());
    });
  };
}
// 查询小微
export function queryCompanies(param) {
  return (dispatch) => {
    dispatch(receiveCompanyInit());
    query('/api/department/list-companies', param).then((data) => {
      dispatch(receiveBillCompany(data));
    }, () => {
      dispatch(receiveCompanyErrors());
    });
  };
}
// 查询品牌
export function queryGoodBrands() {
  return (dispatch) => {
    dispatch(receiveBrandInit());
    get('/api/report/mdGoods/list-brand').then((data) => {
      dispatch(receiveBillBrand(data));
    }, () => {
      dispatch(receiveBrandErrors());
    });
  };
}
// 查询产品组
export function queryGoodGroup() {
  return (dispatch) => {
    dispatch(receiveGroupInit());
    get('/api/report/mdGoods/list-goods-group').then((data) => {
      dispatch(receiveBillGroup(data));
    }, () => {
      dispatch(receiveGroupErrors());
    });
  };
}
// 查询产品系列
export function queryGoodSeries() {
  return (dispatch) => {
    dispatch(receiveSeriesInit());
    get('/api/report/mdGoods/list-goods-series').then((data) => {
      dispatch(receiveBillSerie(data));
    }, () => {
      dispatch(receiveSerieErrors());
    });
  };
}

export default function billStatisticsReducer(state = initialState, action) {
  switch (action.type) {
    case RECEIVE_STATISTICS_INIT:
      return { ...state, dealers: action.payload };
    case RECEIVE_STATISTICS_ERRORS:
      return { ...state, dealers: action.payload };
    case RECEIVE_STATISTICS:
      return { ...state, dealers: action.payload };
    case RECEIVE_BILLGOODS_INIT:
      return { ...state, goods: action.payload };
    case RECEIVE_BILLGOODS_ERRORS:
      return { ...state, goods: action.payload };
    case RECEIVE_BILLGOODS:
      return { ...state, goods: action.payload };
    case RECEIVE_BILLBRANCH_INIT:
      return { ...state, allBranches: action.payload };
    case RECEIVE_BILLBRANCH_ERRORS:
      return { ...state, allBranches: action.payload };
    case RECEIVE_BILLBRANCH:
      return { ...state, allBranches: action.payload };
    case RECEIVE_BILLCOMPANY_INIT:
      return { ...state, allCompanies: action.payload };
    case RECEIVE_BILLCOMPANY_ERRORS:
      return { ...state, allCompanies: action.payload };
    case RECEIVE_BILLCOMPANY:
      return { ...state, allCompanies: action.payload };
    case RECEIVE_BILLBRAND_INIT:
      return { ...state, allBrands: action.payload };
    case RECEIVE_BILLBRAND_ERRORS:
      return { ...state, allBrands: action.payload };
    case RECEIVE_BILLBRAND:
      return { ...state, allBrands: action.payload };
    case RECEIVE_BILLGROUP_INIT:
      return { ...state, allGroups: action.payload };
    case RECEIVE_BILLGROUP_ERRORS:
      return { ...state, allGroups: action.payload };
    case RECEIVE_BILLGROUP:
      return { ...state, allGroups: action.payload };
    case RECEIVE_BILLSERIE_INIT:
      return { ...state, allSeries: action.payload };
    case RECEIVE_BILLSERIE_ERRORS:
      return { ...state, allSeries: action.payload };
    case RECEIVE_BILLSERIE:
      return { ...state, allSeries: action.payload };
    default:
      return state;
  }
}
