"use client"

import { useSocket } from "@/hooks/useSocket"
import { useEffect, useState } from "react"

export function  ChatRoomClient({id,messages}:{
    id : number,
    messages : {message : string}[]
}){
    const {socket, loading} = useSocket()

    const [chats,setChats] = useState(messages)
    const [currentMessages,setCurrentMessages] = useState("")

    useEffect(() => {

        if(socket && !loading){
            socket.send(JSON.stringify({
                type : "join_room",
                roomId : id
            }));

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data);
                
                if(parsedData.type == 'chat'){
                   setChats(c => [
                    ...c,
                    {message : parsedData.message}
                   ])
                }
            }

        }
    },[socket, id, loading])

return (
    <div>
        {chats.map((m) => (
            <div> 
                m.message
            </div>
        ))}

        <input
            type="text"  
            value={currentMessages} 
            onChange={(e) => setCurrentMessages(e.target.value)} 
        />
        <button
            onClick={() => {
                socket?.send(JSON.stringify({
                    type : 'chat',
                    roomId : id,
                    message : currentMessages
                }))
            }}
        
        >
            send messages
        </button>
    </div>
)
}