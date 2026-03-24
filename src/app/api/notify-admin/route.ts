import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: Request) {
  const formData = await req.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const phone = formData.get("phone");
  const title = formData.get("title");
  const body = formData.get("body");

  const fullMessage = `
Name: ${name}
Email: ${email}
Phone: ${phone}

Message:
${body}
  `;

  await pool.query(
    `INSERT INTO notifications (title, message, flat_id, is_global, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [title, fullMessage, null, false]
  );

  return NextResponse.redirect(new URL("/guest-dashboard", req.url));
}