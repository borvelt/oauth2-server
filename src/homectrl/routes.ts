import { Router } from 'express'
import homectrl from '../views/homectrl/homectrl'
import showAccess from '../views/homectrl/show_access'

let router: Router = Router()

router.use('/$', (request, response, next) => {
  response.render(homectrl, {
    pageTitle: 'Test Home Control',
  })
})
router.use('/kitchen', (request, response, next) => {
  response.render(showAccess, {
    pageTitle: 'kitchen controls',
  })
})
router.use('/other', (request, response, next) => {
  response.render(showAccess, {
    pageTitle: 'other house controls',
  })
})

export default router
