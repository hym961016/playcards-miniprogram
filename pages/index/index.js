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
    app.starx.on("showUnCompleteTip", this.showUnCompleteTip);
    console.log("on index load start...");
    this.getUserInfo();
    console.log("on index load end...");
  },
  onUnload() {
    app.starx.off("showUnCompleteTip", this.showUnCompleteTip);
  },
  onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
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
  showUnCompleteTip(roomNo) {
    wx.showModal({
      title: "系统提示",
      content: "你当前正在房间中，是否进入房间？",
      confirmText: "进入房间",
      cancelText: "退出房间",
      success: function (res) {
        if (res.confirm) {
          console.log("用户点击进入房间");
          app.starx.request("room.ReJoinRoom", { roomNo }, (res) => {
            wx.redirectTo({
              url: "../room/room?roomNo=" + res.roomNo,
            });
          });
        } else if (res.cancel) {
          console.log("用户点击次要操作");
          app.starx.request("room.ExitRoom", {});
        }
      },
    });
  },
  checkUnCompleteRoom() {
    app.starx.request("room.UnCompleteRoom", (res) => {
      console.log("UnCompleteRoom", res);
      if (res.exist) {
        const roomNo = res.roomNo;
        wx.showModal({
          title: "系统提示",
          content: "你当前正在房间中，是否进入房间？",
          confirmText: "进入房间",
          cancelText: "退出房间",
          success: function (res) {
            if (res.confirm) {
              console.log("用户点击进入房间");
              app.starx.request("room.ReJoinRoom", { roomNo }, (res) => {
                wx.redirectTo({
                  url: "../room/room?roomNo=" + res.roomNo,
                });
              });
            } else if (res.cancel) {
              console.log("用户点击次要操作");
              app.starx.request("room.ExitRoom", {});
            }
          },
        });
      }
    });
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
        const roomNo = res.path.split("?")[1].split("=")[1];
        console.log(roomNo);
        app.starx.request("room.JoinRoom", { roomNo }, (res) => {
          wx.redirectTo({
            url: res.path,
            url: "../room/room?roomNo=" + roomNo,
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
