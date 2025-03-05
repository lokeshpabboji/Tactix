import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

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
            if (user){
                // Check if the user exists in your database
                const oldUser = await prisma.user.findUnique({
                    where: { email: user.email || ""},
                });

                if (!oldUser) {
                    // Create a new user if they don't exist
                    const newUser = await prisma.user.create({
                        data: {
                            name: user?.name || "",
                            email: user?.email || "",
                            profile: user?.image || "",
                            // Add other user details as needed
                        },
                    });
                    token.id = newUser.id;
                    token.name = newUser.name;
                    token.email = newUser.email;
                    token.profile = newUser.profile
                }else {
                    token.id = oldUser.id;
                    token.name = oldUser.name;
                    token.email = oldUser.email;
                    token.profile = oldUser.profile;
                }
            }
            return token;
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
        strategy : "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET
}