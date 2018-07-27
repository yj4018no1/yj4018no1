import { browserHistory } from 'react-router';
import { post } from 'store/fetch';
import { menuMapping } from './menu';

export function setSession(name, value, url) {
  const str = JSON.stringify(value);
  sessionStorage.setItem(name, str);
  const pathname = url ? `/${url}` : '/';
  browserHistory.push(pathname);
}

export function by(name) {
  return function (o, p) {
    const a = o[name];
    const b = p[name];
    if (typeof o === 'object' && typeof p === 'object' && o && p) {
      if (a === b) {
        return 0;
      }
    }
    return a < b ? -1 : 1;
  };
}

export function setMenu(permissions) {
  const menus = [
    {
      key: 'home',
      name: '我的工作台',
      url: '/',
      icon: 'home',
      children: [],
    },
  ];
  const items = {
    goodsGrid: {
      key: 'goodsGrid',
      name: '网格主数据',
      url: '',
      icon: 'inbox',
      children: [],
    },
    report: {
      key: 'report',
      name: '进销存报表',
      url: '',
      icon: 'dot-chart',
      children: [],
    },
    analysis: {
      key: 'analysis',
      name: '分析报表',
      url: '',
      icon: 'area-chart',
      children: [],
    },
    permissions: {
      key: 'permissions',
      name: '权限管理',
      url: '/permissions',
      icon: 'solution',
      parent: 'menu',
      children: [],
    },
  };
  if (permissions && permissions.length > 0) {
    permissions.forEach((key) => {
      if (menuMapping[key]) {
        const menuItem = menuMapping[key];
        items[menuItem.parent].children.push(menuItem);
      }
    });
    menus.push(items.goodsGrid, items.report, items.analysis);
    if (permissions.includes('allPermissions')) {
      menus.push(items.permissions);
    }
  }
  if (menus && menus.length > 0) {
    menus.forEach((menu) => {
      if (menu.children) {
        menu.children.sort(by('order'));
      }
    });
  }
  return menus;
}


export function getSession(name) {
  let objStr = sessionStorage.getItem(name) || '';
  try {
    objStr = JSON.parse(objStr);
  } catch (error) {
    objStr = null;
  }
  return objStr;
}

export function delSession(name) {
  sessionStorage.removeItem(name);
  browserHistory.push('/login');
}

export function logoutAction() {
  post('/api/users/logout').then(() => {
    delSession('bvs');
  });
}


export default function requireAuth() {
  return !!getSession('bvs');
}
