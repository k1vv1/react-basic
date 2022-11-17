import { RouteConfig } from 'react-router-config'

export interface IRouteConfig extends RouteConfig {
  routes?: IRouteConfig[]
  meta?: {
    title: string
    auth: boolean
  }
}
