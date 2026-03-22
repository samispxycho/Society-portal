import pool from "@/lib/db";

export default async function MonthlyRecords() {

  const records = await pool.query(
    `SELECT 
      m.id,
      m.flat_id,
      f.flat_number,
      f.flat_type,
      m.month,
      m.year,
      COALESCE(sp.amount,0) as amount,
      m.status
      FROM monthly_records m
      JOIN flats f ON m.flat_id = f.id
      LEFT JOIN subscription_plans sp 
      ON f.flat_type = sp.flat_type
      ORDER BY m.year DESC, m.month DESC`
  );

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const groupedRecords: any = {};

  records.rows.forEach((record: any) => {
    const key = `${record.month}-${record.year}`;

    if (!groupedRecords[key]) {
      groupedRecords[key] = [];
    }

    groupedRecords[key].push(record);
  });

  return (

    <div className="max-w-5xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          Monthly <span className="text-green-600">Records</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of monthly subscription payments.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-10">

        {Object.entries(groupedRecords).map(([key, records]: any) => {

          const [month, year] = key.split("-");
          const monthName = monthNames[parseInt(month) - 1];

          return (
            <div key={key} className="space-y-4">

              <h2 className="text-lg font-semibold text-gray-800">
                {monthName} {year}
              </h2>

              <div className="overflow-hidden rounded-lg border border-gray-200">

                <table className="w-full table-fixed">

                  <thead className="bg-gray-100 text-gray-700 text-sm">
                    <tr className="text-left">
                      <th className="py-3 px-4 w-1/3">Flat</th>
                      <th className="px-4 w-1/3">Amount</th>
                      <th className="px-4 w-1/3">Status</th>
                    </tr>
                  </thead>

                  <tbody>

                    {records.map((record: any) => (
                      <tr key={record.id} className="border-t">

                        <td className="py-3 px-4 font-medium text-gray-800">
                          {record.flat_number}
                        </td>

                        <td className="px-4 text-gray-700">
                          ₹ {record.amount}
                        </td>

                        <td className="px-4">

                          {record.status === "paid" ? (
                            <span className="text-green-600 font-semibold">
                              Paid
                            </span>
                          ) : (
                            <div className="flex items-center justify-between">

                              <span className="text-red-500 font-semibold">
                                Pending
                              </span>

                              <a
                                href={`/admin/payment-entry?flat_id=${record.flat_id}`}
                                className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                              >
                                Pay
                              </a>

                            </div>
                          )}

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>

            </div>
          );
        })}

      </div>

    </div>

  )
}