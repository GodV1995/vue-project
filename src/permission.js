import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式
import { getToken } from '@/utils/auth' // 获取token令牌
import getPageTitle from '@/utils/get-page-title' // 获取动态的title
const _import = require('./router/import')
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // 进度条的配置

const whiteList = ['/login'] // 重定向值不需要token值得页面

router.beforeEach(async(to, from, next) => {
  // 开始进度条
  NProgress.start()

  // 设置页面标题
  document.title = getPageTitle(to.meta.title)

  // 确定用户是否已经登录
  const hasToken = getToken()
  // 有token
  if (hasToken) {
    if (to.path === '/login') {
      // 跳转到首页去
      next({
        path: '/'
      })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')
          if (store.getters.menus.length < 1) {
            global.antRouter = []
            next()
          }
          const menus = filterAsyncRouter(store.getters.menus) // 1.过滤路由
          router.addRoutes(menus) // 2.动态添加路由
          global.antRouter = menus // 3.将路由数据传递给全局变量，做侧边栏菜单渲染工作
          next({
            ...to,
            replace: true
          }) // hack方法 确保addRoutes已完成 ,set the replace
        } catch (error) {
          // 移除令牌，重定向值登录页面
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    next()
    /* 没有token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 跳转到不需要token值得页面
      next()
    } else {
      // 没有访问权限的跳转至登录页去
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // 进度条完成
  NProgress.done()
})

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
  const accessedRouters = asyncRouterMap.filter(route => {
  if (route.component) {
    if (route.component === 'Layout') {
       route.component = Layout
    } else {
        route.component = _import(route.component) // 导入组件
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })
  return accessedRouters
}

function addDynamicRoutes(menuList) {
  console.log(22333)
  var temp = []
  for (var i = 0; i < menuList.length; i ++) {
    if (menuList[i].subResources && menuList[i].subResources.length >= 1) {
      temp = temp.concat(menuList[i].subResources)
      console.log(22333)
    } else {

    }
  }
}
