import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import WHome from '../components/Worker/WorkerHome'
import BTools from '../components/Worker/tools/borrowTool'
import RTools from '../components/Worker/tools/returnTool'
import TDProject from "../components/Worker/project/toDoProject"
import DProject from "../components/Worker/project/doneProject"
import MHome from '../components/Manager/ManagerHome'
import WWelcome from '@/components/Worker/WelcomeWorker'
import MWelcome from '@/components/Manager/WelcomeManager'
import MStatus from "@/components/Manager/tools/Status"
import MRStatus from "@/components/Manager/tools/mStatus"
import CProject from "@/components/Manager/project/customProject"
import KProject from "@/components/Manager/project/checkProject"
import PList from "@/components/Manager/project/projectList"
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login' //此处重定向，设为默认是login界面
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/whome',
    component: WHome,
    redirect: '/wwelcome',
    children: [
      {
        path: '/wwelcome',
        component: WWelcome
      },
      {
        path: '/borrow',
        component: BTools
      },
      {
        path: "/return",
        component: RTools
      },
      {
        path: "/todoProject",
        component: TDProject
      },
      {
        path: "/doneProject",
        component: DProject
      }
    ]
  },
  {
    path: '/mhome',
    component: MHome,
    redirect: '/mwelcome',
    children: [
      {
        path: '/toolStatus',
        component: MStatus
      },
      {
        path: '/toolApply',
        component: MRStatus
      },
      {
        path: '/mwelcome',
        component: MWelcome
      },
      {
        path: "/customProject",
        component: CProject
      },
      {
        path: "/checkProject",
        component: KProject
      },
      {
        path: "/projectList",
        component: PList
      }

    ]
  }
]

const router = new VueRouter({
  routes
})

// 挂载路由守卫,将要访问的路径，从哪个路径跳转而来
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  // if (!tokenStr) return next('/login');
  next();
})
export default router
