import ErrorInterface from "../../utils/errorInterface";


/*
 * Type of Oauth2 errors based on rfc6749.
 * */
class Oauth2ErrorTypes {
    public static InvalidRequest = 'invalid_request';
    public static InvalidClient = 'invalid_client';
    public static InvalidGrant = 'invalid_grant';
    public static UnAuthorizedClient = 'unauthorized_client';
    public static UnSupportedGrantType = 'unsupported_grant_type';
    public static InvalidScope = 'invalid_scope';

    public static toArray() {
        return [
            Oauth2ErrorTypes.InvalidRequest,
            Oauth2ErrorTypes.InvalidClient,
            Oauth2ErrorTypes.InvalidGrant,
            Oauth2ErrorTypes.UnAuthorizedClient,
            Oauth2ErrorTypes.UnSupportedGrantType,
            Oauth2ErrorTypes.InvalidScope
        ];
    }

}

class Oauth2Error implements ErrorInterface {
    public _error: any = {};
    private _errors: Array<any> = [];

    constructor(errors) {
        for (let i = 0; i < errors.length; i++) {
            this._errors[errors[i].error] = {
                error: errors[i].error,
                error_description: errors[i].errorDescription,
                code: errors[i].code
            };
        }
    }

    public find(error): Oauth2Error {
        this._error = this._errors[error];
        return this;
    }

    get error(): string {
        return this._error.error;
    }

    get errorDescription(): string {
        return this._error.error_description;
    }

    get statusCode(): Number {
        return this._error.code;
    }


    /*
     * return json of error,
     *
     * { error: error_text, error_description: description }
     *
     * */
    get json(): any {
        return {
            error: this.error,
            error_description: this.errorDescription
        };
    }

}

export {Oauth2ErrorTypes ,Oauth2Error}