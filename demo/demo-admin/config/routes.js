export default [
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'home',
    // component: './Welcome',
    redirect: '/application/home',
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },

  {
    path: '/application',
    name: 'application',
    icon: 'translation',
    routes: [
      {
        path: '/application/home',
        name: 'home',
        icon: 'smile',
        component: './application/Index',
      },
      {
        path: '/application/detail',
        name: 'detail',
        icon: 'smile',
        hideInMenu:true,
        component: './application/detail-info/index',
      },
      {
        path: '/application/application-type',
        name: 'application-type',
        icon: 'smile',
        hideInMenu:true,
        component: './application-type/Index',
      },
      {
        component: './404',
      },
    ],
  },



  {
    path: '/',
    redirect: '/welcome',
  },


  {
    component: './404',
  },
];
