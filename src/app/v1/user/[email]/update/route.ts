import { NextResponse } from "next/server";
import { AccountEntity, AppDataSource, UserEntity } from "@/lib";

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
  const userToUpdate = await userRepository.findOneBy({
    email: email,
  });

  if (userToUpdate) {
  }

  return NextResponse.json({ data: "success" }, { status: 200 });
}
// https://velog.io/@wndbsgkr/TypeOrm%EC%9D%98-%EC%9E%90%EB%8F%99-%EB%82%A0%EC%A7%9C-%EC%83%9D%EC%84%B1-%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0%EB%8A%94-%EB%AC%B4%EC%8A%A8-%EC%9C%A0%ED%98%95%EC%9D%BC%EA%B9%8C
