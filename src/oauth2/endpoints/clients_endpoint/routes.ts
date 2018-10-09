import { Router } from 'express'
import ClientsEndpoint from './clientsClass'
import { ContentTypesMiddleware } from '../../ContentTypes'
import { UsersMiddleware } from '../../../users/usersMiddleware'
import ScopesMiddleware from '../../scopes/scopesMiddleware'

let router: Router = Router()

/*
 * Place your routes about clients_endpoint.
 * */
/*
 * Client registration end point.
 * */
router.post(
  '/registration',
  ContentTypesMiddleware.checkJSON,
  UsersMiddleware.validateUserApplicant,
  ScopesMiddleware.getBodyScopes,
  ScopesMiddleware.getScopeModels,
  ClientsEndpoint.createClient,
)

export default router
