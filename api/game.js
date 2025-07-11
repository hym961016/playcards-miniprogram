import request from "../utils/requset";

// 创建房间 
export function createRoom() {
  return request({ url: "/v1/game/createRoom", method: "post" });
}

// 加入房间
export function joinRoom(roomNo) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync("token");
    const ws = wx.connectSocket({
      url: `ws://localhost:8080/api/v1/game/joinRoom?roomNo=${roomNo}`,
      header: {
        Authorization: token ? `Bearer ${token}` : "",
      },
      success: (res) => {
        console.log(res);
      },
      fail: (err) => {
        console.log(err);
        reject(err);
      },
    });
    resolve(ws);
  });
}

export function isInRoom() {
  return request({ url: "/v1/game/isInRoom", method: "get" });
}

export function exitRoom() {
  return request({ url: "/v1/game/exitRoom", method: "post" });
}
