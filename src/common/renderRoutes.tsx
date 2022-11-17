import React from 'react'
import { Switch, Route } from 'react-router'
import { Redirect } from 'react-router-dom'
import { IRouteConfig } from '@/types/IRouteConfig'

function renderRoutes(
  routes: IRouteConfig[],
  extraProps = {},
  switchProps = {},
) {
  return routes ? (
    <Switch {...switchProps}>
      {routes.map((route: any, i: number) => (
        <Route
          key={route.key || i}
          path={route.path}
          exact={route.exact}
          strict={route.strict}
          render={(props) => {
            // todo: !根据环境和业务不同此处逻辑需要进行相关调整
            document.title = route.meta?.title || ''
            window.APP && window.APP.setTitle(route.meta?.title)
            if (route.render) {
              return route.render({ ...props, ...extraProps, route: route })
            }
            if (!route.meta.auth) {
              return (
                <route.component {...props} {...extraProps} route={route} />
              )
            } else {
              const REDIRECT_PATH = '/login'
              const userId = localStorage.getItem('user_id')
              if (!userId) {
                return (
                  <Redirect
                    to={{
                      pathname: REDIRECT_PATH,
                      state: { from: props.location },
                    }}
                  />
                )
              } else {
                return (
                  <route.component {...props} {...extraProps} route={route} />
                )
              }
            }
          }}
        />
      ))}
    </Switch>
  ) : null
}

export default renderRoutes
