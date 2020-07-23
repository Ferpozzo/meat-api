import * as restify from 'restify'

export const handleError = (request: restify.Request, response: restify.Response, erro : any, done: any) => {
    erro.toJSON = () => {
        return {
            message: erro.message
        }
    }
    done()
}