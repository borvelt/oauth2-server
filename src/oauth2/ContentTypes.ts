import * as assert from "assert"
import {Oauth2ErrorTypes} from "./errors/Errors";

class ContentTypes {
    public static JSON = 'application/json';
    public static WWWForm = 'application/x-www-form-urlencoded';
}

class ContentTypesMiddleware {

    /*
     * request MUST has content type "application/json".
     * */
    public static checkJSON(request, response, next: Function) {
        try {
            assert(request.header('content-type') === ContentTypes.JSON);
            response.locals.contentType = ContentTypes.JSON;
            next();
        } catch (e) {
            let error = request.app.Oauth2Error.find(Oauth2ErrorTypes.InvalidRequest);
            response.status(error.statusCode).json(error.json);
        }
    }

    /*
     * request MUST has content type "application/x-www-form-urlencoded".
     * */
    public static checkWWWForm(request, response, next: Function){
        try {
            assert(request.header('content-type') === ContentTypes.WWWForm);
            response.locals.contentType = ContentTypes.WWWForm;
            next();
        } catch (e) {
            let error = request.app.Oauth2Error.find(Oauth2ErrorTypes.InvalidRequest);
            response.status(error.statusCode).json(error.json);
        }
    }
}

export {ContentTypes, ContentTypesMiddleware}