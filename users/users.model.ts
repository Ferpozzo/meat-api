import { environment } from './../common/environment';
import mongoose from 'mongoose'
import { validateCPF } from '../common/validators'
import * as bcrypt from 'bcrypt'
export interface User extends mongoose.Document {
    name: string,
    email: string,
    password: string,
    age: number,
    gender: string,
    cpf: string
}

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxlength: 100,
        minlength: 3
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    },
    password: {
        type: String,
        select: false,
        required: true,
        minlength: 8
    },
    age: {
        type: Number,
        min: 12,
        required: false
    },
    gender: {
        type: String,
        required: false,
        enum: ['Masculino', 'Femenino', 'Outro']

    },
    cpf:{
        type : String,
        required: false,
        unique: true,
        validate:{
            validator: validateCPF,
            message:'{PATH}: Invalid CPF ({VALUE})'
        }
    }
})

export const User = mongoose.model<User>('User', userSchema)


userSchema.pre('save',function (next){
    const user = (this as User)
    if(!user.isModified('password')){
        next()
    }else{
        bcrypt.hash(user.password,environment.security.saltRounds)
        .then(hash =>{
            user.password = hash
            next()
        }).catch(next)
    }
})
/*
const users = [
    { id: '1', name: 'Peter Parker', email: 'peter@marvel.com' },
    { id: '2', name: 'Bruce Wayne', email: 'bruce@dc.com' },
    { id: '3', name: 'Hal Jordan', email: 'hal@dc.com' }
]

export class User {
    static findAll(): Promise<any[]> {
        return Promise.resolve(users)
    }
    static findById(id: string): Promise<any> {
        return new Promise(resolve => {
            const filtered = users.filter(user => user.id === id)
            let user = undefined
            if (filtered.length > 0) {
                user = filtered[0]
            }
            resolve(user)

        })
    }
} */