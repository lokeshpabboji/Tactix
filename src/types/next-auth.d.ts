import 'next-auth' 
import { DefaultSession } from 'next-auth'

declare module "next-auth" {
    interface Session {
        user : {
            id?: number,
            name?: string
            email?: string,
            profile?: string,
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: number,
        name?: string,
        email?: string,
        profile?: string,
    }
}