// utils/request.js

// const BASE_URL = "http://localhost:8080/api";
const HOST = "localhost";
const PORT = "8080";
const BASE_URL = `http://${HOST}:${PORT}/api`;

// 请求封装
function request({ url, method = "GET", data = {}, header = {} }) {
  return new Promise((resolve, reject) => {
    // 检查登录态
    checkLogin()
      .then(() => {
        // 发起请求
        const token = wx.getStorageSync("token");
        wx.request({
          url: BASE_URL + url,
          method,
          data,
          header: {
            ...header,
            Authorization: token ? `Bearer ${token}` : "", // 设置 Token
          },
          success(res) {
            if (res.statusCode === 200) {
              resolve(res.data);
            } else if (res.statusCode === 401 || res.statusCode === 403) {
              // Token 无效，重新登录
              login()
                .then(() => request({ url, method, data, header }).then(resolve).catch(reject))
                .catch(reject);
            } else {
              reject(res.data);
            }
          },
          fail(err) {
            reject(err);
          },
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
}

// 检查登录态
function checkLogin() {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync("token");
    if (token) {
      resolve();
    } else {
      // 无 Token，自动登录
      login().then(resolve).catch(reject);
    }
  });
}

// 登录
function login() {
  return new Promise((resolve, reject) => {
    wx.login({
      success(res) {
        if (res.code) {
          // 向后端发送登录请求，换取 Token
          wx.request({
            url: BASE_URL + "/v1/user/login",
            method: "POST",
            data: { code: res.code },
            success(loginRes) {
              if (loginRes.statusCode === 200) {
                const { token } = loginRes.data;
                wx.setStorageSync("token", token); // 存储 Token
                resolve();
              } else {
                reject(loginRes.data);
              }
            },
            fail(err) {
              reject(err);
            },
          });
        } else {
          reject(new Error("wx.login 失败"));
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

export default request;
