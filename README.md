# Oauth2 Server

_oauth2 implementation - rfc6749, rfc7009, rfc7662_

## What is this repo exatly?
This repo is a about 70% implementation of oauth2 server.This is experimental and very use full for any one who want to understand how oauth works exactly.I think it has use full samples and scopes.

_Implemented:_
  * RFC 6749 oauth2, Refresh token
  * RFC 7009 token revocation
  * RFC 7662 token Introspection
  * Dynamic client registration
  * Supported response_types: code, token
  * Supported grant_types: authorirzation_code, refresh_token, client_credential, implicit

All of implemented parts of project based on RFC (how to request, what should be response and etc).I think it's good to first of all read some thing about RFCs.

## Installation
Clone or download repo
```bash
$ git clone https://github.com/borvelt/oauth2-server
```
As always we should install node modules, go to oauth2-server directory and run `npm install`.

Your code is ready now you should install mongodb.

For first time to initialize your database you should run `npm run intialize` command.
Initialization script will run from `src/utils/initialize.ts`, if you want to understand what will import to your database see this file.

## Run 
For make final version run `npm run make` but while developing codes I have used some libraries, for better development.

You should just run `npm run dev` to run three command concurrently:
* server files: 
    All of ts and pug files will transpile to js with ts-loader will pack with webpack.These codes are server side codes.
* public files:
    Public files or client side code will pack with webpack and will transpile with babel-loader browser friendly js codes.So you feel free to write complex javascript codes.

* nodemon:
  This used to serve server side code but have some features, one of featuers is watch files.I love it.

## Test
Oooooppppssss!Sorry, No test cases available but you can write them and just run `npm test`, jest is always ready.
But I have some thing for you to work with server and function test, [postmane_collection](./postman_collection.json), All of required requests to work with this server is in this json file, if you are using postman, you can import it and use.

## License
*ISC*