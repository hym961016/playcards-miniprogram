// pages/setting/setting.js
import { updateUserInfo } from "../../api/user";

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
const app = getApp();

Page({

  data: {
    userInfo: {
      nickName: "",
      avatar: defaultAvatarUrl
    }
  },

  onLoad(options) {
    const userInfo = wx.getStorageSync("userInfo")
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
  },
  onChooseAvatar(e) {
    console.log(e);
    const { avatarUrl } = e.detail 
    this.setData({
      "userInfo.avatar": avatarUrl,
    })
  },
  onInputChange(e) {
    console.log(e.detail.value);
    this.setData({
      "userInfo.nickName": e.detail.value,
    })
  },
  confirm() {
    console.log(this.data.userInfo)
    updateUserInfo(this.data.userInfo).then(res=> {
      if(res.statusCode === 0) {
        wx.setStorageSync('userInfo', this.data.userInfo)

        app.globalData.isCreateRoom = true
        wx.navigateBack()
      }
    })
  },
  cancel() {
    wx.navigateBack()
  }
})