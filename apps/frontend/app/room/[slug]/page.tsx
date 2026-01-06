
async function getRoomId(slug:string){
    const res = await axios.get(`BACKEND_URL/room/${slug}`)
    return res.data.id
}

export async function ChatRoom( params : {
    params : Promise<{slug : string}>;
}){
    const slug = (await params);
    const roomId = await getRoomId(slug)
    return (
        <ChatRoom  id={roomId} />
    )
}