import * as assert from "assert";
import {Oauth2ErrorTypes} from "./errors/Errors";


class GrantTypes {
    public static AuthorizationCode = 'authorization_code';
    public static Implicit = 'implicit';
    public static RefreshToken = 'refresh_token';
    public static ClientCredentials = 'client_credentials';

    public static toArray(): Array<GrantTypes> {
        return [
            GrantTypes.AuthorizationCode,
            GrantTypes.ClientCredentials,
            GrantTypes.RefreshToken,
            GrantTypes.Implicit,
        ]
    }

}

class GrantTypesMiddleware {

    /*
    * Check grant type supported by authorization server?
    * */
    public static isValidGrantType(request, response, next: Function) {
        try {
            assert.notEqual(response.locals.client.grantTypes.indexOf(response.locals.grantType), -1);
            next();
        } catch (e) {
            let error = request.app.get('Oauth2Error').find(Oauth2ErrorTypes.UnSupportedGrantType);
            response.status(error.statusCode).json(error.json);
        }
    }

    /*
     * get body grant_type.
     * */
    public static getGrantType(request, response, next: Function) {
        try {
            assert.notEqual(typeof request.body.grant_type, typeof undefined);
            response.locals.grantType = request.body.grant_type;
        } catch (e) {
        }
        next();
    }

    /*
     * this middleware check this request must not has a implicit grant type.
     * */
    public static validateToNotBeImplicitGrantType(request, response, next: Function) {
        try {
            assert.notEqual(request.body.grant_type, GrantTypes.Implicit);
            next();
        } catch (e) {
            let error = request.app.get('Oauth2Error').find(Oauth2ErrorTypes.UnAuthorizedClient);
            response.status(error.statusCode).json(error.json);
        }
    }

    /*
     * Check is "Authorization Code" grant type.
     * */
    public static isAuthorizationCodeGrantType(request, response, next: Function) {
        try {
            assert.equal(request.body.grant_type, GrantTypes.AuthorizationCode);
            response.locals.authorizationCode = request.body.code;
        } catch (e) {
            response.locals.authorizationCode = null;
        }
        next();
    }

    public static isRefreshTokenGrantType(request, response, next: Function) {
        try {
            assert.equal(request.body.grant_type, GrantTypes.RefreshToken);
            response.locals.refreshToken = request.body.refresh_token;
        } catch (e) {
            response.locals.refreshToken = null;
        }
        next();
    }

}


export {GrantTypes, GrantTypesMiddleware}