import { WebSocketServer } from 'ws';
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  id : string,
  rooms : string[],
  ws : WebSocket
}

const users: User[] = [];

async function CheckUser(token) {
  const decoded = await jwt.verify(token, "JWT_SECRET_KEY");
  
  if(typeof decoded === 'string'){
    return null;
  }
  
  if(!decoded || !decoded.id){
    return null;
  }
  
  return decoded.userId;
}

wss.on('connection', async function connection(ws) {
  const url = req.url;
  
  if(!url){
    return;
  }
  
  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token  = queryParams.get("token")
  const userId = await CheckUser(token);
  
  if(userId == null){
    ws.close();
    return;
  }
  
  users.push({
    userId,
    rooms : [],
    ws : ws
  })
  
  
  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data as unknown as string);
    //parsedData = {type: "join-room", roomId: 1}
    
    if(parsedData.type == "join_room"){
      const user = users.find(x => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }
    
    if(parsedData.type == "leave_room"){
      const user = users.find(x => x.ws === ws);
      user?.rooms = user?.rooms.filter(x => x !== parsedData.roomId)
    }
    //parsedData = {type: "chat", roomId: 1, message:"hello" }
    if(parsedData.type == "chat"){
      const roomId = parsedData.roomId;
      const message = parsedData.message;
      
      prisma.chat.create({
        data : {
          message,
          roomId,
          userId
        }
      })
      
      const usersInRoom = users.filter(user => user.rooms.includes(roomId));
      
      usersInRoom.forEach(user => {
        user.ws.send(JSON.stringify(
          {
            type : "chat",
            message,
            roomId
          }
        ))
      })
    }
    
  });

  });