/* import { mergePatchBodyParser } from './merge-patch.parser'; */
import * as restify from 'restify'
import mongoose from 'mongoose'
import { Router } from '../common/router'
import { environment } from './../common/environment';
import {handleError} from '../server/error.handler'
export class Server {

    application: restify.Server;
    initializeDb(){
        mongoose.Promise = global.Promise
        return mongoose.connect(environment.db.url,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true    
        })
    }
    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                })
                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())

                for (const router of routers) {
                    router.applyRoutes(this.application)
                }
                this.application.listen(environment.server.port, () => {
                    resolve(this.application)
                    this.application.on('error',handleError)
                    
                    this.application.get('/info', [
                        (request, response, next) => {
                            if (request.userAgent() && request.userAgent().includes('MSIE 7.0')) {
                                // response.status(400)
                                // response.json({message: 'Por favor atualize seu navegador!'})
                                let error: any = new Error()
                                error.statusCode = 400
                                error.message = 'Por favor atualize seu navegador!'
                                return next(error)
                            }
                            return next()

                        }, (request, response, next) => {
                            response.json({
                                browser: request.userAgent(),
                                method: request.method,
                                url: request.url,
                                path: request.path(),
                                query: request.query
                            })
                            return next();
                        }]);
                })

            } catch (error) {
                reject(error)
            }
        })
    }
    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initializeDb().then(() =>
            this.initRoutes(routers).then(() => this)
        )
    }
}