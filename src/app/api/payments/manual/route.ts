import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {

  const data = await req.formData();

  const recordIdRaw = data.get("record_id");
  const flatIdFromAdminRaw = data.get("flat_id");

  const recordId = recordIdRaw ? Number(recordIdRaw) : null;
  const flatIdFromAdmin = flatIdFromAdminRaw ? Number(flatIdFromAdminRaw) : null;

  const paymentMode = (data.get("payment_mode") as string) || "upi";

  const client = await pool.connect();

  try {

    await client.query("BEGIN");

    let recordIdToUse;
    let flatId;
    let amount;

    if (recordId) {

      const recordRes = await client.query(
        `SELECT flat_id FROM monthly_records WHERE id=$1`,
        [recordId]
      );

      if (!recordRes.rows.length) {
        throw new Error("Record not found");
      }

      flatId = recordRes.rows[0].flat_id;
      recordIdToUse = recordId;

    } 
    else {

      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const recordRes = await client.query(
        `SELECT id FROM monthly_records
         WHERE flat_id=$1 AND month=$2 AND year=$3`,
        [flatIdFromAdmin, currentMonth, currentYear]
      );

      if (!recordRes.rows.length) {
        throw new Error("Monthly record not found");
      }

      recordIdToUse = recordRes.rows[0].id;
      flatId = flatIdFromAdmin;
    }

    const flatRes = await client.query(
      `SELECT flat_type FROM flats WHERE id=$1`,
      [flatId]
    );

    const flatType = flatRes.rows[0].flat_type;

    const planRes = await client.query(
      `SELECT amount FROM subscription_plans WHERE flat_type=$1`,
      [flatType]
    );

    amount = planRes.rows[0].amount;

    await client.query(
      `INSERT INTO payments
       (flat_id, monthly_record_id, amount, payment_mode, payment_date)
       VALUES ($1,$2,$3,$4,CURRENT_DATE)`,
      [flatId, recordIdToUse, amount, paymentMode]
    );

    await client.query(
      `UPDATE monthly_records
       SET status='paid', amount=$1
       WHERE id=$2`,
      [amount, recordIdToUse]
    );

    await client.query("COMMIT");

    const isResident = !!recordId;

    return NextResponse.redirect(
      new URL(
        isResident ? "/dashboard" : "/admin/dashboard",
        req.url
      )
    );

  } catch (error) {

    await client.query("ROLLBACK");

    console.error(error);

    return NextResponse.json(
      { message: "Payment failed" },
      { status: 500 }
    );

  } finally {
    client.release();
  }
}