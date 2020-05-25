// pages/ceLanding/ceLanding.js
const urls = require('../../utils/urls.js');

Page({

  /**
   * Page initial data
   */
  data: {
    locale: wx.getStorageSync('locale'),
    showPopup: false,
    popupNegText: "",
    showPopupNegBtn: "",
    popupTitle: "",
    popupMsg: "",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    coverImgUrl: urls.baseUrl + "download/static/bg_launch.jpg"
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.loginOrRegister();
  },
  bindGetUserInfo(e) {
    this.updateProfile(e.detail.userInfo)
  },
  updateProfile(userData){
    wx.showLoading()
    wx.request({
      url: urls.getUrl('UPDATE_PROFILE'),
      method: 'POST',
      header: {
        Authorization: wx.getStorageSync('token')
      },
      data: {
        nickname: userData.nickname,
        gender:  userData.gender === 1 ? 'male' : 'female',
        nationality: userData.country,
        city: userData.city,
        address: userData.city + " , " + userData.province + " , " + userData.country,
        avatar_url: userData.avatarUrl
      },
      success: regRes => {
        wx.hideLoading()
        wx.setStorageSync('name', userData.nickname);
        wx.setStorageSync('gender', userData.gender === 1 ? 'male' : 'female');
        wx.hideLoading()
        wx.redirectTo({
          url: '/pages/ceHome/ceHome',
        })
      },
      fail: failRes => {
        wx.hideLoading()
        ctx.setData({
          showPopupNegBtn: false,
          popupType: 'warning',
          popupTitle: this.data.locale.error,
          popupMsg: failRes.errMsg,
          showPopup: true
        })
        
      }
    })

  },
  onClickPopupPositiveButton: function () {
    this.resetAndHideModal()
  },
  onClickPopupNegativeButton: function () {
    this.resetAndHideModal()
  },
  resetAndHideModal: function () {
    this.setData({
      showPopup: false,
      popupTitle: '',
      popupMsg: '',
      showPopupNegBtn: false,
      popupNegText: '',
      popupType: ''
    })
  },
  loginOrRegister() {
    wx.showNavigationBarLoading();
    const openId = wx.getStorageSync('open_id') || '';
    const ctx = this;
    var url = "";
    if (openId !== '') {
      ctx.process(urls.getUrl('LOGIN_BY_OPEN_ID'), { open_id: openId, type: 'ce-only' });
    } else {
      url = urls.getUrl('REGISTER');
      wx.login({
        success: res => {
          ctx.process(urls.getUrl('REGISTER'), { jscode: res.code, type: 'ce-only' });
        }
      })
    }
  },
  process: function (url, data) {
    const ctx = this;
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      success: regRes => {
        if (regRes.statusCode >= 200 && regRes.statusCode <= 299) {
          ctx.saveData(regRes.data.data);
          wx.hideNavigationBarLoading()

          console.log("RESPONSE")
          console.log(regRes.data.data)



          wx.getSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                wx.getUserInfo({
                  success: function (res) {
                    ctx.updateProfile(res.userInfo)
                  }
                })
              }
            }
          })


        } else {
          wx.hideNavigationBarLoading()
          const openId = wx.getStorageSync('open_id') || '';
          if (openId !== '') {
            wx.setStorageSync('token', '');
            wx.setStorageSync('open_id', '');
            wx.setStorageSync('id', '');
            wx.setStorageSync('name', '');
            wx.setStorageSync('phone', '');
            wx.setStorageSync('email', '');
            wx.setStorageSync('gender', '');
            ctx.loginOrRegister()
          } else {
            ctx.setData({
              showPopupNegBtn: false,
              popupType: 'warning',
              popupTitle: this.data.locale.error,
              popupMsg: regRes.data.message,
              showPopup: true
            })
          }

        }
      },
      fail: err => {
        wx.hideNavigationBarLoading()
        ctx.setData({
          showPopupNegBtn: false,
          popupType: 'warning',
          popupTitle: this.data.locale.error,
          popupMsg: err.errMsg,
          showPopup: true
        })
      }
    })
  },
  saveData: function (data) {
    wx.setStorageSync('token', data.token);
    wx.setStorageSync('open_id', data.open_id);
    wx.setStorageSync('user_id', data.id);
    wx.setStorageSync('first_name', data.first_name);
    wx.setStorageSync('last_name', data.last_name);
    wx.setStorageSync('nickname', data.nickname);
    wx.setStorageSync('phone', data.phone);
    wx.setStorageSync('email', data.email);
    wx.setStorageSync('gender', data.gender);
    wx.setStorageSync('avatar_url', data.avatar_url);
  }
})