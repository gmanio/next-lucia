import NextAuth from "next-auth";
import * as arctic from "arctic";
import { TypeORMAdapter } from "@auth/typeorm-adapter";
// import Kakao from "next-auth/providers/kakao";
import Credentials from "next-auth/providers/credentials";
import { connection } from "@/lib";
// import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const clientId = process.env.NEXT_PUBLIC_KAKAO_LOGIN_CLIENT_ID ?? "";
const clientSecret = process.env.NEXT_PUBLIC_KAKAO_LOGIN_SECRET_KEY ?? "";
const redirectURI = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URL ?? "";

export const kakao = new arctic.Kakao(clientId, clientSecret, redirectURI);

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  debug: true,
  adapter: TypeORMAdapter(connection),
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize({ request }) {
        console.log(request);
        // const response = await fetch(request);
        // if (!response.ok) return null;
        return {};
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
});
