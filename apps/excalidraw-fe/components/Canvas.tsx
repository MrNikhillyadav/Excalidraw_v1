
import {initDraw} from "@/draw/game";
import { useEffect, useRef } from "react"

export default function Canvas({roomId, socket}: {
    roomId : string,
    socket : WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
       const canvas = canvasRef.current;
       if(canvasRef.current){
           initDraw(canvasRef.current,roomId,socket); 
       }
       
    },[canvasRef])

    return (
        <canvas ref={canvasRef} width={2000} height={1000}  />
    )
}