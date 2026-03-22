import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { cookies } from "next/headers";

export async function GET(){

  try{

    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");

    if(!userCookie){
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userCookie.value);

    const result = await pool.query(
      `SELECT name, email, phone
       FROM users
       WHERE id = $1`,
      [user.id]
    );

    const admin = result.rows[0];

    return NextResponse.json({
      name: admin?.name || "",
      email: admin?.email || "",
      phone: admin?.phone || ""
    });

  }catch(error){

    console.error(error);

    return NextResponse.json(
      { message: "Error fetching profile" },
      { status: 500 }
    );
  }
}