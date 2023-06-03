export function authRouter (userInfo, route) {
  const list = filterRouter(route, userInfo?.permissionList)
  return list
}

function filterRouter (routes, perms) {
  const res = []
  if (!perms || !perms?.length) {
    return []
  }
  routes.forEach(route => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterRouter(tmp.children, perms)
      if (tmp.children && tmp.children.length > 0) {
        res.push(tmp)
      }
    } else if (hasPermission(perms, tmp)) {
      res.push(tmp)
    }
  })
  return res
}

function hasPermission (perms, route) {
  if (
    route
      && route.permissionCodes
        && !route.hideInMenu
  ) {
    return perms.some(perm =>
      route.permissionCodes.includes(perm))
  } if (
    route
      && !route.permissionCodes
        && !route.hideInMenu
  ) {
    return true
  } 
  return false
}

export function getRouteInfo (location, route) {
  let list = []
  let activeRoute = {}
  route?.children?.forEach(item => {
    if (!item?.children || !item?.children?.length) {
      list = [
        ...list,
        item
      ]
    } else {
      list = [
        ...list,
        ...item?.children
      ]
    }
  });
  list?.forEach(item => {
    if (item.path === location?.pathname) {
      activeRoute = item
    } else if (location?.pathname.indexOf(item?.originPath) !== -1) {
      item.url = location?.pathname
      activeRoute = item
    }
  })
  return activeRoute
}

