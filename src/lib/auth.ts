import * as arctic from "arctic";

const clientId = process.env.NEXT_PUBLIC_KAKAO_LOGIN_CLIENT_ID ?? "";
const clientSecret = process.env.NEXT_PUBLIC_KAKAO_LOGIN_SECRET_KEY ?? "";
const redirectURI = process.env.NEXT_PUBLIC_KAKAO_LOGIN_REDIRECT_URL ?? "";

export const kakao = new arctic.Kakao(clientId, clientSecret, redirectURI);
