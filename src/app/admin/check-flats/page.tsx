import pool from "@/lib/db";

export default async function CheckFlats({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {

  const params = await searchParams;
  const page = parseInt(params?.page || "1", 10);

  // Get all blocks
  const blocksResult = await pool.query(
    `SELECT DISTINCT LEFT(flat_number,1) as block
     FROM flat_master
     ORDER BY block`
  );

  const blocks = blocksResult.rows.map((b:any)=>b.block);
  const totalPages = blocks.length;

  const currentBlock = blocks[page - 1];

  // Fetch flats of current block
  const flats = await pool.query(
    `SELECT flat_number, flat_type, is_occupied
     FROM flat_master
     WHERE LEFT(flat_number,1) = $1
     ORDER BY flat_number`,
    [currentBlock]
  );

  return(

    <div className="max-w-5xl mx-auto p-8 space-y-8 bg-gray-50 min-h-screen">

      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-800">
          All <span className="text-green-600">Flats</span>
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of flat occupancy status.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-10">

        <div className="space-y-4">

          <h2 className="text-lg font-semibold text-gray-800">
            Block {currentBlock}
          </h2>

          <div className="overflow-hidden rounded-lg border border-gray-200">

            <table className="w-full table-fixed border-collapse">

              <thead className="bg-gray-100 text-gray-700 text-sm">
                <tr className="text-center">
                  <th className="py-3 px-4 w-1/3">Flat</th>
                  <th className="px-4 w-1/3">Type</th>
                  <th className="px-4 w-1/3">Status</th>
                </tr>
              </thead>

              <tbody>

                {flats.rows.map((f:any,i:number)=>(
                  <tr key={i} className="border-t text-center">

                    <td className="py-3 px-4 font-medium text-gray-800 w-1/3">
                      {f.flat_number}
                    </td>

                    <td className="px-4 text-gray-700 w-1/3">
                      {f.flat_type}
                    </td>

                    <td className="px-4 w-1/3">
                      {f.is_occupied
                        ? <span className="text-red-500 font-semibold">Occupied</span>
                        : <span className="text-green-600 font-semibold">Available</span>}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

        {/* PAGINATION */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">

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
            Block {currentBlock} ({page} of {totalPages})
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
  )
}