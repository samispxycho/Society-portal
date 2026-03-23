import Image from "next/image";

export default function NotifyAdminPage() {
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

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <form
          action="/api/notify-admin"
          method="POST"
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl p-8 w-full max-w-md border border-white/20"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg">
              <span className="text-3xl">📩</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Contact Admin</h2>
            <p className="text-sm text-gray-600 mt-1">We'll get back to you soon</p>
          </div>

          <div className="space-y-4">
            <input name="name" placeholder="Your Name" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            <input name="email" type="email" placeholder="Email" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            <input name="phone" placeholder="Phone" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            <input name="title" placeholder="Title" className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            <textarea name="body" placeholder="Message" rows={4} className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md font-medium hover:cursor-pointer">
              Send Notification
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}