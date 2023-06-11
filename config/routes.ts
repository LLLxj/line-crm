export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/',
        redirect: '/login',
      },
      {
        name: 'register',
        path: '/register',
        component: './Register',
      },
      {
        name: 'login',
        path: '/login',
        component: './Login',
      },
      {
        name: 'customer-login',
        path: '/customer-login',
        component: './Login/customer',
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/dashboard',
            name: '首页',
            component: './Dashboard',
            affix: true,
          },
          {
            path: '/update-password',
            name: '修改密码',
            component: './UpdatePassword',
            hideInMenu: true,
          },
          {
            path: '/update-belong',
            name: '修改管理员',
            component: './UpdateBelong',
            hideInMenu: true,
          },
          {
            path: '/person-center',
            name: '个人中心',
            component: './PersonCenter',
            hideInMenu: true,
          },
          {
            name: '用户管理',
            path: '/user/list',
            component: './User',
            permissionCodes: ['用户列表'],
            // routes: [
            //   {
            //     path: '/',
            //     redirect: '/user/list',
            //   },
            //   {
            //     name: '用户列表',
            //     path: '/user/list',
            //     component: './User',
            //   },
            // ],
          },
          {
            name: '角色管理',
            path: '/role/list',
            component: './Role',
            permissionCodes: ['角色列表'],
            // path: '/role',
            // routes: [
            //   {
            //     path: '/',
            //     redirect: '/role/list',
            //   },
            //   {
            //     name: '角色列表',
            //     path: '/role/list',
            //     component: './Role',
            //   },
            // ]
          },
          {
            name: '权限管理',
            // path: '/permission',
            path: '/permission/list',
            component: './Permission',
            permissionCodes: ['权限列表'],
            // routes: [
            //   {
            //     path: '/',
            //     redirect: '/permission/list',
            //   },
            //   {
            //     name: '权限列表',
            //     path: '/permission/list',
            //     component: './Permission',
            //   },
            // ]
          },
          {
            name: '客户管理',
            path: '/customer/list',
            component: './Customer',
            permissionCodes: ['客户列表'],
            // path: '/customer',
            // routes: [
            //   {
            //     path: '/',
            //     redirect: '/customer/list',
            //   },
            //   {
            //     name: '客户列表',
            //     path: '/customer/list',
            //     component: './Customer',
            //   },
            // ]
          },
          {
            name: '线路管理',
            path: '/line',
            routes: [
              {
                path: '/',
                redirect: '/line/customer/list',
              },
              {
                name: '线路列表',
                path: '/line/business/list',
                component: './Line/business',
                permissionCodes: ['客户线路列表'],
              },
              {
                name: '线路列表',
                path: '/line/customer/list',
                component: './Line/customer',
                permissionCodes: ['个人线路列表'],
              },
            ],
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    component: './404',
  },
];
