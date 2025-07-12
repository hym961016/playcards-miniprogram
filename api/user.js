import request from "../utils/requset";

export function getUserInfo() {
  return request({ url: "/v1/user/getUserInfo", method: "get" });
}

export function updateAvatarNickname(data) {
  return request({ url: "/v1/user/updateAvatarNickname", method: "post", data });
}
