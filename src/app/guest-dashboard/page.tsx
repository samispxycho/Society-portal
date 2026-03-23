import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import Link from "next/link";
import Image from "next/image";

export default async function GuestDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md mx-4">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Please login to view this page</p>
          <Link 
            href="/login" 
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const flats = [
    {
      type: "1 BHK",
      price: 12000,
      size: "500 sq.ft",
      bedrooms: 1,
      bathrooms: 1,
      features: ["Cozy Living Room", "Modern Kitchen", "Balcony"],
      icon: "🏠",
      gradient: "from-blue-500/90 to-blue-600/90",
      bgLight: "bg-white/90",
      borderLight: "border-white/20"
    },
    {
      type: "2 BHK",
      price: 16000,
      size: "750 sq.ft",
      bedrooms: 2,
      bathrooms: 2,
      features: ["Spacious Hall", "Modular Kitchen", "Balcony", "Store Room"],
      icon: "🏘️",
      gradient: "from-purple-500/90 to-purple-600/90",
      bgLight: "bg-white/90",
      borderLight: "border-white/20"
    },
    {
      type: "3 BHK",
      price: 18000,
      size: "1000 sq.ft",
      bedrooms: 3,
      bathrooms: 2,
      features: ["Master Bedroom", "Large Living Area", "Modern Kitchen", "2 Balconies", "Study Room"],
      icon: "🏢",
      gradient: "from-green-500/90 to-green-600/90",
      bgLight: "bg-white/90",
      borderLight: "border-white/20"
    }
  ];

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/society-background.jpg"
          alt="Background"
          fill
          className="object-cover blur-sm scale-105"
          priority
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-2 bg-white/20 backdrop-blur-md rounded-full mb-4 shadow-lg border border-white/30">
            <span className="text-3xl">🏢</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome, <span className="bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent">
              {session.user?.name || "Guest"}
            </span>
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto bg-black/20 backdrop-blur-sm px-6 py-2 rounded-full inline-block">
            Explore our available flats and find your perfect home
          </p>
        </div>

        <div className="mb-10">
          <div className="bg-yellow-500/90 backdrop-blur-sm border-l-4 border-yellow-700 rounded-lg p-4 shadow-lg">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-900" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-yellow-900">
                  📢 Important Information
                </p>
                <p className="text-sm text-yellow-900 mt-1">
                  Please contact the admin for residency purposes. They will guide you through the application process and help you choose the perfect flat.
                </p>
              </div>
              <div className="flex-shrink-0">
                <Link
                  href="/guest/notify-admin"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md text-sm font-medium"
                >
                  📩 Contact Admin
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {flats.map((flat, index) => (
            <div 
              key={index} 
              className={`${flat.bgLight} backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border ${flat.borderLight}`}
            >
              <div className={`bg-gradient-to-r ${flat.gradient} p-6 text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-4xl mb-2">{flat.icon}</div>
                    <h3 className="text-2xl font-bold">{flat.type}</h3>
                    <p className="text-white/80 text-sm mt-1">{flat.size}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">₹{flat.price}</p>
                    <p className="text-white/80 text-xs">per month</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="text-center flex-1">
                    <div className="text-2xl mb-1">🛏️</div>
                    <p className="text-sm font-semibold text-gray-700">{flat.bedrooms} Bedroom{flat.bedrooms > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-center flex-1 border-x border-gray-200">
                    <div className="text-2xl mb-1">🚿</div>
                    <p className="text-sm font-semibold text-gray-700">{flat.bathrooms} Bathroom{flat.bathrooms > 1 ? 's' : ''}</p>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-2xl mb-1">📏</div>
                    <p className="text-sm font-semibold text-gray-700">{flat.size}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">Key Features:</p>
                  <div className="space-y-2">
                    {flat.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-3">📍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Prime Location</h3>
            <p className="text-gray-600 text-sm">Located in the heart of the city with easy access to schools, hospitals, and shopping centers.</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">24/7 Security</h3>
            <p className="text-gray-600 text-sm">CCTV surveillance and professional security guards ensuring your safety round the clock.</p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-300">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Modern Amenities</h3>
            <p className="text-gray-600 text-sm">Power backup, high-speed internet ready, and modern fixtures in every flat.</p>
          </div>
        </div>

      </div>
    </div>
  );
}