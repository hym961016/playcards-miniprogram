import request from "../utils/requset";

export function getTotalInfo() {
  return request({ url: "/v1/room/getTotalInfo", method: "get" });
}

export function getHistory() {
  return request({ url: "/v1/room/getHistory", method: "post" });
}
