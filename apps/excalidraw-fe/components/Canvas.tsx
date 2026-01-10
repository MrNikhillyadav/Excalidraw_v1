
import {initDraw} from "@/draw";
import { useEffect, useRef, useState } from "react"
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { IconButton } from "./IconButton";
import { Game } from "@/draw/game";

export type Tool = "pencil"|"rect"| "circle";

export default function Canvas({roomId, socket}: {
    roomId : string,
    socket : WebSocket
}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool,setSelectedTool] = useState<Tool>('rect')
    const [game,setGame] = useState<Game>()

    useEffect(() => {
        game?.setTool(selectedTool);
    },[selectedTool,game])

    useEffect(() => {
       const canvas = canvasRef.current;
       if(canvasRef.current){
            // initDraw(canvasRef.current,roomId,socket);  // Basic approach
            var g = new Game(canvasRef.current,roomId,socket)
            setGame(g);
       }
       return () => {
            g.destroy()
       }
       
    },[canvasRef])

    return (
        <div style={{height:"100vh", overflow:"hidden"}}>
            <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}  />
            <TopBar  selectedTool={selectedTool} setSelectedTool={setSelectedTool} />
        </div>
    )
}

function TopBar({selectedTool,setSelectedTool}: {selectedTool : Tool, setSelectedTool : (s:Tool) => void}){
    return <div style={{
            position: "fixed",
            top: 10,
            left: 10
        }}>
            <div className="flex gap-t">
                <IconButton 
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />

                <IconButton onClick={() => {
                    setSelectedTool("rect")
                    }} 
                    activated={selectedTool === "rect"} 
                    icon={<RectangleHorizontalIcon />} >
                </IconButton>

                <IconButton onClick={() => {
                    setSelectedTool("circle")
                    }}
                     activated={selectedTool === "circle"} 
                     icon={<Circle />}>
                </IconButton>
            </div>
        </div>
}