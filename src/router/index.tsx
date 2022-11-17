import React from 'react'
import { Redirect } from 'react-router-dom'
import { IRouteConfig } from '@/types/IRouteConfig'

const Home = React.lazy(() => import('@/pages/home'))
const Login = React.lazy(() => import('@/pages/login'))
const NotFound = React.lazy(() => import('@/pages/error'))

const routes: IRouteConfig[] = [
  {
    path: '/',
    exact: true,
    render: () => <Redirect to='/home' />,
  },
  {
    path: '/home',
    component: Home,
    meta: {
      title: '首页',
      auth: true,
    },
  },
  {
    path: '/login',
    component: Login,
    meta: {
      title: '登录',
      auth: false,
    },
  },
  {
    path: '*',
    component: NotFound,
    meta: {
      title: '出错了',
      auth: false,
    },
  },
]

export default routes
