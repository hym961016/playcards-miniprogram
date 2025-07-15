// app.js
const starx = require("./utils/starx-wsclient");
import { getUserInfo } from "./api/user";

App({
  async onLaunch() {
    // 1.用户登录
    // 2.获取用户信息
    await this.getUserInfo();
    starx.on("io-error", this.onConnectError);
    starx.on("close", this.onStarxClose);
    starx.on("isInRoom", this.isInRoom);
    this.loginGameServer();
  },
  async getUserInfo() {
    this.globalData.userInfo = await getUserInfo();
    return this.globalData.userInfo;
  },
  isInRoom() {
    if (this.starx) {
      this.starx.request("player.IsInRoom", (res) => {
        if (res.isInRoom) {
          wx.redirectTo({
            url: "../room/room?roomNo=" + res.roomNo,
          });
        }
      });
    }
  },
  onConnectError(err) {
    console.log("游戏服务器连接失败", err);
  },
  onStarxClose(e) {
    console.log("游戏服务器连接关闭", e);
  },
  loginGameServer() {
    starx.init({ host: "localhost", port: 8080, path: "/vertex", reconnect: true }, (socket) => {
      console.log("initialized", socket);
      this.socket = socket;
      this.starx = starx;
      starx.request("player.Login", this.globalData.userInfo, (res) => {
        console.log(res);
        console.log("登录游戏服务器成功");
        starx.emit('isInRoom')
      });
    });
  },
  starx: null,
  socket: null,
  globalData: {
    userInfo: null,
  },
});
