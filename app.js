// app.js
const starx = require("./utils/starx-wsclient");
import config from "./config/env";
import { getUserInfo } from "./api/user";

App({
  async onLaunch() {
    this.starx = starx;
    // 1.用户登录
    // 2.获取用户信息
    await this.getUserInfo();
    starx.on("io-error", this.onConnectError);
    starx.on("close", this.onStarxClose);
    starx.on("isInRoom", this.isInRoom);
    starx.on("reconnect", this.isInRoom);
    this.loginGameServer();
  },
  async getUserInfo() {
    this.globalData.userInfo = await getUserInfo();
    return this.globalData.userInfo;
  },
  onConnectError(err) {
    console.log("游戏服务器连接失败", err);
  },
  onReconnect() {
    console.log("游戏服务器重新连接");
  },
  onStarxClose(e) {
    this.loginGameServerState = false;
    console.log("游戏服务器连接关闭", e);
    // 小程序挂起连接断开（进入后台时间超过5s）
    if (e.code === 0) {
      // 重新登录
      this.loginGameServer();
    }
  },
  // 检查当前是否正在房间中
  checkUnCompleteRoom() {
    starx.request("room.UnCompleteRoom", (res) => {
      // 正在房间中
      if (res.exist) {
        // 如果是在首页，触发系统提示
        starx.emit("showUnCompleteTip", res.roomNo);
        // 如果是在房间，触发重新进入房间
        starx.emit("onReJoinRoom", res.roomNo);
      }
    });
  },
  loginGameServer() {
    starx.init({ host: config.host, port: config.port, path: "/vertex" }, (socket) => {
      console.log("initialized", socket);
      this.socket = socket;
      this.starx = starx;
      starx.request("player.Login", this.globalData.userInfo, (res) => {
        console.log(res);
        this.loginGameServerState = true;
        console.log("登录游戏服务器成功");
        this.checkUnCompleteRoom();
      });
    });
  },
  starx: null,
  socket: null,
  loginGameServerState: false,
  globalData: {
    userInfo: null,
  },
});
