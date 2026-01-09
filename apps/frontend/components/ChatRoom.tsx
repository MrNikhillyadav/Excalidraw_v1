import axios from "axios";
import { ChatRoomClient } from "./ChatRoomClient";

async function getChats(id:number){
    const res = await axios.get(`BACKEND_URL/chats/${id}`);
    return res.data.message;
}

export default async function ChatRoom(id : number) {
   const messages = await getChats(id)
return (
    <ChatRoomClient  id={id} messages={messages} />
)}