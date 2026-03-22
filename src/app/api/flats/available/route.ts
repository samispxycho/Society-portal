import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(){

  const result = await pool.query(
    `SELECT flat_number, flat_type
     FROM flat_master
     WHERE is_occupied = false
     ORDER BY flat_number`
  );

  return NextResponse.json(result.rows);
}