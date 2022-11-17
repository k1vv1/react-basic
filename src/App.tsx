import React, { memo, Suspense } from 'react'
import renderRoutes from '@/common/renderRoutes'
import { BrowserRouter } from 'react-router-dom'

import routes from './router'

const App = memo(() => {
  return (
    <BrowserRouter basename='/vapps/test'>
      <Suspense fallback={<div>page loading</div>}>
        {renderRoutes(routes)}
      </Suspense>
    </BrowserRouter>
  )
})

export default App
