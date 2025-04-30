import { NextResponse } from "next/server";

// import mysql from "mysql2/promise";
import { generateId } from "lucia";
import { AppDataSource, UserEntity } from "@/lib";
import { AdapterAccount, AdapterUser } from "next-auth/adapters";
import { TypeORMAdapter } from "@auth/typeorm-adapter";

// const pool = mysql.createPool(
//   "mysql://root:!Wlakscjs87@152.67.202.155:3306/auth"
// );

// const adapter = new Mysql2Adapter(pool, {
//   user: "user",
//   session: "user_session",
// });

// curl --request POST http://localhost:3000/v1/user/create

export async function POST(request: Request): Promise<Response> {
  const loggedInUser = await request.json();
  if (AppDataSource.isInitialized === false) {
    await AppDataSource.initialize();
  }

  const adapter = TypeORMAdapter(AppDataSource.manager.connection.options);

  const createUser: AdapterUser & { phoneVerified: null | Date } = {
    email: loggedInUser.kakao_account.email,
    emailVerified: null,
    id: generateId(15),
    phoneVerified: new Date(),
    name: loggedInUser.kakao_account.profile.nickname,
    image: loggedInUser.kakao_account.profile.thumbnail_image_url,
  };
  const user = await AppDataSource.createQueryBuilder()
    .insert()
    .into(UserEntity)
    .values({
      id: createUser.id,
      name: createUser.name,
      email: createUser.email,
      emailVerified: new Date().toISOString(),
      phone: null,
      phoneVerified: new Date().toISOString(),
      image: createUser.image,
      role: null,
    })
    .execute();

  console.log("inserted User");
  console.log(user);

  const account: AdapterAccount = {
    userId: createUser?.id ?? "",
    type: "email",
    provider: "kakao",
    providerAccountId: loggedInUser.id,
    access_token: "",
    token_type: "",
    id_token: "",
    refresh_token: "",
    scope: "",
  };

  const resp = await (adapter?.linkAccount && adapter.linkAccount(account));

  return NextResponse.json({ data: resp }, { status: 200 });
}
