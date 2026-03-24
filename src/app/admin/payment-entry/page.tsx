import pool from "@/lib/db";

export default async function PaymentEntry(){

  const flats = await pool.query(
    `SELECT f.id, f.flat_number
     FROM flats f
     JOIN monthly_records m 
       ON f.id = m.flat_id
     WHERE m.status = 'pending'
       AND m.month = EXTRACT(MONTH FROM CURRENT_DATE)
       AND m.year = EXTRACT(YEAR FROM CURRENT_DATE)
     ORDER BY f.flat_number`
  );

  return(

    <div className="max-w-5xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      
      <div className="max-w-xl mx-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          <span className="text-green-600">Manual</span> Payment Entry
        </h1>
        <p className="text-gray-500 mt-1">
          Record pending payments quickly and securely.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-6 max-w-xl mx-auto">

        <form
          action="/api/payments/manual"
          method="POST"
          className="space-y-6"
        >

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Select Flat
            </label>

            <select
              name="flat_id"
              defaultValue=""
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition"
            >
              <option value="" disabled>
              Pending flats
              </option>

              {flats.rows.length === 0 ? (
                <option disabled>No pending flats</option>
              ) : (
                flats.rows.map((flat:any)=>(
                  <option key={flat.id} value={flat.id}>
                    {flat.flat_number}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Payment Mode
            </label>

            <select
              name="payment_mode"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 outline-none transition"
            >
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
            </select>
          </div>
          
          <div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition shadow-sm font-medium w-full hover:cursor-pointer">
              Record Payment
            </button>
          </div>

        </form>

      </div>

    </div>

  )
}