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
    this.loginGameServer();
  },
  async getUserInfo() {
    this.globalData.userInfo = await getUserInfo();
    return this.globalData.userInfo;
  },
  onConnectError(err) {
    console.log("游戏服务器连接失败", err);
  },
  onStarxClose(e) {
    console.log("游戏服务器连接关闭", e);
  },
  loginGameServer() {
    starx.init({ host: "192.168.1.3", port: 8080, path: "/vertex", reconnect: true }, () => {
      console.log("initialized");
      this.starx = starx;
      // starx.request("player.Login", this.globalData.userInfo, (res) => {
      //   console.log(res);
      //   console.log("登录游戏服务器成功");
      //   wx.onAppShow((options) => {
      //     console.log("app show:", options);
      //     this.loginGameServer();
      //   });
      //   wx.onAppHide((res) => {
      //     console.log("app hide:", res);
      //     starx.disconnect();
      //   });
      // });
    });
  },
  starx: null,
  globalData: {
    userInfo: null,
  },
});
