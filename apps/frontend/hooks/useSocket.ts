import { useEffect, useState } from "react"

export function useSocket(){
    const [socket,setSocket] = useState<WebSocket>()
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        const ws = new WebSocket(`${process.env.WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
                eyJ1c2VySWQiOiIxNDMzOTdjMy01OTNkLTQwMjctYjExNC0yOTAyNGJhYjAyMTgiLCJpYXQiOjE3MzY2OTczMzB9.
                BxDMP3FqBsM6TrZcAGYFRA2FlmazFwQJ78mOHskatiM`)
        
        ws.onopen = () => {
            setLoading(false)
            setSocket(ws)
        }

    },[])

    return {
        socket,
        loading
    }
}