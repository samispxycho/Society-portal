export default function PaymentSuccess(){

  return(

    <div className="bg-gray-50 min-h-screen">

      <div className="max-w-2xl mx-auto p-8 space-y-8">

        {/* HEADER */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
            <span className="text-purple-600">Pay</span> Subscription
          </h1>
        </div>

        {/* CARD */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center space-y-4">

          <p className="text-green-600 font-semibold text-lg">
            ✅ Payment completed successfully
          </p>

          <p className="text-gray-500 text-sm">
            Your subscription has been updated. You can now continue using all services.
          </p>

          <a
            href="/dashboard"
            className="inline-block mt-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition shadow-sm font-medium"
          >
            Go to Dashboard
          </a>

        </div>

      </div>

    </div>

  )
}