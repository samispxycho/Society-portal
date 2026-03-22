import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {

  const { id } = await req.json();

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    // 🔥 0️⃣ Get flat_number before deleting
    const flatRes = await client.query(
      `SELECT flat_number FROM flats WHERE id = $1`,
      [id]
    );

    if (!flatRes.rows.length) {
      throw new Error("Flat not found");
    }

    const flatNumber = flatRes.rows[0].flat_number;

    // 1️⃣ Delete payments
    await client.query(
      `DELETE FROM payments WHERE flat_id = $1`,
      [id]
    );

    // 2️⃣ Delete monthly records
    await client.query(
      `DELETE FROM monthly_records WHERE flat_id = $1`,
      [id]
    );

    // 3️⃣ Delete resident user
    await client.query(
      `DELETE FROM users WHERE flat_id = $1`,
      [id]
    );

    // 4️⃣ Delete flat
    await client.query(
      `DELETE FROM flats WHERE id = $1`,
      [id]
    );

    // 🔥 5️⃣ VERY IMPORTANT → make flat available again
    await client.query(
      `UPDATE flat_master
       SET is_occupied = false
       WHERE flat_number = $1`,
      [flatNumber]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      message: "Flat and all related records deleted successfully"
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    return NextResponse.json(
      { message: "Error deleting flat" },
      { status: 500 }
    );

  } finally {

    client.release();

  }

}