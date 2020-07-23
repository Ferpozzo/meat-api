import { usersRouter } from './users/users.router';
import {Server} from './server/server'
const server : any = new Server()
server.bootstrap([usersRouter]).then((server: { application: { address: () => any } }) =>{
    console.log('Server is listening on: ',server.application.address())
}).catch((err: any) =>{
    console.log('Server failed to start.')
    console.error(err)
    process.exit(1)
})