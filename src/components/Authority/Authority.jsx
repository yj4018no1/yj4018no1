import { getSession } from 'store/requireAuth';

const Authority = ({ children, permission }) => {
  const permissionArr = getSession('bvs');
  let component = null;
  if (permissionArr.permissions.includes(permission)) {
    component = children;
  }
  return component;
};

export default Authority;
