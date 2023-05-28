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
        name: 'login',
        path: '/login',
        component: './Login',
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/dashboard',
            name: '首页',
            component: './Dashboard',
            affix: true
          },
          {
            path: '/role',
            redirect: '/role/list',
          },
          {
            name: '用户管理',
            path: '/user',
            routes: [
              {
                path: '/',
                redirect: '/user/list',
              },
              {
                name: '用户列表',
                path: '/user/list',
                component: './User',
              },
            ],
          },
          {
            name: '角色管理',
            path: '/role',
            routes: [
              {
                path: '/',
                redirect: '/role/list',
              },
              {
                name: '角色列表',
                path: '/role/list',
                component: './Role',
              },
            ]
          },
          {
            name: '客户管理',
            path: '/customer',
            routes: [
              {
                path: '/',
                redirect: '/customer/list',
              },
              {
                name: '客户列表',
                path: '/customer/list',
                component: './Customer',
              },
            ]
          },
          {
            name: '线路管理',
            path: '/line',
            routes: [
              {
                path: '/',
                redirect: '/line/list',
              },
              {
                name: '线路列表',
                path: '/line/list',
                component: './Line',
              },
            ]
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
