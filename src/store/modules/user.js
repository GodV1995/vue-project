import { goLogin, logout, getMenu } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  toshow: 0,
  navcolor: 1,
  router: {},
  menus: []
}

const mutations = {
  SET_ROUTER: (state, router) => {
    state.router = router
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_MENUS: (state, menus) => {
    state.menus = menus
  },
  // 顶部导航
  add(state) {
    state.toshow++
  },
  reduciton(state) {
    state.toshow--
  },
  // 深色
  darkcolor(state) {
    state.navcolor = 2
  },
  // 亮色
  brightcolor(state) {
    state.navcolor = 1
  },
  // 主题色
  themecolor(state) {
    state.navcolor = 3
  }
}

const actions = {
  setRouter() {
    commit('SET_ROUTER')
  },
  // user login
  // 登录
  login({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      goLogin(userInfo).then(response => {
        const { data } = response
        console.log(data)
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getMenu(state.token).then(response => {
        const { data } = response

        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const menus = [{
          path: '/systemManagement', // 同一父级的路径
          component: 'Layout', // 组件位置。Layout为最外层包裹的组件（菜单，头部，底部），子元素即为文件路径（main里的内部信息数据展示）
          redirect: '/systemManagement/userList', // 重定向。点击默认显示的路径，在父级中默认显示的子级菜单。或可不写
          name: '系统管理', // 可用来跳转，或者作为路径的标识。起名可以根据路径最后一项
          num: '2', // 没有顶部菜单可以不写。（有顶部菜单作为一个id标识在顶部遍历出来）
          meta: { title: '系统管理', icon: 'example' }, // 配置项。(title是菜单显示的名字，可配置权限)
          children: [
            {
              path: 'userList',
              name: 'systemManagement-userList',
              num: 'example',
              component: 'systemManagement/userList',
              meta: { title: '用户列表' }
            },
            {
              path: 'roleList',
              name: 'systemManagement-roleList',
              num: 'example',
              component: 'systemManagement/roleList',
              meta: { title: '角色列表' }
            },
            {
              path: 'resourceList',
              name: 'systemManagement-resourceList',
              num: 'example',
              component: 'systemManagement/resourceList',
              meta: { title: '资源列表' }
            },
            {
              path: 'mechanismList',
              name: 'systemManagement-mechanismList',
              num: 'example',
              component: 'systemManagement/mechanismList',
              meta: { title: '机构列表' }
            },
            {
              path: 'dictionariesList',
              name: 'systemManagement-dictionariesList',
              num: 'example',
              component: 'systemManagement/dictionariesList',
              meta: { title: '字典目录' }
            }
          ]
        }]
        const { loginName, avatar } = data

        commit('SET_NAME', loginName)
        commit('SET_AVATAR', avatar)
        commit('SET_MENUS', menus)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      removeToken()
      resolve()
    })
  },
  // 顶部导航切换
  addFun(context) {
    context.commit('add')
  },
  // 侧边导航切换
  reducitonFun(context) {
    context.commit('reduciton')
  },
  // 深色
  darkColorFun(context) {
    context.commit('darkcolor')
  },
  // 亮色
  brightColorFun(context) {
    context.commit('brightcolor')
  },
  // 主题色
  themeColorFun(context) {
    context.commit('themecolor')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

