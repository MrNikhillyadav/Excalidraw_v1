import ChatRoom from "@/components/ChatRoom";
import axios from "axios";

async function getRoomId(slug:string){
    const res = await axios.get(`BACKEND_URL/room/${slug}`)
    return Number(await res.data.id)
}

export async function ChatRoomPage( params : {
    params : Promise<{slug : string}>;
}){
    const {slug} = (await params);
    const roomId = await getRoomId(slug)
    return (
        <ChatRoom  id={roomId} />
    )
}