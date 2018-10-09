import * as assert from "assert";
import Models from "../../utils/compileModels";
import {Oauth2ErrorTypes} from "../errors/Errors";

class ScopesMiddleware {
    /*
     * check scopes that defined as a mandatory scopes
     * clients have to request them.
     * */
    public static checkMandatoryScopes(request, response, next: Function) {
        let requestedScopes: Array<string> = response.locals.scopes.split(' ');
        let mandatoryScopes: Array<any>;
        Models.Scope.find({isDefault: true}, (error, result) => {
            try {
                assert.equal(error, null);
                assert.notEqual(result, null);
                mandatoryScopes = result;
            } catch (e) {
                mandatoryScopes = [];
            }
            for (let i = 0; i < mandatoryScopes.length; i++) {
                if (requestedScopes.indexOf(mandatoryScopes[i].name) === -1) {
                    let error = request.app.Oauth2Error.find(Oauth2ErrorTypes.InvalidRequest);
                    response.status(error.statusCode).json(error.json);
                    return;
                }
            }
            next();
        });
    }


    /*
     * @return scopes model.
     *
     * */
    public static getScopeModels(request, response, next: Function) {
        if(!response.locals.scopes){
            next();
            return ;
        }
        let requestedScopes: Array<any>;
        if(typeof response.locals.scopes === 'string') {
            requestedScopes = response.locals.scopes.split(' ');
        } else {
            requestedScopes = response.locals.scopes;
        }
        let query: any = {$or: []};
        for (let scope in requestedScopes) {
            if (requestedScopes.hasOwnProperty(scope)) {
                let scopeName: string = requestedScopes[scope];
                query.$or.push({name: scopeName});
            }
        }
        Models.Scope.find(query, (error, result) => {
            try {
                assert.equal(error, null);
                response.locals.scopes = result;
            } catch (e) {
                response.locals.scopes = null;
            }
            next();
        });
    }

    /*
     * @return scopes that request from body.
     * */
    public static getBodyScopes(request, response, next: Function) {
        try {
            assert.notEqual(typeof request.body.scope, typeof undefined);
            response.locals.scopes = request.body.scope;
        }  catch (e){
            response.locals.scopes = null;
        }
        next();
    }


    /*
     * @return requested scopes from query params.
     * */
    public static getQueryScopes(request, response, next: Function) {
        try {
            assert.notEqual(typeof request.query.scope, typeof undefined);
            response.locals.scopes = request.query.scope;
        }  catch (e){
            response.locals.scopes = null;
        }
        next();
    }

}

export default ScopesMiddleware