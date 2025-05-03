import { KyInstance, KyRequest, Options, default as ky } from "ky";
import { getCookie } from "./cookie";

const BASE_API = "http://localhost:3001";
export const createApi = (defaultOptions: Options) => ky.create(defaultOptions);

export const commonApi: KyInstance = createApi({
  prefixUrl: BASE_API,
  retry: 0,
  hooks: {
    beforeRequest: [
      async (request: KyRequest) => {
        if (typeof window !== "undefined") {
          const token = getCookie("atk");

          if (token) {
            request.headers.set("Authorization", `${token}`);
          }
        }
      },
    ],
    afterResponse: [],
  },
});
