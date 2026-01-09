"use client"

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";


export default function Home() {
  const [roomId, setRoomId] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter();

  useEffect(() => {
    inputRef?.current?.focus()
  },[])

  function handler(){
    if(!roomId) return;
    router.push(`/room/${roomId}`)
  }

  return(
    <div className="bg-neutral-900 p-4 h-screen w-screen text-neutral-100">
        <h1 className="text-2xl">Join/Create new Rooms</h1>
        <input 
          ref={inputRef}
          type="text" 
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter RoomId" 
          className="border border-neutral-700 mr-6 text-start p-1 mt-6  rounded-md"
          />
        <button
          onClick={handler}
          className="px-2 py-1 text-sm text-neutral-900 border border-neutral-400 drop-shadow-xl cursor-pointer  bg-neutral-300 hover:bg-neutral-200 rounded-lg"
        >
          Enter room
        </button>


    </div>
  )
}
