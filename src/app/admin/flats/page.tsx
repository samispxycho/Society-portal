import pool from "@/lib/db";
import { Mail, Phone } from "lucide-react";
import AddFlatButton from "./AddFlatModel";
import DeleteFlatButton from "./DeleteFlatButton";

export default async function FlatsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {

  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  const limit = 7;
  const offset = (page - 1) * limit;

  const flats = await pool.query(`
    SELECT 
      f.id,
      f.flat_number,
      f.owner_name,
      f.email,
      f.phone,
      f.flat_type,
      COALESCE(m.status,'pending') as payment_status
    FROM flats f
    LEFT JOIN monthly_records m 
      ON f.id = m.flat_id 
      AND m.month = EXTRACT(MONTH FROM CURRENT_DATE) 
      AND m.year = EXTRACT(YEAR FROM CURRENT_DATE)
    ORDER BY f.flat_number
    LIMIT $1 OFFSET $2
  `, [limit, offset]);

  const flatsCount = await pool.query(
    `SELECT COUNT(*) as count FROM flats`
  );

  const totalRows = parseInt(flatsCount.rows[0].count);
  const totalPages = Math.ceil(totalRows / limit);

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
            <span className="text-green-600">Flats</span> Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage residency details and owner contact information.
          </p>
        </div>

        <div className="flex gap-3">
          <a
            href="/admin/check-flats"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg shadow-md"
          >
            Check Flats
          </a>

          <AddFlatButton />
        </div>

      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Flat No.</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Owner</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Contact Info</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Payment Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {flats.rows.map((flat: any) => (
                <tr key={flat.id} className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-bold text-green-700 bg-green-100 px-2 py-1 rounded">
                      {flat.flat_number}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-800">
                      {flat.owner_name}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1.5">
                        <Mail size={14} className="text-gray-400" />
                        {flat.email}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} className="text-gray-400" />
                        {flat.phone}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      {flat.flat_type}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    {flat.payment_status === "paid" ? (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                        Paid
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <DeleteFlatButton id={flat.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">

          <a
            href={`?page=${page - 1}`}
            className={`px-4 py-2 rounded-lg ${page === 1
              ? "bg-gray-200 text-gray-400 pointer-events-none"
              : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            Prev
          </a>

          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>

          <a
            href={`?page=${page + 1}`}
            className={`px-4 py-2 rounded-lg ${page === totalPages
              ? "bg-gray-200 text-gray-400 pointer-events-none"
              : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            Next
          </a>

        </div>

      </div>

    </div>
  );
}