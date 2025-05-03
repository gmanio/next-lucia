import { NextResponse } from "next/server";

// import mysql from "mysql2/promise";
import { generateId } from "lucia";
import { AppDataSource, UserEntity } from "@/lib";
import { AdapterAccount, AdapterUser } from "next-auth/adapters";
import { TypeORMAdapter } from "@auth/typeorm-adapter";
import { KakaoUser } from "@/@types";
import JWT from "jsonwebtoken";

// const pool = mysql.createPool(
//   "mysql://root:!Wlakscjs87@152.67.202.155:3306/auth"
// );

// const adapter = new Mysql2Adapter(pool, {
//   user: "user",
//   session: "user_session",
// });

// curl --request POST http://localhost:3000/v1/user/create

export async function POST(request: Request): Promise<Response> {
  const loggedInUser: KakaoUser = await request.json();
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
      role: "R",
    })
    .execute();

  // console.log("inserted User");
  // console.log(user);

  const access_token = JWT.sign({ email: createUser.email }, createUser.id, {
    expiresIn: "1d",
  });
  const refresh_token = JWT.sign({}, createUser.id, {
    expiresIn: "10d",
  });

  const account: AdapterAccount = {
    userId: createUser?.id ?? "",
    type: "email",
    provider: "kakao",
    providerAccountId: loggedInUser.id.toString(),
    access_token: access_token,
    refresh_token: refresh_token,
  };

  const resp = await (adapter?.linkAccount && adapter.linkAccount(account));

  return NextResponse.json({ user, account }, { status: 200 });
}
