"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";

export default function LoginPage(){

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  const handleLogin = async (e:any) => {

    e.preventDefault();

    const res = await fetch("/api/login",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        email,
        password
      })
    });

    const data = await res.json();

    if(data.role === "resident"){
      window.location.href = "/dashboard";
    }

    if(data.role === "admin"){
      window.location.href = "/admin/dashboard";
    }

  };

  return(

    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      
      <div className="absolute inset-0">
        <Image
          src="/images/society-background.jpg"
          alt="Society Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      <div className="relative bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-96 border border-white/30 transform transition-all duration-500 z-10">
        
        <Link 
          href="/" 
          className="absolute top-4 left-4 text-gray-500 hover:text-purple-600 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
        </Link>

        <div className="mb-6 flex justify-center">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-full shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Resident Login
        </h1>

        <p className="text-gray-500 text-center text-sm mb-8">
          Welcome back! Please login to your account
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
            </svg>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V6a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <input
              type="password"
              placeholder="Password"
              className="w-full border border-gray-300 p-3 pl-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium hover:cursor-pointer"
          >
            Login
          </button>

          <button
            type="button"
            onClick={() => signIn("google")}
            className="bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium hover:cursor-pointer"
          >
            Sign in with Google
          </button>

        </form>

      </div>

    </div>

  );
}