import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {

  const { flat_number, owner_name, email, phone, flat_type } = await req.json();

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    const flatResult = await client.query(
      `INSERT INTO flats (flat_number, owner_name, email, phone, flat_type)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id`,
      [flat_number, owner_name, email, phone, flat_type]
    );

    const flatId = flatResult.rows[0].id;

    await client.query(
      `UPDATE flat_master
       SET is_occupied = true
       WHERE flat_number = $1`,
      [flat_number]
    );

    const planRes = await client.query(
      `SELECT amount FROM subscription_plans WHERE flat_type=$1`,
      [flat_type]
    );

    const amount = planRes.rows[0]?.amount || 0;

    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    await client.query(
      `INSERT INTO monthly_records (flat_id, month, year, amount, status)
       VALUES ($1,$2,$3,$4,'pending')`,
      [flatId, month, year, amount]
    );

    await client.query(
      `INSERT INTO users (name, email, phone, password, role, flat_id)
       VALUES ($1,$2,$3,$4,$5,$6)`,
      [
        owner_name,
        email,
        phone,
        "123456",  
        "resident",
        flatId
      ]
    );

    await client.query("COMMIT");

    return NextResponse.json({
      message: "Flat, user and monthly record created"
    });

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    return NextResponse.json(
      { message: "Error adding flat" },
      { status: 500 }
    );

  } finally {

    client.release();

  }

}