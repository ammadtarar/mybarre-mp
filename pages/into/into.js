// pages/into/into.js
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
    coverImgUrl: urls.baseUrl + "download/static/bg_launch.jpg"
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    this.getConfigs();
    this.loginOrRegister();
  },
  onClickPopupPositiveButton: function () {
    this.resetAndHideModal()
  },
  onClickPopupNegativeButton: function () {
    this.resetAndHideModal()
  },
  getConfigs: function(){
    let ctx = this;
    wx.request({
      url: urls.getUrl('CONFIGS'),
      success(res){
        wx.setStorageSync('production_ready', res.data.data.production_ready)
      },
      fail(err){
        console.log(err);
        wx.setStorageSync('production_ready', true)
      }
    })
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
  loginOrRegister(){
    wx.showNavigationBarLoading();
    // const openId = wx.getStorageSync('open_id') || '';
    const openId = "o-caX5KOsTiYqthLM-UjuVHb0sOU";
    const ctx = this;
    var url = "";
    if (openId !== '') {
      ctx.process(urls.getUrl('LOGIN_BY_OPEN_ID'), { open_id: openId });
    } else {
      url = urls.getUrl('REGISTER');
      wx.login({
        success: res => {
          ctx.process(urls.getUrl('REGISTER'), { jscode: res.code});
        }
      })
    }
  },
  process: function(url , data){
    const ctx = this;
    wx.request({
      url: url,
      method: 'POST',
      data: data,
      success: regRes => {
        if (regRes.statusCode >= 200 && regRes.statusCode <= 299) {
          ctx.saveData(regRes.data.data);
          wx.hideNavigationBarLoading()
          const name = regRes.data.data.first_name || '';
          if (name === '') {
            wx.redirectTo({
              url: '/pages/landing/landing',
            });
          } else {


            if(regRes.data.data.status === 'pending' && regRes.data.data.type === 'legacy'){
              wx.redirectTo({
                url: '/pages/userApprovalPending/userApprovalPending',
              })
            }else if(regRes.data.data.status === 'rejected' && regRes.data.data.type === 'legacy'){
              wx.redirectTo({
                url: '/pages/userApprovalPending/userApprovalPending?message=' + regRes.data.data.message,
              })
            }else{
              wx.redirectTo({
                url: '/pages/home/home',
              })
            }
          }
        } else {
          wx.hideNavigationBarLoading()
          const openId = wx.getStorageSync('open_id') || '';
          if(openId !== ''){
            wx.setStorageSync('token', '');
            wx.setStorageSync('open_id', '');
            wx.setStorageSync('id', '');
            wx.setStorageSync('name', '');
            wx.setStorageSync('phone', '');
            wx.setStorageSync('email', '');
            wx.setStorageSync('gender', '');
            ctx.loginOrRegister()
          }else{
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
  saveData:function(data){
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