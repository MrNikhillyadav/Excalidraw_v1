"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AuthPage({ isSignin }: {
  isSignin: boolean
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter()

    return <div className="w-screen h-screen flex justify-center items-center">
        <div className="p-6 m-2 bg-white rounded">
            <div className="p-2">
                <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
            </div>
            <div className="p-2">
                <input type="text" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
            </div>

            <div className="pt-2">
                <button className="bg-red-200 rounded p-2" onClick={async () => {
                  if(isSignin) {
                    const response = await fetch("/signin", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ email, password }),
                    });
                    if(response.ok) {
                      router.push('/')
                      await response.json().then(data => {
                        localStorage.setItem('token', data.token);
                      });
                    } else {
                      alert('Invalid email or password')
                    }
                  } else {
                    const response = await fetch("/signup", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({ email, password }),
                    });
                    if(response.ok) {
                      router.push('/')
                    } else {
                      alert('try again later')
                    }
                  }
                }}>{isSignin ? "Sign in" : "Sign up"}</button>
            </div>
        </div>
    </div>

}