import * as assert from "assert";
import {Oauth2ErrorTypes} from "../../errors/Errors";

class AuthorizationEndpointMiddleware {


    /*
    * is authorization code redirect URI the same as requested redirect_uri
    * */
    public static validateRedirectUri(request, response, next: Function) {
        if (!response.locals.authorizationCode) {
            next();
            return;
        }
        try {
            assert.notEqual(response.locals.authorizationCode.redirectUri, request.query.redirect_uri);
            next();
        } catch (e) {
            let error = request.app.Oauth2Error.find(Oauth2ErrorTypes.InvalidGrant);
            response.status(error.statusCode).json(error.json);
        }
    }
    /*
     * this method check client pre authorization
     * preAuthorization allowed by some clients.
     * */
    public static isPreAuthorizationAllowed(request, response, next: Function) {
        try {
            assert(response.locals.client.preAuthorization);
            next();
        } catch (e) {
            if(request.body.client_authorization === 'yes') {
                next();
            } else if (request.body.client_authorization === 'no') {
                response.render('clientAuthorization.pug', {
                    pageTitle: 'Authorization Failed.',
                    userRejectClient: true,
                    client: response.locals.client,
                    requestedScopes: response.locals.scopes
                });
            } else {
                response.render('clientAuthorization.pug', {
                    pageTitle: 'Confirm Client Authorization',
                    client: response.locals.client,
                    csrfToken: request.csrfToken(),
                    requestedScopes: response.locals.scopes
                });
            }
        }
    }


}

export default AuthorizationEndpointMiddleware