import { NextResponse } from "next/server";

// import { Mysql2Adapter } from "@lucia-auth/adapter-mysql";
// import mysql from "mysql2/promise";
import { AccountEntity, AppDataSource, UserEntity } from "@/lib";

// const pool = mysql.createPool(
//   "mysql://root:!Wlakscjs87@152.67.202.155:3306/auth"
// );

// const adapter = new Mysql2Adapter(pool, {
//   user: "user",
//   session: "user_session",
// });

// curl --request DELETE http://localhost:3001/v1/user/gman@kakao.com/delete

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ email: string }> }
): Promise<Response> {
  // const loggedInUser = await request.json();
  const { email } = await params; // 'a', 'b', or 'c'
  if (AppDataSource.isInitialized === false) {
    await AppDataSource.initialize();
  }

  // const adapter = TypeORMAdapter(AppDataSource.manager.connection.options);
  const userRepository = AppDataSource.getRepository(UserEntity);
  const accountRepository = AppDataSource.getRepository(AccountEntity);
  const userToRemove = await userRepository.findOneBy({
    email: email,
  });

  if (userToRemove) {
    const accounts = await accountRepository.find({
      where: { userId: userToRemove.id },
    });
    accounts.forEach(async (account) => {
      await accountRepository.remove(account);
    });
    // await accountRepository.remove(accounts);
    await userRepository.remove(userToRemove);
    // await accountRepository.remove(userToRemove.accounts);
    // await userRepository.remove(userToRemove);
  }

  return NextResponse.json({ data: "success" }, { status: 200 });
}
// https://velog.io/@wndbsgkr/TypeOrm%EC%9D%98-%EC%9E%90%EB%8F%99-%EB%82%A0%EC%A7%9C-%EC%83%9D%EC%84%B1-%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0%EB%8A%94-%EB%AC%B4%EC%8A%A8-%EC%9C%A0%ED%98%95%EC%9D%BC%EA%B9%8C
