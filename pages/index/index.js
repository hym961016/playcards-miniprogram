// index.js
import { getUserInfo } from "../../api/user";
import { createRoom, isInRoom } from "../../api/game";

const app = getApp();

Page({
  data: {
    userInfo: {
      nickname: "",
      avatar: "",
    },
  },
  onLoad() {
    this.getUserInfo();
  },
  onShow() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    }
  },
  getUserInfo() {
    console.log("getUserInfo");
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      });
    } else {
      getUserInfo().then((res) => {
        this.setData({
          userInfo: res,
        });
        console.log(res);
        app.globalData.userInfo = res;
      });
    }
  },
  // 开房
  openRoom() {
    app.starx.request("room.CreateRoom", (res) => {
      console.log(res);
      wx.redirectTo({
        url: "../room/room?roomNo=" + res.roomNo,
      });
    });
  },
  getRoom(e) {
    wx.navigateTo({
      url: "../setting/setting?from=getRoom",
    });
  },
  createRoomAction() {
    wx.showLoading({
      title: "加载中",
    });
    createRoom().then((res) => {
      console.log(res);
      wx.hideLoading();
      if (res.statusCode === 0) {
        wx.redirectTo({
          url: "../room/room?roomNo=" + res.roomNo,
        });
      }
    });
  },
  toUpdateUserInfoView(e) {
    wx.navigateTo({
      url: "../setting/setting",
    });
  },
});
