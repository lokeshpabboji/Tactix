'use client'

import {v4 as uuidV4} from 'uuid';
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Shuffle, Handshake } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { useState } from "react";
import { toast } from "sonner";
import { Chessboard } from 'react-chessboard'

export default function Page() {
    const [time, setTime] = useState([10]);
    const [gameURL, setGameURL] = useState("")
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(gameURL);
        toast.success("URL copied successfully")
    }

    const createRoom = () => {
        const myuuid = uuidV4();
        const baseUrl = `${window.location.protocol}//${window.location.host}`
        setGameURL(`${baseUrl}/room/${myuuid}`)
    }

    return (
        <div className='grid grid-cols-1 gap-36 mt-4 px-6 xl:grid-cols-2'>
            <div>
                <Chessboard
                    position={'start'} // Use 'start' or a custom FEN
                    boardWidth={400} // Adjust the width as needed
                    areArrowsAllowed={false}
                    arePiecesDraggable={false}
                    showBoardNotation={true} // Optionally show coordinates
                    animationDuration={0} // Disable animations for instant rendering
                />
            </div>
            <div className="flex flex-col justify-center items-center">
                <Tabs defaultValue="account" className="w-[400px]">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="account"><Handshake size={16} className="mr-1"/>Friends</TabsTrigger>
                        <TabsTrigger value="password"><Shuffle size={16} className="mr-1"/>Random</TabsTrigger>
                    </TabsList>
                    <TabsContent value="account">
                        <Card>
                            <CardHeader>
                                <CardTitle>Play with friends</CardTitle>
                                <CardDescription>
                                    Create a room and play chess with your friends.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <p className="text-xl text-cyan-700 font-medium">Select your time control</p>
                                <Slider value={time} max={30} step={1} min={3} onValueChange={setTime} />
                                <div>{time} min</div>
                            </CardContent>
                            <CardFooter>
                                <Button>Start Playing</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="password">
                        <Card>
                            <CardHeader>
                                <CardTitle>Play with Random</CardTitle>
                                <CardDescription>
                                    Get matched with a random player and begin a new chess game instantly.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {/* <p className="text-xl text-cyan-700 font-medium">Select your time control</p>
                                <Slider value={time} max={30} step={1} min={3} onValueChange={setTime} />
                                <div>{time} min</div> */}
                                <div className="space-y-1">
                                    <Label htmlFor="gamelink">Game Link</Label>
                                    <div className='flex items-center'>
                                        <Input id="gamelink" value={gameURL} disabled className='input input-bordered w-full p-2 mr-2'/>
                                        <Button onClick={copyToClipboard}>Copy</Button>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={createRoom}>Create Room</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

