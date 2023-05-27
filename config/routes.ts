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
            permissionCodes: [
            ],
            routes: [
              {
                path: '/',
                redirect: '/user/list',
              },
              {
                name: '用户列表',
                icon: 'smile',
                path: '/user/list',
                component: './User',
                permissionCodes: ['达人公海池达人公海池']
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
