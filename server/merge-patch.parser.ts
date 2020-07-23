import restify from 'restify'

const mpContentType = 'application/merge-patch+json'

export const mergePatchBodyParser = (request: restify.Request, response: restify.Response, next: restify.Next) => {
    if (request.getContentType() === mpContentType && request.method === 'PATCH') {
        (<any>request).rawBody = request.body
        try {
            request.body = JSON.parse(request.body)
        } catch (e) {
            return next(new Error(`Invalid Content:${e.message}`))
        }
    }
    return next()
}