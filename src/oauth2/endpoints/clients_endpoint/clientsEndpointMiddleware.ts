import * as assert from "assert";
import Models from "../../../utils/compileModels";
import HashMaker from "../../../utils/hashMaker";
import {Oauth2ErrorTypes} from "../../errors/Errors";

class ClientsEndpointMiddleware {

    /*
     * validate current client
     * create client object.
     * */
    public static clientRecognition(request, response, next) {
        let clientId: string = request.query.client_id;
        if (!clientId) {
            clientId = response.locals.client.clientId;
        }
        Models.Client.findOne({clientId: clientId}, (error, result) => {
            try {
                assert.equal(null, error);
                assert.notEqual(null, result);
                response.locals.client = result;
                next();
            } catch (e) {
                let error = request.app.get('Oauth2Error').find(Oauth2ErrorTypes.InvalidClient);
                response.status(error.statusCode).json(error.json);
            }
        });
    }

    /*
     * validate client credential
     * */
    public static validateClientCredential(request, response, next: Function) {
        HashMaker.check(response.locals.clientCredential.clientSecret,
            response.locals.client.clientSecret, (result) => {
                try {
                    assert(result);
                    next();
                } catch (e) {
                    let error = request.app.get('Oauth2Error').find(Oauth2ErrorTypes.InvalidClient);
                    response.status(error.statusCode).json(error.json);
                }
            });
    }

    /*
     * check requested scope with scopes that client can request.
     * @return string of scopes separate with space ' '
     * */
    public static checkRequestedScopes(request, response, next: Function) {
        if (!response.locals.scopes) {
            next();
            return;
        }
        let requestedScopesArray: Array<any> = response.locals.scopes.split(' ');
        let permittedScopes: Array<any> = [];
        try {
            for (let i = 0; i < response.locals.client.scopes.length; i++) {
                if (requestedScopesArray.indexOf(response.locals.client.scopes[i].name) !== -1) {
                    permittedScopes.push(response.locals.client.scopes[i].name);
                }
            }
            response.locals.scopes = permittedScopes.join(' ');
        } catch (e) {
            response.locals.scopes = '';
        }
        next();
    }

    /*
     * validate requested redirect_uri and client redirect_uris.
     * this just check or interrupt
     * */

    public static validateClientRedirectUri(request, response, next: Function) {
        try {
            assert.notEqual(-1, response.locals.client.redirectUri.indexOf(request.query.redirect_uri));
            next();
        } catch (e) {
            let error = request.app.get('Oauth2Error').find(Oauth2ErrorTypes.InvalidRequest);
            response.status(error.statusCode).json(error.json);
        }
    }

}


export default ClientsEndpointMiddleware