import cors from "cors"
import express from "express"
import {SignUpSchema, LoginSchema, CreateRoomSchema} from '@repo/common/types'
import {Request, Response} from 'express'
import {prisma} from "@repo/db/client"
import {jwt} from 'jsonwebtoken'
import { authMiddleware } from "./middleware.js"

const app = express();

app.use(cors())
app.use(express.json())

app.get('/',(req: Request, res: Response) => {
    res.json({
        message : "healthy"
    })
})

app.post('/signup',async (req: Request, res: Response) => {
    const parsedData = SignUpSchema.safeParse(req.body);

    console.log("parsed data: ",parsedData);

    if(!parsedData.success){
        res.json({
            message : "invalid input format"
        })
        return;
    }
    
   try{
        const user = await prisma.user.create({
            data : {
                email : parsedData.data?.email,
                username : parsedData.data?.username,
                password : parsedData.data?.password
            }
        })

        if(user){
            res.json({
                message : "signed up Successfully",
                user
            })
        }
   }
   catch(e){

        res.json({
            message : "Server error....try again later"
        })
   }

})

app.post('/signin',async (req : Request, res : Response) => {
    const parsedData = LoginSchema.safeParse(req.body);

    if(!parsedData.success){
        res.json({
            message : "invalid input format"
        })
        return;
    }
    
   try{
     
      const existingUser = await prisma.user.findFirst({
        where : {
          email : parsedData.data?.email,
        } 
      })
      
      if(existingUser){
        if(existingUser.password === parsedData.data?.password){
          
          const token = await jwt.sign({
            id : existingUser.id
          }, "JWT_SECRET_KEY")
          
          res.json({
            message : "signed in Successfully",
            token
          })
        }
        else{
          res.json({
            message : "invalid password"
          })
        }
        
      }
      else{
        res.json({
            message : "user not found"
        })
      }
     
   }
   catch(e){

        res.json({
            message : "Server error....try again later"
        })
   }

})

app.post('/room',authMiddleware, async(req : Request, res : Response) => {
  
  const parsedData = CreateRoomSchema.safeParse(req.body);
  
  if(!parsedData.success){
    res.json({
      message : "invalid room name"
    })
    return;
  }
  
  const room = await prisma.room.create({
    data : {
      slug : parsedData.data.name,
      adminId: req.userId;
    }
  })
  
    res.json({
        message : "room created",
        roomId : room.id
    })
})

app.get('/chats/:roomId',authMiddleware,async (req:Request,res: Response) => {
  const roomId = Number(req.params.roomId);
  
  const chats = await prisma.chat.findMany({
    where: {
      roomId
    },
    orderBy: {
      id: "desc"
    },
    take: 100
  })
  
  res.json({
    message : "chats fetched",
    chats : []
  })
})

app.get('/room/:slug', (req:Request ,res: Response) =>{
  const slug = req.params.slug;
  const room = await prisma.room.findFirst({
    where : {
      slug,
    }
  })

  res.json({
    room : room
  })
})

app.listen(4000,() => {
    console.log("server listening at port 4000")
})