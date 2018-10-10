import * as assert from "assert";
import {Oauth2ErrorTypes} from "./errors/Errors";


class RequestBodyMiddleware {

    /*
    * is token field exists in request body ?
    * this middleware use for endpoints that token is mandatory for them.
    * */
    public static isTokenFieldExist(request, response, next) {
        try {
            assert(typeof request.body.token !== typeof undefined);
            next();
        } catch (e) {
            let error = request.app.get('Oauth2Error').find(Oauth2ErrorTypes.InvalidRequest);
            response.status(error.statusCode).json(error.json);
        }
    }
}

export default RequestBodyMiddleware