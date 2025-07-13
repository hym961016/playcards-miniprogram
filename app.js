// app.js
const starx = require("./utils/starx-wsclient");
import { getUserInfo } from "./api/user";

App({
  onLaunch() {
    console.log("on launch...");
    this.getUserInfo();
  },
  onShow() {
    console.log("on app show...");
    // 如果状态不是连接状态，则重新连接
    if (this.starx && starx.state() !== 1) {
      starx.init({ host: "192.168.1.3", port: 8080, path: "/vertex" }, () => {
        console.log("initialized");
        this.starx = starx;
        starx.request("player.Login", this.globalData.userInfo, (res) => {
          console.log(res);
        });
      });
    }
  },
  onHide() {
    console.log("on app hide...");
    starx.disconnect();
  },
  async getUserInfo() {
    const userInfo = await getUserInfo();
    this.globalData.userInfo = userInfo;
    starx.init({ host: "192.168.1.3", port: 8080, path: "/vertex" }, () => {
      console.log("initialized");
      this.starx = starx;
      starx.request("player.Login", userInfo, (res) => {
        console.log(res);
      });
    });
  },
  starx: null,
  globalData: {
    userInfo: null,
  },
});
