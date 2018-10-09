import * as assert from "assert";
import {GrantTypes} from "./GrantTypes";
import TokenEndpoint from "./endpoints/token_endpoint/tokenEndpointClass";
import {Oauth2ErrorTypes} from "./errors/Errors";


class ResponseTypes {
    public static Code = 'code';
    public static Token = 'token';
    public static IdToken = 'id_token';
}

class ResponseTypesMiddleware {
    /*
     * Do we have this response type?
     * this middleware answer to this question.
     * */
    public static validateRequestedResponseType(request, response, next: Function) {
        try {
            assert.notEqual(response.locals.client.responseTypes.indexOf(request.query.response_type), -1);
            next();
        } catch (e) {
            let error = request.app.Oauth2Error.find(Oauth2ErrorTypes.InvalidRequest);
            response.status(error.statusCode).json(error.json);
        }
    }

    public static IsTokenResponseType(request, response, next: Function) {
        try {
            assert.equal(ResponseTypes.Token, request.query.response_type);
            response.locals.grantType = GrantTypes.Implicit;
            TokenEndpoint.accessToken(request, response);
        } catch (e) {
            next();
        }
    }

}

export {ResponseTypes, ResponseTypesMiddleware}