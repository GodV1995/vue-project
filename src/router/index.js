import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { getMenu } from '@/api/user'
const _import = require('./import')
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */

 //新增 num字段 需要一一对应 
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  // {
  //   path: '/dashboard',
  //   component: Layout,
  //   name: '首页',
  //   num: '1',
  //   children: [
  //     {
  //       path: 'dashboard',
  //       name: 'Dashboard',
  //       num: 'example00',
  //       component: () => import('@/views/dashboard/index'),
  //       meta: { title: '首页', icon: 'dashboard' }
  //     }
  //   ]
  // },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: '首页',
    num: '1',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        num: 'example00',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  // {
  //   path: '/systemManagement',
  //   component: Layout,
  //   redirect: '/systemManagement/userList',
  //   name: '系统管理',
  //   num: '2',
  //   meta: { title: '系统管理', icon: 'example' },
  //   children: [
  //     {
  //       path: 'userList',
  //       name: 'systemManagement-userList',
  //       num: 'example',
  //       component: () => import('@/views/systemManagement/userList/index'),
  //       meta: { title: '用户列表' }
  //     },
  //     {
  //       path: 'roleList',
  //       name: 'systemManagement-roleList',
  //       num: 'example',
  //       component: () => import('@/views/systemManagement/roleList/index'),
  //       meta: { title: '角色列表' }
  //     },
  //     {
  //       path: 'resourceList',
  //       name: 'systemManagement-resourceList',
  //       num: 'example',
  //       component: () => import('@/views/systemManagement/resourceList/index'),
  //       meta: { title: '资源列表' }
  //     },
  //     {
  //       path: 'mechanismList',
  //       name: 'systemManagement-mechanismList',
  //       num: 'example',
  //       component: () => import('@/views/systemManagement/mechanismList/index'),
  //       meta: { title: '机构列表' }
  //     },
  //     {
  //       path: 'dictionariesList',
  //       name: 'systemManagement-dictionariesList',
  //       num: 'example',
  //       component: () => import('@/views/systemManagement/dictionariesList/index'),
  //       meta: { title: '字典目录' }
  //     },
  //     {
  //       path: 'dictionariesDetail',
  //       name: 'systemManagement-dictionariesDetail',
  //       num: 'example',
  //       component: () => import('@/views/systemManagement/dictionariesDetail/index'),
  //       meta: { title: '字典明细' }
  //     },
  //     {
  //       path: 'systemList',
  //       name: 'systemManagement-systemList',
  //       num: 'example',
  //       component: () => import('@/views/systemManagement/systemList/index'),
  //       meta: { title: '系统列表' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  isAddDynamicMenuRoutes: false, // 是否已经添加动态(菜单)路由
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
