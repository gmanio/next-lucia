export const getCookie = (cookieName: string) => {
  const cookie = document.cookie
    .split(";")
    .filter((item) => item.trim().startsWith(cookieName + "="));
  return cookie && cookie.length > 0
    ? unescape(cookie[0].split("=")[1])
    : undefined;
};

export const setCookie = (name: string, value: string, exp?: number) => {
  const exdate = new Date(exp ?? "");
  // exdate.setDate(exdate.getDate() + (exdays ?? 60 * 24 * 24));
  const cookieValue =
    escape(value) +
    ";path=/" +
    (exp === null ? "" : ";expires=" + exdate.toUTCString());
  document.cookie = name + "=" + cookieValue;
};
