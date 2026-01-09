
import { WS_URL } from '@/app/config';
import React, { useEffect, useState } from 'react'
import Canvas from './Canvas';

const RoomCanvas = ({roomId}: {roomId : string}) => {
    const [socket,setSocket] = useState<WebSocket>();

    useEffect(() => {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
            eyJ1c2VySWQiOiI4NGRlMzU1My0yNThmLTQ3YmMtODdlYy1iYTI5MWIwODg0YmEiLCJpYXQiOjE3MzcyMTczMjF9.
            b2Q3B-RUDAV0equhOjET7Hyl1AQaBf1FW4szk6mvGxU`)

            ws.onopen = () => {
                setSocket(ws);

                const data = JSON.stringify({
                    type : "join_room",
                    roomId
                });

                ws.send(data);
            }

    },[socket,roomId])

    if(!socket){
        return <div> connecting to server....</div>
    }

    return (
        <Canvas socket={socket} roomId={roomId} />
    )
}

export default RoomCanvas