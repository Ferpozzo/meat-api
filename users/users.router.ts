import { Router } from '../common/router'
import { User } from './../users/users.model';
import * as restify from 'restify'
class UsersRouter {
    applyRoutes (application: restify.Server) {
        application.get('/users', (request, response, next) => {
            User.find().then(users => {
                response.json(users)
            }).catch(next)
        })

        application.get('/users/:id', (request, response, next) => {
            User.findById(request.params.id).then(user => {
                if (user) {
                    console.log(user)
                    response.send(user)
                    return next()
                }
                response.send(404)
                return next()
            }).catch(next)
        })
        application.post('/users',(request,response,next)=>{
            let user = new User(request.body)
            user.save().then(user =>{
                response.json(user)
                return next()
            }).catch(next)
        })
        application.put('/users/:id',(request,response,next) =>{
            const options = {overwrite: true}
            User.update({_id: request.params.id}, request.body,options).exec().then(result =>{
                if(result.n){
                    return User.findById(request.params.id)
                }else{
                    response.send(404)
                }
            }).then(user =>{
                response.json(user)
                return next()
            }).catch(next)
        })
        application.patch('/users/:id',(request,response,next) =>{
            const options = {new : true}
            User.findByIdAndUpdate(request.params.id,request.body,options).then(user =>{
                if(user){
                    response.json(user)
                    return next()
                }
                response.send(404)
                next()
            }).catch(next)
        })
        application.del('/users/:id',(request,response,next) =>{
            User.deleteOne({_id: request.params.id}).exec().then(cmdResult =>{/* 
                console.log(`count : ${cmdResult.deletedCount} n : ${cmdResult.n} ok : ${cmdResult}`) */
                if(cmdResult.deletedCount === 1){
                    response.send(204)
                }else{
                    response.send(404)
                }
                return next()
            }).catch(next)
        })
    }
}

export const usersRouter = new UsersRouter();