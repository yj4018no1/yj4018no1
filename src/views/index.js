// import requireAuth from 'store/requireAuth';
// import CoreLayout from './CoreLayout';
// import Home from './Home';
// import loginRoute from './Login';
// import goodsRoute from './Goods';
// import billingRoute from './Billing';
// import customerRoute from './Customer';
// import saleRouter from './SaleReport';
// import saleDetailRouter from './SalesDetails';
// import unsaleRoute from './Unsale';
// import portrayalRouter from './Portrayal';
// import billStatistics from './BillStatistics';
// import bestSell from './BestSell';
// import inventory from './Inventory';
// import inventoryStatistics from './InventoryStatistics';
// import enterSells from './EnterSells';
// import permissions from './Permissions';
// import billingDetail from './BillingDetail';
// import billingCount from './BillingCount';
// import bvsRoles from './BvsRoles';
// import addRole from './AddRole';
// import userManagement from './UserManagement/UserManagementSearch';
// import userManagementAdd from './UserManagement/UserManagementAdd';

import ZLayout from './ZLayout';
import ztest from './ztest';
import ZFirst from './ZFirst';

// 创建动态路由
export const createRoutes = store => ({

  childRoutes: [
    {
      path: '/',
      component: ZLayout,
      breadcrumbName: '首页',
      // onEnter: (nextState, replace, next) => {
      //   const url = window.location.search && window.location.search.split('=')[1];
      //   if (!requireAuth()) {
      //     replace({ pathname: '/login', query: { url } });
      //   } else if (url) {
      //     replace({ pathname: `/${url}` });
      //   }
      //   next();
      // },
      childRoutes: [
        ztest(store),
        ZFirst(store),
      ],
    },
    //   {
    //   path: '/b',
    //   component: CoreLayout,
    //   indexRoute: Home,
    //   breadcrumbName: '主 页',
    //   onEnter: (nextState, replace, next) => {
    //     const url = window.location.search && window.location.search.split('=')[1];
    //     if (!requireAuth()) {
    //       replace({ pathname: '/login', query: { url } });
    //     } else if (url) {
    //       replace({ pathname: `/${url}` });
    //     }
    //     next();
    //   },
    //   childRoutes: [
    //     goodsRoute(store),
    //     billingRoute(store),
    //     customerRoute(store),
    //     saleRouter(store),
    //     unsaleRoute(store),
    //     saleDetailRouter(store),
    //     portrayalRouter(store),
    //     billStatistics(store),
    //     bestSell(store),
    //     inventory(store),
    //     inventoryStatistics(store),
    //     enterSells(store),
    //     permissions(store),
    //     billingDetail(store),
    //     billingCount(store),
    //     bvsRoles(store),
    //     addRole(store),
    //     userManagement(store),
    //     userManagementAdd(store),
    //   ],
    // },
    // loginRoute(store),
  ],
});

export default createRoutes;
