import RoomCanvas from "@/components/RoomCanvas";
import initDraw from "@/draw/game";
import { useEffect, useRef } from "react"

export default function CanvasPage({params}: {params:{roomId : string}}){
    return (
        <RoomCanvas roomId={roomId} />
    )
}