import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

function generateReceiptNumber() {
  return "RCP-" + Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if (!userCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = JSON.parse(userCookie.value);
    const flatId = user.flat_id;

    const payment = await pool.query(
      `SELECT amount, payment_mode, payment_date 
       FROM payments 
       WHERE flat_id=$1 
       ORDER BY payment_date DESC 
       LIMIT 1`,
      [flatId]
    );

    const p = payment.rows[0];

    const amount = p?.amount || 0;
    const method = p?.payment_mode || "N/A";
    const date = p?.payment_date
      ? new Date(p.payment_date).toLocaleDateString()
      : "N/A";

    const receiptNumber = generateReceiptNumber();
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    const csv = `"=========================================="
"                PAYMENT RECEIPT                "
"=========================================="
""
"RECEIPT NO: ${receiptNumber}"
"DATE: ${currentDate}"
"TIME: ${currentTime}"
""
"------------------------------------------"
"FLAT DETAILS"
"------------------------------------------"
"Flat ID: ${flatId}"
""
"------------------------------------------"
"PAYMENT DETAILS"
"------------------------------------------"
"Amount: ₹${amount.toLocaleString('en-IN')}"
"Payment Mode: ${method}"
"Payment Date: ${date}"
"Status: SUCCESS"
""
"------------------------------------------"
""
"Thank you for your payment!"
"This is a computer generated receipt, no signature required."
"=========================================="`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=receipt.csv`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}