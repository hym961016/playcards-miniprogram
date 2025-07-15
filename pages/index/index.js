// index.js
const app = getApp();

Page({
  data: {
    userInfo: {
      nickname: "",
      avatar: "",
    },
  },
  onLoad() {
    console.log("on index load start...");
    this.getUserInfo();
    console.log("on index load end...");
  },
  onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
    app.isInRoom();
  },
  getUserInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    } else {
      app.getUserInfo().then((res) => {
        this.setData({
          userInfo: res,
        });
      });
    }
  },
  // 我要开房
  openRoom() {
    console.log("我要开房");
    app.starx.request("room.CreateRoom", (res) => {
      console.log(res);
      if (res.code === 0) {
        wx.redirectTo({
          url: "../room/room?roomNo=" + res.roomNo,
        });
      } else {
        wx.showToast({
          title: res.error,
          icon: "none",
        });
      }
    });
  },
  // 扫码进房
  scanRoom() {
    console.log("扫码进房");
    wx.scanCode({
      scanType: ["wxCode"],
      success: (res) => {
        console.log(res);
        app.starx.request("room.JoinRoom", (res) => {
          wx.redirectTo({
            url: "../room/room?roomNo=" + res.roomNo,
          });
        });
      },
      fail: (err) => {
        console.log(err);
      },
    });
  },
  toSetting(e) {
    wx.navigateTo({
      url: "../setting/setting",
    });
  },
});
