import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";


if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.NEXTAUTH_SECRET) {
    throw new Error("Missing required environment variables for authentication.");
}


// TODO user validation

async function findOrCreateUser(name : string, email : string, image : string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if(user) return user;
        return await prisma.user.create({
            data : {
                name,
                email,
                profile : image
            }
        })
    } catch (error) {
        console.error("error : ", error)
        throw new Error("Failed to authenticate user.");
    }
}

export const authOptions : AuthOptions = {
    providers : [
        GoogleProvider({
            clientId : process.env.GOOGLE_CLIENT_ID || "",
            clientSecret : process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // console.log(`
            //     tokenemail=${token.email}
            //     tokenname=${token.name}
            //     tokenpicture=${token.picture}
            //     tokensub=${token.sub}

            //     accountAT=${account?.access_token}
            //     accountUserID=${account?.userId}
                
            //     profileemail=${profile?.email}
            //     profileimage=${profile?.image}
            //     profilename=${profile?.name}
            //     profilesub=${profile?.sub}

            //     ${user.email}
            //     ${user.id}
            //     ${user.image}
            //     ${user.name}
            //     `)
            try {
                if (user){
                    const dbUser = await findOrCreateUser(user.name || "",user.email || "",user.image || "")
                    token.id = dbUser.id;
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                    token.profile = dbUser.profile;
                }
                return token;
            } catch (error) {
                console.error("JWT callback error", error);
                return token;
            }
        },
        async session({ session, token }) {
            // console.log("hewlehofus")
            // console.log(session.user?.email);
            // console.log(session.user?.image);
            // console.log(session.user?.name);
            // console.log(token.email);
            // console.log(token.name);
            // console.log(token.picture);
            // console.log("hewlehofus")
            if(token){
                session.user.id = token.id
                session.user.name = token.name
                session.user.email = token.email
                session.user.profile = token.profile
            }
            return session;
        }
      },
    pages : {
        signIn : '/signin'
    },
    session : {
        strategy : "jwt",
        maxAge : 30 * 60,
    },
    secret : process.env.NEXTAUTH_SECRET
}