// app.js
const starx = require("./utils/starx-wsclient");
import { getUserInfo } from "./api/user";

App({
  onLaunch() {
    this.getUserInfo();
  },
  async getUserInfo() {
    const userInfo = await getUserInfo();
    this.globalData.userInfo = userInfo;
    starx.init({ host: "127.0.0.1", port: 8080, path: "/vertex" }, () => {
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
