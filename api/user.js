import request from "../utils/requset";

export function getUserInfo() {
  return request({ url: "/v1/user/getUserInfo", method: "get" });
}

export function updateUserInfo(data) {
  return request({ url: "/v1/user/updateUserInfo", method: "post", data });
}
