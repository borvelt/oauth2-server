import { Router } from 'express'

let router: Router = Router()

router.use('/$', (request, response, next) => {
  response.render('homectrl/homectrl.pug', {
    pageTitle: 'Test Home Control',
  })
})
router.use('/kitchen', (request, response, next) => {
  response.render('homectrl/show_access.pug', {
    pageTitle: 'kitchen controls',
  })
})
router.use('/other', (request, response, next) => {
  response.render('homectrl/show_access.pug', {
    pageTitle: 'other house controls',
  })
})

export default router
