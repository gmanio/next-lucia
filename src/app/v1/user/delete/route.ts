import { NextResponse } from "next/server";

import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
import mysql from "mysql2/promise";

const pool = mysql.createPool(
  "mysql://root:!Wlakscjs87@152.67.202.155:3306/auth"
);

const adapter = new Mysql2Adapter(pool, {
  user: "user",
  session: "user_session",
});

// curl --request POST http://localhost:3000/v1/user/create

export async function DELETE(request: Request): Promise<Response> {
  console.log(adapter);
  return NextResponse.json({ data: "success" }, { status: 200 });
}
