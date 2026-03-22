import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {

  const { email, password } = await req.json();

  try {

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "Login successful",
      role: user.role
    });

    // store login session
    response.cookies.set(
      "user",
      JSON.stringify({
        id: user.id,
        role: user.role,
        flat_id: user.flat_id
      }),
      {
        httpOnly: true,
        path: "/"
      }
    );

    return response;

  } catch (error) {

    console.error("LOGIN ERROR:", error);

    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );

  }
}