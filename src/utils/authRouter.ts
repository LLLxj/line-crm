export function authRouter(userInfo: any, route: any) {
  const list = filterRouter(route, userInfo?.permNameSet);
  return list;
}

function filterRouter(routes: any, perms: any) {
  const res: any[] = [];
  if (!perms || !perms?.length) {
    return [];
  }
  routes.forEach((route: any) => {
    const tmp = { ...route };
    if (tmp.children) {
      tmp.children = filterRouter(tmp.children, perms);
      if (tmp.children && tmp.children.length > 0) {
        res.push(tmp);
      }
    } else if (hasPermission(perms, tmp)) {
      res.push(tmp);
    }
  });
  return res;
}

function hasPermission(perms: any, route: any) {
  if (route && route.permissionCodes && !route.hideInMenu) {
    return perms.some((perm: any) => route.permissionCodes.includes(perm));
  }
  if (route && !route.permissionCodes && !route.hideInMenu) {
    return true;
  }
  return false;
}
