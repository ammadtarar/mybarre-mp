// pages/landing/landing.js
var app = getApp();
const urls = require('../../utils/urls.js');
Page({
  data: {
    recieve: ['recieveOne' , 'recieveTwo', 'recieveThree'],
    includes: ['includesOne', 'includesTwo', 'includesThree', 'includesFour', 'includesFive', 'includesSix', 'includesSeven' ],
    locale: wx.getStorageSync('locale'),
    coverImgUrl: urls.baseUrl + "download/static/bg_landing.png"
  },
  onLoad: function (options) {
    wx.hideHomeButton();
    wx.setNavigationBarTitle({
      title: 'MYbarre'
    });
  },
  goToRegister: function(e){
    wx.navigateTo({
      url: '/pages/coursesList/coursesList?needRegistration=true'
    });
  },
  goToLogin: function (e) {
  },
  onClickLegacyMember: function(){
    wx.navigateTo({
      url: '/pages/legacyRegister/legacyRegister',
    })
  }
  
})