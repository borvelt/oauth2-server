import { Router } from 'express'
import clientEndpointRoutes from './endpoints/clients_endpoint/routes'
import authorizationEndpointRoutes from './endpoints/authorization_endpoint/routes'
import tokenEndpointRoutes from './endpoints/token_endpoint/routes'
import tokenIntrospectionRoutes from './endpoints/token_introspection_endpoint/routes'
import revocationEndpointRoutes from './endpoints/revocation_endpoint/routes'

const router: Router = Router()

router.use('/clients', clientEndpointRoutes)
router.use('/authorize', authorizationEndpointRoutes)
router.use('/token', tokenEndpointRoutes)
router.use('/introspection', tokenIntrospectionRoutes)
router.use('/revoke', revocationEndpointRoutes)

export default router
