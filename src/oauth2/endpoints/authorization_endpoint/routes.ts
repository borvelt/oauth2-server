import * as csrf from 'csurf'
import { Router } from 'express'
import ClientsEndpointMiddleware from '../clients_endpoint/clientsEndpointMiddleware'
import ScopesMiddleware from '../../scopes/scopesMiddleware'
import { ResponseTypesMiddleware } from '../../ResponseTypes'
import { UsersMiddleware } from '../../../users/usersMiddleware'
import AuthorizationEndPoint from './authorizationEndpointClass'
import AuthorizationEndpointMiddleware from './authorizationEndpointMiddleware'

let router: any = Router()

router.get(
  '/',
  // Middlewares
  csrf({ cookie: true }),
  UsersMiddleware.validateUserApplicant,
  ClientsEndpointMiddleware.clientRecognition,
  ResponseTypesMiddleware.validateRequestedResponseType,
  ScopesMiddleware.getQueryScopes,
  ScopesMiddleware.checkMandatoryScopes,
  ClientsEndpointMiddleware.checkRequestedScopes,
  ScopesMiddleware.getScopeModels,
  ClientsEndpointMiddleware.validateClientRedirectUri,
  AuthorizationEndpointMiddleware.isPreAuthorizationAllowed,
  ResponseTypesMiddleware.IsTokenResponseType,
  // Do Authorization
  AuthorizationEndPoint.authorizationCode,
)

router.post(
  '/',
  csrf({ cookie: true }),
  UsersMiddleware.validateUserApplicant,
  ClientsEndpointMiddleware.clientRecognition,
  ResponseTypesMiddleware.validateRequestedResponseType,
  ScopesMiddleware.getQueryScopes,
  ScopesMiddleware.checkMandatoryScopes,
  ClientsEndpointMiddleware.checkRequestedScopes,
  ScopesMiddleware.getScopeModels,
  ClientsEndpointMiddleware.validateClientRedirectUri,
  AuthorizationEndpointMiddleware.isPreAuthorizationAllowed,
  ResponseTypesMiddleware.IsTokenResponseType,
  AuthorizationEndPoint.authorizationCode,
)

export default router
