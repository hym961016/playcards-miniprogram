import request from "../utils/requset";

export function getTotalInfo() {
  return request({ url: "/v1/room/getTotalInfo", method: "get" });
}

export function getHistory() {
  return request({ url: "/v1/room/getHistory", method: "post" });
}

export function getRecords(params) {
  const querys =
    "?" +
    Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join("&");
  return request({ url: "/v1/room/getRecords" + querys, method: "get" });
}
