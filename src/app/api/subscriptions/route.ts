import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req:Request){

  const {id,amount} = await req.json();

  try{

    await pool.query(
      `UPDATE subscription_plans
       SET amount=$1
       WHERE id=$2`,
      [amount,id]
    );

    return NextResponse.json({
      message:"Subscription updated"
    });

  }catch(error){

    console.error(error);

    return NextResponse.json(
      {message:"Error updating subscription"},
      {status:500}
    );

  }
}