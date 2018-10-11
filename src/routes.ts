import { Router, Request, Response } from 'express'
import homectrlRoutes from './homectrl/routes'
import oauth2Routes from './oauth2/routes'

const router: Router = Router()

router.use('/$', (request: Request, response: Response) => {
  response.redirect('/homectrl')
})
router.use('/oauth2', oauth2Routes)
router.use('/homectrl', homectrlRoutes)

export default router
