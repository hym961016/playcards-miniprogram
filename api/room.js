


export function exitRoom() {
  return request({ url: "/v1/game/exitRoom", method: "post" });
}