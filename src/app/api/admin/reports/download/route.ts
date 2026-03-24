import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(){

  try{

    const result = await pool.query(`
      SELECT 
        EXTRACT(MONTH FROM payment_date) as month,
        SUM(amount) as total
      FROM payments
      WHERE EXTRACT(MONTH FROM payment_date) IN (1,2,3)
      GROUP BY month
      ORDER BY month
    `);


    let jan = 0, feb = 0, mar = 0;

    result.rows.forEach((row:any)=>{
      if(row.month == 1) jan = row.total;
      if(row.month == 2) feb = row.total;
      if(row.month == 3) mar = row.total;
    });

    const total = Number(jan) + Number(feb) + Number(mar);

    const csv = `
    Month,Amount
    January,${jan}
    February,${feb}
    March,${mar}
    Total,${total}
    `;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=report.csv"
      }
    });

  }catch(error){

    return NextResponse.json(
      { message: "Error generating report" },
      { status: 500 }
    );

  }
}