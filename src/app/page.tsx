import Link from "next/link";
import Image from "next/image";

export default function Home(){
  return(
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      
      {/* Background Image with Next.js Image component */}
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

      {/* Main Card */}
      <div className="relative bg-white/90 backdrop-blur-xl p-10 rounded-2xl shadow-2xl w-96 text-center border border-white/30 transform transition-all duration-500 hover:scale-105 z-10">
        
        {/* Icon/Logo */}
        <div className="mb-6 flex justify-center">
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-4 rounded-full shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
          UrbanNest+
        </h1>
        <p className="text-gray-600 mb-8 text-sm">Your Gateway to Community Living</p>

        <div className="flex flex-col gap-4">
          
          {/* Resident Login Button */}
          <Link 
            href="/login" 
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-center block"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Resident Login
            </span>
          </Link>

          {/* Admin Login Button */}
          <Link 
            href="/admin-login" 
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-center block"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Admin Login
            </span>
          </Link>

        </div>

        <p className="text-xs text-gray-500 mt-8">
          Secure access for residents and administrators
        </p>
      </div>
      
    </div>
  )
}