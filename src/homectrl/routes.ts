import { Router } from 'express'
const router: Router = Router()

router.use('/$', (request, response) => {
  import('../views/homectrl/homectrl.pug')
    .then(showAccessView =>
      response.send(
        showAccessView({
          pageTitle: 'Test Home Control',
        }),
      ),
    )
    .catch(error => console.error(error))
})
router.use('/kitchen', (request, response) => {
  import('../views/homectrl/show_access.pug')
    .then(showAccessView =>
      response.send(
        showAccessView({
          pageTitle: 'kitchen controls',
        }),
      ),
    )
    .catch(error => console.error(error))
})
router.use('/other', (request, response) => {
  import('../views/homectrl/show_access.pug')
    .then(showAccessView =>
      response.send(
        showAccessView({
          pageTitle: 'other house controls',
        }),
      ),
    )
    .catch(error => console.error(error))
})

export default router
