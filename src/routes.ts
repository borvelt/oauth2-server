import { Router } from 'express'
import oauth2Routes from './oauth2/routes'
import homectrlRoutes from './homectrl/routes'

let router: Router = Router()

router.use('/$', (request, response) => {
  response.redirect('/homectrl')
})
router.use('/oauth2', oauth2Routes)
router.use('/homectrl', homectrlRoutes)

export default router
