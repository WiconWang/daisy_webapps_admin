import Main from '@/components/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: false,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: false,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/users',
    name: 'menu_users',
    meta: {
      icon: 'logo-buffer',
      title: '用户',
      // access: ['users'],
      hideInMenu: false,
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'menu_users_list',
        meta: {
          icon: 'md-contacts',
          title: '列表'
        },
        component: () => import('@/view/users/list.vue')
      },
    ]
  },

  {
    path: '/article',
    name: 'menu_article',
    meta: {
      icon: 'logo-buffer',
      title: '文章',
      // access: ['users'],
      hideInMenu: false,
      notCache: true
    },
    component: Main,
    children: [
      {
        path: 'list',
        name: 'menu_article_list',
        meta: {
          icon: 'ios-book-outline',
          title: '列表'
        },
        component: () => import('@/view/article/list.vue')
      },
    ]
  },


  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
