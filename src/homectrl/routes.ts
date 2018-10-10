import { Router } from 'express'
let router: Router = Router()

router.use('/$', (request, response, next) => {
  import('../views/homectrl/homectrl.pug')
    .then(success =>
      response.send(
        success({
          pageTitle: 'Test Home Control',
        }),
      ),
    )
    .catch(error => console.error(error))
})
router.use('/kitchen', (request, response, next) => {
  import('../views/homectrl/show_access.pug')
    .then(success =>
      response.send(
        success({
          pageTitle: 'kitchen controls',
        }),
      ),
    )
    .catch(error => console.error(error))
})
router.use('/other', (request, response, next) => {
  import('../views/homectrl/show_access.pug')
    .then(success =>
      response.send(
        success({
          pageTitle: 'other house controls',
        }),
      ),
    )
    .catch(error => console.error(error))
})

export default router
