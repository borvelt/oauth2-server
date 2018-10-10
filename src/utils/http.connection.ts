import * as http from "http";
import * as assert from "assert";

interface HTTPEventListener {
    responseStart?(response: any): void;
    responseProgress?(response: any): void;
    responseEnd?(response: any): void;
}

class HTTP {
    private apiAddress: string = '';
    private port: number = 80;
    private method: string = 'GET';
    private statusCode: number;
    private request: any;
    private path: string = '';
    private headers: any;
    private chunkBody: any = '';
    protected options: any;
    private body: any = [];
    private listener: HTTPEventListener = null;

    protected evaluateRequestOption(): HTTP {
        this.options = {
            host: this.apiAddress,
            port: this.port,
            path: this.path,
            method: this.method,
        };
        return this;
    }

    // @setters
    public setEventListener(listener: HTTPEventListener): HTTP {
        this.listener = listener;
        return this;
    }

    public setPath(path: string): HTTP {
        this.path = path;
        return this;
    }

    public jsonBodyParser(body?: any): HTTP {
        if (typeof body === typeof undefined) {
            body = this.chunkBody;
            this.chunkBody = '';
        } else if (0 !== this.chunkBody.length) {
            body += this.chunkBody;
        }
        try {
            assert.equal(typeof body, "string", "body except that be string type");
            this.body = JSON.parse(body);
        } catch (exception) {
            this.body = [];
            console.log('makeBody::OnJSON->', exception);
        }
        return this;
    }

    public setChunkBody(chunk: string): HTTP {
        this.chunkBody += chunk;
        return this;
    }

    //@ getters
    public getBody(): Array < Object > {
        return this.body;
    }

    public getHeaders(): Object {
        return this.headers;
    }

    public getStatusCode(): number {
        return this.statusCode;
    }

    protected requester(): void {
        console.log('HTTP::request path=', this.path);
        this.request = http.request(this.options, (response) => {
            response.setEncoding('utf8');
            this.headers = response.headers;
            this.statusCode = response.statusCode;
            if (this.listener && this.listener.hasOwnProperty('responseStart')) {
                this.listener.responseStart(this);
            }
            response.on('data', (chunk) => {
                this.setChunkBody(chunk);
                if (this.listener && this.listener.hasOwnProperty('responseProgress')) {
                    this.listener.responseProgress(this);
                }
            }).on('end', () => {
                this.jsonBodyParser();
                if (this.listener && this.listener.hasOwnProperty('responseEnd')) {
                    this.listener.responseEnd(this);
                }
            });
        });
        this.request.end(() => {
        });
    }
}

export {HTTPEventListener, HTTP}