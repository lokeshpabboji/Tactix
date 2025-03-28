'use client'
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useState } from "react"
import { toast } from "sonner"
import { Loader } from 'lucide-react';


export default function Signin() {

    const [isLoading, setIsLoading] = useState(false);

    async function handleSignin(){
        try {
            setIsLoading(true);
            await signIn("google", {redirect : false})
            // TODO
            // toast.success("Authentication successfull")
        } catch (error) {
            toast.error("Authentication error", {
                description : "There was an error signing in. Please try again.",
            })
            console.error('Error signing in', error)
        } finally {
            setIsLoading(false);
        }
    }
    return ( 
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Card className="bg-gray-500 border-none">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome To Tactix</CardTitle>
                        <CardDescription className="text-muted-foreground">
                        {/* <CardDescription className="text-slate-300"> */}
                            Login with your Google account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="mb-6">
                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button 
                                    onClick={handleSignin} 
                                    variant="outline" 
                                    className="w-full" 
                                    disabled={isLoading}
                                    aria-label="Sign in with Google"
                                    >
                                    {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin"/> : <GoogleIcon className="mr-2 h-6 w-6"/>}
                                    Login with Google
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="text-orange-100 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                    By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                    and <a href="#">Privacy Policy</a>.
                </div>
            </div>
        </div>  
    )
}

function GoogleIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden="true" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
        </svg>
    )
  }