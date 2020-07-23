import * as restify from 'restify'
import {EventEmitter} from 'events'
export abstract class Router extends EventEmitter {
    abstract applyRoutes = (application : restify.Server) =>{
        return this.applyRoutes
    }
}/* 
export function render ( response : restify.Response,next: restify.Next){ 
    return (document : undefined) =>{
        if(document){
            response.json(document)
        }else{
            response.send(404)
        }
        return next()
    }
} */