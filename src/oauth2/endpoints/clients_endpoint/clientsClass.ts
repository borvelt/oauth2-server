import Models from "../../../utils/compileModels";
import * as assert from "assert";
import IdGenerators from "../../../utils/IdGenerators";
import HashMaker from "../../../utils/hashMaker";

class ClientsEndpoint {

    private $data: any;
    private $request;
    private $response;

    constructor(request, response) {
        this.$request = request;
        this.$response = response;
    }

    public static createInstance(request, response) {
        return new ClientsEndpoint(request, response);
    }

    /*
     * generate client secret and after that create client.
     * */
    public static createClient(request, response) {
        let $this: ClientsEndpoint = ClientsEndpoint.createInstance(request, response);
        $this.makePassword((secret) => {
            $this.$response.locals.clientSecret = secret;
            $this.saveClient();
        })
    }

    private saveClient() {
        this.makeData();
        new Models.Client(this.$data).save((error, result) => {
            try {
                assert.equal(null, error);
                assert.notEqual(null, result);
                this.$response.status(200).json(result);
            } catch (e) {
                this.$response.status(500).json({error: 'error create client'});
            }
        });
    }

    private makePassword(callback) {
        HashMaker.make(this.$request.body.client_secret, (secret) => {
            callback(secret);
        });
    }

    /*
     * initialize $data.
     * this variable will save in database.
     * */
    private makeData() {
        this.$data = {
            clientId: IdGenerators.clientId(),
            clientName: this.$request.body.client_name,
            clientSecret: this.$response.locals.clientSecret,
            redirectUri: this.$request.body.redirect_uri,
            grantTypes: this.$request.body.grant_types,
            responseTypes: this.$request.body.response_types,
            userId: this.$response.locals.user.id,
            scopes: this.$response.locals.scopes,
            preAuthorization: this.$request.body.preAuthorization
        };
    }


}

export default ClientsEndpoint