// app.js
const starx = require("./utils/starx-wsclient");
import { getUserInfo } from "./api/user";

App({
  async onLaunch() {
    console.log("on launch start...");
    // 1.用户登录
    // 2.获取用户信息
    await this.getUserInfo();
    // 2.连接游戏服务器
    // 3.登录游戏服务器
    this.loginGameServer();
    console.log("on launch end...");
  },
  async onShow() {
    console.log("on app show...");
    // 如果状态不是连接状态，则重新连接
    // if (this.starx && starx.state() !== 1) {
    //   starx.init({ host: "192.168.1.3", port: 8080, path: "/vertex" }, () => {
    //     console.log("initialized");
    //     this.starx = starx;
    //     starx.request("player.Login", this.globalData.userInfo, (res) => {
    //       console.log(res);
    //     });
    //   });
    // }
  },
  onHide() {
    console.log("on app hide...");
    starx.disconnect();
  },
  async getUserInfo() {
    this.globalData.userInfo = await getUserInfo();
    return this.globalData.userInfo;
  },
  loginGameServer() {
    starx.on("io-error", (err) => {
      console.log("游戏服务器连接失败", err);
    });
    starx.on("close", (e) => {
      console.log("游戏服务器连接关闭", e);
    });
    starx.init({ host: "localhost", port: 8080, path: "/vertex" }, () => {
      console.log("initialized");
      this.starx = starx;
      starx.request("player.Login", this.globalData.userInfo, (res) => {
        console.log(res);
        console.log("登录游戏服务器成功");
      });
    });
  },
  starx: null,
  globalData: {
    userInfo: null,
  },
});
