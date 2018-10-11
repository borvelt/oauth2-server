import * as express from 'express'
import { Oauth2Error } from './oauth2/errors/Errors'
import routes from './routes'
import Models from './utils/compileModels'
import { Connection } from './utils/mongoose.odm'

/*
 * Path module is used for handling and transforming file paths.
 * */
import * as assert from 'assert'
import * as bodyParser from 'body-parser'
import * as cookieParser from 'cookie-parser'
import * as logger from 'morgan'

const a = 20
/*
 * Establish a database connection.
 * */
Connection.establish()
/*
 * Compile models, all of models should compile just one time.
 * */
// import './utils/compileModels'
/*
 * Express Start!
 * */
const app = express()
/*
* Use Static path.
* */
app.use(express.static('dist/public'))
/*
 * Set Pug template engine, (jade renamed to pug.)
 * */
// app.set('view engine', 'pug')

/*
 * Here we have some hooks, this modules run before every thing happening.
 * */
app.use(logger('dev'))
/*
 * this Hook, Check Request body to be JSON.
 * */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
/*
 * Check Request Cookies.
 * */
app.use(cookieParser())
/*
 * Load Oauth2 errors from database;
 * in Oauth2Error Class we search in results
 * */
Models.Error.find((error, result) => {
  app.set('Oauth2Error', new Oauth2Error(result))
})

/*
 * "/" is application urls start point
 * here is main branch in route file we have more path.
 * All Responses have "X-Frame-Options" header
 * This header prevent ClickJacking Attack.
 * */
app.use(
  '/',
  (request, response, next: () => void) => {
    response.header('X-Frame-Options', 'SAMEORIGIN')
    next()
  },
  routes,
)

// set html files address
// app.set('views', __dirname + '/views')
/*
 * this hook use for handle 404,
 * express js catch this if nobody handle the Request object
 * */
app.use((req: express.Request, res: express.Response, next: (e) => void) => {
  const err: any = new Error('Not Found')
  err.status = 404
  next(err)
})
/*
 * this try/catch for handle rendering errors.
 * for example when application is in development mode we shouldn't describe errors.
 * */
try {
  assert.equal(
    app.get('env'),
    'development',
    'Application Is Not In Development Mode',
  )
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: () => void,
    ) => {
      res.status(err.status || 500)
      res.json({
        message: err.message,
        error: err,
      })
    },
  )
} catch (e) {
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: () => void,
    ) => {
      res.status(err.status || 500)
      res.json({
        message: err.message,
        error: {},
      })
    },
  )
}

/*
 * export default app variable to use in bin/www
 * */
export default app
