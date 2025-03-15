'use client'
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { toast } from "sonner";
import { BoardOrientation, Piece, Square } from 'react-chessboard/dist/chessboard/types';

export default function Page() {
    const param = useParams()
    const roomId = param.roomId as string;
    const socketRef = useRef<Socket | null>(null);
    const chessRef = useRef<Chess>(new Chess());
    const [fen, setFen] = useState(chessRef.current.fen())
    const [orientation, setOrientation] = useState<BoardOrientation>('white')

    function makeAMove(move : {from : string, to : string, promotion ?: string }){
        const game = chessRef.current
        const {from, to, promotion} = move
        const result = game.move(move);
        if(result){
            setFen(game.fen())
            socketRef.current?.emit("move", {roomId, from, to, promotion})
        } else {
            toast.error("Invalid move");
        }
        return result;
    }

    function onDrop(sourceSquare : Square, targetSquare: Square, piece : Piece) : boolean {
        if((chessRef.current.turn() !== piece.charAt(0)) || orientation.charAt(0) !== piece.charAt(0)){
            return false;
        }
        const move = makeAMove({
            from: sourceSquare,
            to : targetSquare,
            promotion : 'q'
        })
        return move !== null
    }

    useEffect(() => {

        if (!roomId || typeof roomId !== "string") {
            toast.error("Invalid room ID");
            return;
        }

        socketRef.current = io("http://192.168.1.2:4000")

        socketRef.current.on('connect', () => {
            console.log(`Socket connected on client ${socketRef.current?.id}`);
        });

        socketRef.current.on("connect_error", (err) => {
            toast.error(`Connection error: ${err.message}`);
        });

        socketRef.current.emit("joinGame", roomId)

        socketRef.current.on("gameState", (data) => {
            const {pgn, fen} = data;
            chessRef.current.loadPgn(pgn)
            setFen(fen)
            console.log("in game state on")
            console.log("pgn : ", pgn)
            console.log("fen : ", fen);
            console.log("history from chessRef : " , chessRef.current.history())
        })

        socketRef.current.on("playerColor", (color) => {
            setOrientation(color)
        })

        socketRef.current.on("error", ({message}) => {
            toast.error(`${message}`)
        })

        socketRef.current.on("InvalidMove", ({message}) => {
            toast.error(`${message}`)
        })

        socketRef.current.on("gameOver", (result) => {
            toast.success(result)
        })

        socketRef.current.on('disconnect', () => {
            console.log('Socket disconnected on client');
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    },[roomId])
 
    return (
        <div>
            <Chessboard boardWidth={350}
                position={fen}
                onPieceDrop={onDrop}
                boardOrientation={orientation}/>
        </div>
    )
}